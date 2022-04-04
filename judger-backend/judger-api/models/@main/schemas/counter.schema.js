const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { createSchema } = require('../../helpers');
const { searchPlugin } = require('../../plugins');
const { toRegEx, toRef } = require('../../mappers');
const { PARENT_TYPES } = require('../../../constants');


const schema = createSchema({
  name: { type: String, required: true },
  count: { type: Number, default: 0 },
}, { timestamps: false });

module.exports = schema;