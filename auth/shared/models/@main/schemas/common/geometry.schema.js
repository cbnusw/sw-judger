const { createSchema } = require('../../../helpers');

const schema = createSchema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  }
}, false);

module.exports = schema;
