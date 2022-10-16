import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';
// import dynamoResources from  './dynamoResources';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SNS_ARN: "arn:aws:sns:eu-west-1:${env:AWS_ACCOUNT_ID}:${env:TOPIC_NAME}",
      PRODUCTS_TABLE: '${env:PRODUCTS_TABLE}',
      STOCKS_TABLE: '${env:STOCKS_TABLE}'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: "arn:aws:dynamodb:${self:provider.region}:${env:AWS_ACCOUNT_ID}:table/${env:PRODUCTS_TABLE}"
      },
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: "arn:aws:dynamodb:${self:provider.region}:${env:AWS_ACCOUNT_ID}:table/${env:STOCKS_TABLE}"
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: "arn:aws:sqs:eu-west-1:${env:AWS_ACCOUNT_ID}:${env:CATALOG_ITEMS_QUEUE_NAME}"
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: "arn:aws:sns:eu-west-1:${env:AWS_ACCOUNT_ID}:${env:TOPIC_NAME}"
      }
  ]
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: '${env:CATALOG_ITEMS_QUEUE_NAME}'
        },
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: '${env:TOPIC_NAME}'
        },
      },
      SNSSubcsription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '${env:EMAIL}',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
