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
            var params = {
                TableName: "envios",
                IndexName: "EnviosPendientesIndex",
                ProjectionExpression: "id, fechaAlta, pendiente, destino, email",
                ScanIndexForward: "false"
            };
            return await docClient
                .scan(params)
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
            var params = {
                TableName: "envios"
            };
            return await docClient
                .scan(params)
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
            var params = {
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
                .put(params)
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
            var params = {
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
                .update(params)
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