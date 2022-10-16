import crypto from 'crypto';
import AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

import ImportProduct from '@models/importProduct';
import FullProduct from '@models/fullProduct';

export default class CreateProductsServerice {

    async createProduct(body: ImportProduct): Promise<FullProduct> {
        const uuid = crypto.randomUUID();

        const productParams = {
            TableName: process.env.PRODUCTS_TABLE,
            Item: {
                id: uuid,
                description: body.description,
                price: Number(body.price),
                title: body.title
            }
        }

        const stockParams = {
            TableName: process.env.STOCKS_TABLE,
            Item: {
                product_id: productParams.Item.id,
                count: Number(body.count)
            }
        }

        await dynamo.transactWrite({
            TransactItems: [
              {
                Put: productParams,
              },
              {
                Put: stockParams,
              }
            ]
        }).promise();

        return {
            id: uuid,
            title: body.title,
            description: body.description,
            count: Number(body.count),
            price: Number(body.price)
        };
     }

}