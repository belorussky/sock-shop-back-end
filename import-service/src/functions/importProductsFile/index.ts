import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
                "name": true
            }
          }
        },
        authorizer: {
          name: "basicAuthorizer",
          arn: "arn:aws:lambda:eu-west-1:${env:AWS_ACCOUNT_ID}:function:${env:AUTHORIZER}",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: "token"
        },
      },
    },
  ],
};
