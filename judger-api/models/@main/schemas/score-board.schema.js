const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');
const { searchPlugin } = require('../../plugins');
const { toRegEx, toRef } = require('../../mappers');

const scoreSchema = createSchema({
  problem: {
    type: Schema.Types.ObjectId,
    ref: 'Problem'
  },
  right: {
    type: Boolean,
    default: false,
  },
  tries: {
    type: Number,
    default: 0,
  },
  time: {
    type: Number,
    default: 0,
  }
}, false);

const schema = createSchema({
  contest: {
    type: Schema.Types.ObjectId,
    ref: 'Contest',
    index: true,
    required: true,
  },
  scores: [scoreSchema],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    required: true,
  }
});

schema.index({ createdAt: -1 });
schema.index({ contest: 1, user: 1 }, { unique: true });

schema.plugin(searchPlugin({
  mapper: {
    title: toRegEx,
    user: toRef('UserInfo', {
      name: toRegEx
    }),
    problem: toRef('Problem', {
      title: toRegEx
    }),
  }
}));

module.exports = schema;
