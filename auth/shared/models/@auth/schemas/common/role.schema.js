const { ROLES } = require('../../../../constants');

module.exports = {
  type: String,
  enum: ROLES,
  required: true,
};
