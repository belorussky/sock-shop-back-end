import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import productList from './mock.json';
import productsService from '../../service';

const products: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const products = await productsService.getProducts(productList);
  
  return formatJSONResponse({
    ...products
  });
};

export const main = middyfy(products);
