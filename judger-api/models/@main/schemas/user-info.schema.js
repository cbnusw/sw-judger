const { createSchema } = require('../../helpers');
const roleSchema = require('./common/role.schema');
const { CENTERS, PERMISSIONS } = require('../../../constants');

const schema = createSchema({
  image: String,
  no: {
    type: String,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    trim: true,
    index: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  center: {
    type: String,
    enum: [...CENTERS, null],
    default: null
  },
  department: {
    type: String,
    trim: true,
    index: true,
    // required: true,
  },
  position: String,
  role: { ...roleSchema, index: true },
  permissions: [{
    type: String,
    enum: PERMISSIONS,
    required: true,
  }],
}, {
  createdAt: 'joinedAt'
});

schema.index('joinedAt');

module.exports = schema;
