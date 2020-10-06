var AWS = require("aws-sdk");
var { nanoid } = require("nanoid");
var moment = require("moment"); 

var handler = async (event) => {
    var dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345' 
        }
    });

    var docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });

    switch(event.httpMethod) {

        case "GET":
          if(event.path == '/envios/pendientes'){
            const paramsGet = {
                TableName: "envios",
                FilterExpression: "attribute_exists(pendiente)"
            };
            return await docClient
                .scan(paramsGet)
                .promise()
                .then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data.Items),
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });
          } else {
            const paramsGet = {
                TableName: "envios"
            };
            return await docClient
                .scan(paramsGet)
                .promise()
                .then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data.Items),
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });
          }

        case "POST":
            const paramsPost = {
                TableName: "envios",
                Item: {
                    id: nanoid(),
                    fechaAlta: moment().format('MMMM Do YYYY'),
                    destino: JSON.parse(event.body).destino,
                    email: JSON.parse(event.body).email,
                    pendiente: moment().format('MMMM Do YYYY')
                }
            }
            return await docClient
                .put(paramsPost)
                .promise()
                .then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data.Items),
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });

        case "PUT":
            const paramsPut = {
                TableName: "envios",
                Key: {

                    id: event.pathParameters.idEnvio, 
                
                },
                UpdateExpression: 'REMOVE pendiente SET entregado = :set',
                ConditionExpression: 'attribute_exists(pendiente)',
                ExpressionAttributeValues: { 
                    ':set': moment().format('MMMM Do YYYY')
                }
                
            };

            return await docClient
                .update(paramsPut)
                .promise()
                .then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data.Items),
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });

    }

}

exports.handler = handler;