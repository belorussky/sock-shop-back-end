export default {
  type: [{ count: 'number', description: 'string', id: 'string', price: 'number', title: 'string' }],
  properties: {
    id: { type: 'string' },
    count: { type: 'number'},
    description: { type: 'string'},
    price: { type: 'number'},
    title: { type: 'string' }
  },
  required: ['id', 'count', 'description', 'price', 'title']
} as const;
