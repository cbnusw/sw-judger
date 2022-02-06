const bcrypt = require('bcrypt');
const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');
const { PERMISSIONS } = require('../../../constants');
const roleSchema = require('./common/role.schema');

const schema = createSchema({
  no: {
    type: String,
    trim: true,
    unique: true,
  },
  hashedPassword: String,
  role: roleSchema,
  permissions: [{
    type: String,
    enum: PERMISSIONS,
    required: true,
  }],
  info: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    unique: true,
    sparse: true,
  }
}, {
  timestamps: false,
});

schema.virtual('password')
  .set(function (password) {
    this.hashedPassword = bcrypt.hashSync(password, 12);
  });

schema.virtual('profile')
  .get(function () {
    return {
      _id: this._id,
      role: this.role,
      permissions: this.permissions,
      info: this.info
    };
  });

schema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.hashedPassword);
};

module.exports = schema;
