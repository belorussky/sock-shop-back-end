import type { AWS } from '@serverless/typescript';

const dynamoResources: AWS["resources"]["Resources"] = {
    myTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
            TableName: "${self:custom.enviroment.productsTable}",
            AttributeDefinitions: [
                {
                  "AttributeName": "id",
                  "AttributeType": "S"
                },
                {
                  "AttributeName": "title",
                  "AttributeType": "S"
                }
            ],
            KeySchema: [
                {
                  "AttributeName": "id",
                  "KeyType": "HASH"
                },
                {
                  "AttributeName": "title",
                  "KeyType": "RANGE"
                }
            ],
            BillingMode: "PAY_PER_REQUEST"
        }
    }
}

export default dynamoResources;