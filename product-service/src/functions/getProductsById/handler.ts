import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatNotFoundResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import productList from './mock.json';
import productsService from '../../service';

const productsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const id = event.pathParameters.productId;
    const product = await productsService.getProductById(id, productList);

    if (!product) {
      return formatNotFoundResponse(`Product with ID = ${id} not found`);
    }
    
    return formatJSONResponse({
      ...product
    });
};

export const main = middyfy(productsById);
