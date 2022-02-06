const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');
const { searchPlugin } = require('../../plugins');
const { toRegEx, toRef } = require('../../mappers');


const schema = createSchema({
  professor: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  courseNumber: {
    type: Number,
    index: true,
    require: true,
  },
  devideNumber: {
    type: Number,
    index: true,
    required: true,
  },
  assignments: [{
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  }],
})

schema.index({ courseNumber: 1, devideNumber: 1 });


module.exports = schema;