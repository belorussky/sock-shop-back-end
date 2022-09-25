import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import productList from './mock.json';

const productsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const id = event.pathParameters.productId;
    const item = Object.values(productList).filter(e => {
        if(Object.values(e).find(v => v === id)) {
            return Object.values(e);
        }
    })
    // const item = Object.keys(productList).map((key) => [typeof productList[key], productList[key]]);
    // const item = productList.forEach(val => {
    //     console.log(val);
    //   });
    // ...productList.map(x => x.count)
    // try {
    //     const todo = await todosService.getTodo(id)
    //     return formatJSONResponse({
    //         todo, id
    //     });
    // } catch (e) {
    //     return formatJSONResponse({
    //         status: 500,
    //         message: e
    //     });
    // }
  return formatJSONResponse({
    ...item
  });
};

export const main = middyfy(productsById);
