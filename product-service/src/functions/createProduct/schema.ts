export default {
    type: "object",
    properties: {
      count: { type: 'number'},
      description: { type: 'string'},
      price: { type: 'number'},
      title: { type: 'string' }
    },
    required: ['count', 'description', 'price', 'title']
  } as const;