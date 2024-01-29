import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{id}',
        responses: {
          200: {
            description: 'Successful API Response',
            bodyType: 'Product'
          }
        }
      },
    },
  ],
};
