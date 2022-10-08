import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
// import dynamoResources from  './dynamoResources';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
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
        Resource: "arn:aws:dynamodb:${self:provider.region}:${self:custom.enviroment.AWS_ACCOUNT_ID}:table/${self:custom.enviroment.PRODUCTS_TABLE}"
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
        Resource: "arn:aws:dynamodb:${self:provider.region}:${self:custom.enviroment.AWS_ACCOUNT_ID}:table/${self:custom.enviroment.STOCKS_TABLE}"
      }
  ]
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
  // resources: {
  //   Resources: {
  //     ...dynamoResources,
  //   }
  // },
  package: { individually: true },
  custom: {
    enviroment: {
      PRODUCTS_TABLE: 'Products',
      STOCKS_TABLE: 'Stocks',
      AWS_ACCOUNT_ID: '597016584451'
    },
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
