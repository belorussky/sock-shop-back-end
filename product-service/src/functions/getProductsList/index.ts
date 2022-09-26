import { handlerPath } from '@libs/handler-resolver';
// import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        responses: {
          200: {
            description: 'successful API Response',
            bodyType: 'Products'
          }
        },
      },
    },
  ],
};
