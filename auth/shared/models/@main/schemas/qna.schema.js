const bcrypt = require('bcrypt');
const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');
const { searchPlugin } = require('../../plugins');
const { to, toBoolean, toRegEx, toRef } = require('../../mappers');
const { QNA_CATEGORIES } = require('../../../constants');

const writerInfo = createSchema({
  name: {
    type: String,
    trim: true,
    required: true,
    index: true
  },
  department: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
  }
}, false);

const replySchema = createSchema({
  content: String,
  writer: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  writerInfo: {
    type: writerInfo,
    default: null,
  }
});

const schema = createSchema({
  category: {
    type: String,
    enum: QNA_CATEGORIES,
    index: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
    index: true,
  },
  content: {
    type: String,
    trim: true,
    required: true,
  },
  hashedPassword: {
    type: String,
    default: null
  },
  writer: {
    type: Schema.Types.ObjectId,
    index: true,
    default: null
  },
  writerInfo: {
    type: writerInfo,
    default: null,
  },
  confirm: {
    type: Boolean,
    index: true,
    default: false,
  },
  replies: [replySchema]
});

schema.index({ createdAt: -1 });

schema.virtual('password')
  .set(function (password) {
    this.hashedPassword = bcrypt.hashSync(password, 12);
  });

schema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

schema.plugin(searchPlugin({
  sort: '-createdAt',
  select: 'category title secret writerInfo.name writerInfo.department writer confirm createdAt replies._id',
  mapper: {
    title: toRegEx,
    category: to,
    'writerInfo.name': toRegEx,
    confirm: toBoolean,
    writer: toRef('UserInfo', {
      name: toRegEx,
    })
  }
}));

module.exports = schema;
