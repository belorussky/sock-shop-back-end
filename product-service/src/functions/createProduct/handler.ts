import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatError500Response } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import createProductsServerice from '../../service';


const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    //console.log for each incoming requests arguments
    console.log(event);

    const body = event.body;

    try {
        const product = await createProductsServerice.createProduct(body);
    
        return formatJSONResponse({
            product
        });
    } catch(error) {
        return formatError500Response({ message: error.errorMessage });
    }

};

export const main = middyfy(products);
