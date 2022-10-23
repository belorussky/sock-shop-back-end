import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatError500Response } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

import schema from './schema';
import FullProductsModels from '@models/fullProduct';

const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  //console.log for each incoming requests arguments
  console.log(event);

  const scanProducts = async () => {
    const scanProductResults = await dynamo.scan({
        TableName: process.env.PRODUCTS_TABLE
    }).promise();
    return scanProductResults.Items;
  };
  const scanStocks = async () => {
    const scanStockResults = await dynamo.scan({
        TableName: process.env.STOCKS_TABLE
    }).promise();
    return scanStockResults.Items;
  };


  try {
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
  } catch(error) {
      return formatError500Response({ message: error.errorMessage });
  }
};

export const main = middyfy(products);
