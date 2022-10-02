import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

import schema from './schema';
import FullProductsModels from '@models/fullProduct';

const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {

  const scanProducts = async () => {
    const scanProductResults = await dynamo.scan({
        TableName: 'Products'
    }).promise();
    return scanProductResults.Items;
  };
  const scanStocks = async () => {
    const scanStockResults = await dynamo.scan({
        TableName: 'Stocks'
    }).promise();
    return scanStockResults.Items;
  };

const scanProductResults = await scanProducts();
const scanStockResults = await scanStocks();

const productsList: FullProductsModels[] = [];
for (let i = 0; i < scanProductResults.length; i++) {
    const stock = scanStockResults.filter(e => e.product_id == scanProductResults[i].id);
    productsList.push({
          id: scanProductResults[i].id, 
          title: scanProductResults[i].title,
          description: scanProductResults[i].description,
          price: scanProductResults[i].price,
          count: stock[0].count
      });
}
  
  return formatJSONResponse({
    ...productsList
  });
};

export const main = middyfy(products);
