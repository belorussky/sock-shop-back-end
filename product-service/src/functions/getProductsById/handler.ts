import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import productsService from '../../service';

const productsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const id = event.pathParameters.productId;
    
    try {
      const product = await productsService.getProductById(id);
        return formatJSONResponse({
          product
        });
    } catch (e) {
      console.log(e);
    }
};

export const main = middyfy(productsById);
