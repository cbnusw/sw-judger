const { Schema } = require('mongoose');
const { hasRole } = require('../../../utils/permission');
const { createSchema } = require('../../helpers');
const { FILE_TYPES } = require('../../../constants');
const schema = createSchema({
  url: {
    type: String,
    unique: true,
    sparse: true,
  },
  filename: String,
  mimetype: String,
  size: Number,
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

schema.methods.validatePermission = async function (user) {

  if (hasRole(user)) return true;

  let userInfo;
  const now = new Date();

  if (user) {
    const { UserInfo } = require('../');
    userInfo = await UserInfo.findById(user.info);
  }

  // 파일이 문제 셋과 관련된 파일일 경우
  if (this.refModel === 'Problem') {
    const { Contest, Problem } = require('../');
    const problem = await Problem.findById(this.ref);

    if (!problem) return false;
    if (userInfo && String(problem.writer) === String(userInfo._id)) return true;

    if (problem.ioSet.map(io => io.inFile).includes(this.url)) return false;
    if (problem.ioSet.map(io => io.outFile).includes(this.url)) return false;

    if (problem.contest) {
      const contest = await Contest.findById(problem.contest);
      if (!contest) return false;

      if (!userInfo) return false;
      if (!contest.contestants.map(id => String(id)).includes(String(userInfo._id))) return false;
      if (contest.testPeriod) {
        let { start, end } = contest.testPeriod;
        const now = new Date();
        start = new Date(start);
        end = new Date(end);
        return now.getTime() >= start.getTime() && now.getTime() <= end.getTime();
      }
    }

    if (problem.published) {
      const published = new Date(problem.published);
      return now.getTime() > published.getTime();
    }

    return false;

  }

  return true;
};

module.exports = schema;
