const { createSchema } = require('../../../helpers');

const schema = createSchema({
  basic: {
    type: String,
    index: true
  },
  detail: String,
  eng: String,
  postCode: String,
}, false);

module.exports = schema;
