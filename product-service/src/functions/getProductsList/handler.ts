import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import productsService from '../../service';

const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const products = await productsService.getProducts();
      return formatJSONResponse({
        ...products
      });
  } catch (e) {
    console.log(e);
  }
};

export const main = middyfy(products);
