var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "2345",
        secretAccessKey: "2345",
    },
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName: "envios",
    KeySchema: [{
        AttributeName: "id",
        KeyType: "HASH",
    }, ],
    AttributeDefinitions: [{
            AttributeName: "id",
            AttributeType: "S",
        },
        {
            AttributeName: "pendiente",
            AttributeType: "S",
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
    GlobalSecondaryIndexes: [{
        IndexName: "EnviosPendientesIndex",
        KeySchema: [{
                AttributeName: "id",
                KeyType: "HASH",
            },
            {
                AttributeName: "pendiente",
                KeyType: "RANGE",
            },
        ],
        Projection: {
            ProjectionType: "KEYS_ONLY",
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
    }, ],
};
console.log("Creating table envio");
dynamodb.createTable(params, function(err, data) {
    if (err) console.error("Unable to create table envio. Error:", JSON.stringify(err, null, 2));
    else console.log("Created table envio. Description:", JSON.stringify(data, null, 2));
    console.log("Table envio Created");
});