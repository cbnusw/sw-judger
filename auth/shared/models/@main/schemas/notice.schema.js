const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');
const { searchPlugin } = require('../../plugins');
const { to, toNumber, toRef, toRegEx } = require('../../mappers');
const { NOTICE_ACCESS, NOTICE_CATEGORIES } = require('../../../constants');

const accessSchema = {
  type: String,
  enum: NOTICE_ACCESS
}

const schema = createSchema({
  category: {
    type: String,
    enum: NOTICE_CATEGORIES,
    index: true,
  },
  title: {
    type: String,
    trim: true,
    index: true,
  },
  important: {
    type: Boolean,
    default: false,
    index: true,
  },
  period: {
    type: Date,
    index: true,
    default: null,
  },
  access: {
    type: [accessSchema],
    default: [...NOTICE_ACCESS]
  },
  writer: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true,
  },
  content: String,
  hits: {
    type: Number,
    default: 0,
  },
  attachments: [{ type: Schema.Types.ObjectId, ref: 'File', required: true }]
});

schema.index({ createdAt: -1 });

schema.statics.findByIdNo = function (no, category, cb) {
  return this.findOne({ no, category }, cb);
};

schema.plugin(searchPlugin({
  sort: '-createdAt',
  mapper: {
    no: toNumber,
    category: to,
    title: toRegEx,
    writer: toRef('UserInfo', {
      name: toRegEx,
    })
  }
}));

module.exports = schema;
