const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');
const { FILE_ACCESS, FILE_TYPES } = require('../../../constants');

const accessSchema = {
  type: String,
  enum: FILE_ACCESS
};

const schema = createSchema({
  url: {
    type: String,
    unique: true,
    sparse: true,
  },
  filename: String,
  mimetype: String,
  size: Number,
  access: {
    type: [accessSchema],
    default: [...FILE_ACCESS]
  },
  ref: {
    type: Schema.Types.ObjectId,
    refPath: 'refModel',
    default: null,
  },
  refModel: {
    type: String,
    enum: [...FILE_TYPES, null],
    default: null,
  },
  uploader: {
    type: Schema.Types.ObjectId,
    index: true,
  }
}, {
  createdAt: 'uploadedAt',
  updatedAt: false
});

schema.index({ ref: 1, refModel: 1 });
schema.index({ uploadedAt: 1 });

schema.statics.findByUrl = function (url) {
  return this.findOne({ url });
};

module.exports = schema;
