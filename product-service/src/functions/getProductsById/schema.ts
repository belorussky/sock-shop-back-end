export default {
    type: "object",
    properties: {
      id: { type: 'string' },
      count: { type: 'number'},
      description: { type: 'string'},
      price: { type: 'number'},
      title: { type: 'string' }
    },
    required: ['id', 'count', 'description', 'price', 'title']
  } as const;