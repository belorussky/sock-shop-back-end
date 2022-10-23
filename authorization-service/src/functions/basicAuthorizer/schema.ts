export default {
    type: 'object',
    properties: {
      authorizationToken: { type: 'string' as string },
      methodArn: { type: 'string'}
    },
    required: ['authorizationToken', 'methodArn']
  } as const;

