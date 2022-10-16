import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatNotFoundResponse, formatError500Response } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

import schema from './schema';

const productsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  //console.log for each incoming requests arguments
  console.log(event);

  const id = event.pathParameters.productId;

  const getProductById = async (productId: string) => {
    const product =  await dynamo.query({
        TableName: process.env.PRODUCTS_TABLE,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': productId },
    }).promise();

    return product?.Items;
  };

  const getProductStockById = async (productId: string) => {
    const stock =  await dynamo.query({
        TableName: process.env.STOCKS_TABLE,
        KeyConditionExpression: 'product_id = :id',
        ExpressionAttributeValues: { ':id': productId },
    }).promise();

    return stock.Items;
  };

  try {
    const product = await getProductById(id);

    if (product.length === 0) {
      return formatNotFoundResponse({message: `Product with ID = ${id} not found`});
    } else {
      const stock = await getProductStockById(id);
      product[0]['count'] = stock[0].count;
    }
    
    return formatJSONResponse({
      ...product
    });
  } catch(error) {
      return formatError500Response({ message: error.errorMessage });
  }
};

export const main = middyfy(productsById);
