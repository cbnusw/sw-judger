const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { createSchema } = require('../../helpers');
const { searchPlugin } = require('../../plugins');
const { toRegEx, toRef } = require('../../mappers');

const schema = createSchema({
  title: {
    type: String,
    trim: true,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    index: true,
  }
});

schema.index({ createdAt: -1 });

schema.plugin(
    searchPlugin({
      sort: '-createdAt',
      populate: [{ path: 'writer' }],
      mapper: {
        title: toRegEx,
        writer: toRef('UserInfo', {
          name: toRegEx,
        }),
      },
    })
  );

module.exports = schema;

