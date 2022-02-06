const { Schema } = require('mongoose');
const { createSchema } = require('../../helpers');

const schema = createSchema({
  code: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'UserInfo',
    unique: true,
    required: true,
  },
}, {
  updatedAt: false
});

schema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });  // 10분 후 삭제

const generateOtp = () => String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

schema.statics.getOtp = async function (user) {
  let otp = await this.findOne({ user });

  const code = generateOtp();

  if (otp) await otp.deleteOne();
  otp = await this.create({ code, user });
  return otp;
};

module.exports = schema;
