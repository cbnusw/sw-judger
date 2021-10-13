const { Types } = require('mongoose');

exports.to = v => v;
exports.toBoolean = v => String(v) === 'true';
exports.toNumber = v => isNaN(+v) ? undefined : +v;
exports.toString = v => String(v);
exports.toId = v => Types.ObjectId(v);
exports.toRegEx = require('./to-regex');
exports.toRef = require('./to-ref');
exports.toCompare = require('./to-compare');
exports.toOr = require('./to-or');
exports.toCompareOr = require('./to-compare-or');
exports.toDate = v => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
};
