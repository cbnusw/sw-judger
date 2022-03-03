const toCompare = require('./to-compare');
const toOr = require('./to-or');

module.exports = (mapper, delimiter = ',') => async v =>
  await toCompare(mapper, delimiter) || await toOr(mapper, delimiter);
