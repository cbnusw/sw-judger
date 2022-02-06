const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');
const { toRegEx, toRef } = require('../../mappers');
const { searchPlugin } = require('../../plugins');

const replySchema = createSchema({
  content: String,
  writer: {
    type: Schema.Types.ObjectId,
    required: true,
  }
});

const schema = createSchema({
  title: {
    type: String,
    trim: true,
    required: true,
    index: true,
  },
  content: String,
  writer: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  replies: [replySchema]
});

schema.index({ createdAt: -1 });

schema.plugin(searchPlugin({
  sort: '-createdAt',
  mapper: {
    title: toRegEx,
    writer: toRef('UserInfo', {
      name: toRegEx
    })
  }
}));

module.exports = schema;
