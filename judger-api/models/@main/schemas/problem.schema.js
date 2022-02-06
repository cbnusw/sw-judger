const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { createSchema } = require('../../helpers');
const { searchPlugin } = require('../../plugins');
const { toRegEx, toRef } = require('../../mappers');
const { PARENT_TYPES } = require('../../../constants');
const ioSchema = createSchema({
  // input file url
  inFile: {
    type: Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
  // input file url
  outFile: {
    type: Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
}, false);

const optionsSchema = createSchema({
  maxRealTime: {
    type: Number,
    default: null
  },
  maxMemory: {
    type: Number,
    default: null
  },
}, false);

const schema = createSchema({
  title: {
    type: String,
    trim: true,
    required: true,
    index: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    refPath: 'parentType',
    index: true,
    default: null,
  },
  parentType: {
    type: String,
    enum: [...PARENT_TYPES, null],
    index: true,
    default: null,
  },
  content: {
    type: String,
    required: true,
  },
  published: {
    type: Date,
    index: true,
    default: null,
  },
  ioSet: [ioSchema],
  options: optionsSchema,
  score: {
    type: Number,
    default: 1,
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    index: true,
  }
});

schema.plugin(searchPlugin({
  sort: '-createdAt',
  populate: [{ path: 'parentId', select: 'title'}],
  mapper: {
    title: toRegEx,
    parentId: toRef('Contest', {
      title: toRegEx
    }),
    writer: toRef('UserInfo', {
      name: toRegEx
    })
  }
}));

module.exports = schema;

