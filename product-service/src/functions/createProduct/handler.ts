import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatError500Response } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

import schema from './schema';
import crypto from 'crypto';


const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    //console.log for each incoming requests arguments
    console.log(event);

    const body = event.body;
    const uuid = crypto.randomUUID();

    const productParams = {
        TableName:'Products',
        Item:{
            id: uuid,
            description: body.description,
            price: body.price,
            title: body.title
        }
    }

    const stockParams = {
        TableName: 'Stocks',
        Item:{
            product_id: productParams.Item.id,
            count: body.count
        }
    }

    try {
        await dynamo.put(productParams)
            .promise()
    
        await dynamo.put(stockParams)
            .promise()
    
        return formatJSONResponse({
            message: "Product successfully added to the DB"
        });
    } catch(error) {
        return formatError500Response({ message: error.errorMessage });
    }

};

export const main = middyfy(products);
