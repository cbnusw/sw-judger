const { Schema } = require('mongoose');
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
  yearMonth: {
    type: String,
    match: /^\d{6}$/,  // ex) 202004
    unique: true,
    required: true,
  },
  content: String,
  link: String,
  hits: {
    type: Number,
    default: 0,
  },
  writer: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
  }
});

schema.index({ createdAt: -1 });
schema.index({ yearMonth: -1 });

schema.plugin(searchPlugin({
  sort: '-yearMonth',
  mapper: {
    title: toRegEx,
    writer: toRef('UserInfo', {
      name: toRegEx
    })
  }
}));

module.exports = schema;
