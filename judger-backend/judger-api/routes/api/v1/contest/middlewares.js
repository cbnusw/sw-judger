const asyncHandler = require('express-async-handler');
const { Contest } = require('../../../../models');
const { hasRole } = require('../../../../utils/permission');
const {
  CONTEST_NOT_FOUND,
  IS_NOT_TEST_PERIOD,
  IS_NOT_CONTESTANT,
} = require('../../../../errors');

const handleAccessContestProblems = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;
  const contest = await Contest.findById(id);

  if (!contest) return next(CONTEST_NOT_FOUND);
  if (String(contest.writer) === String(user.info) || hasRole(user)) return next();

  const { testPeriod } = contest;
  const now = new Date();
  const start = new Date(testPeriod.start);
  const end = new Date(testPeriod.end);

  if (now.getTime() < start.getTime() || now.getTime() > end.getTime()) return next(IS_NOT_TEST_PERIOD);
  if (!contest.contestants.map(contestant => String(contestant)).includes(String(user.info)))
    return next(IS_NOT_CONTESTANT);
  next();
});

exports.handleAccessContestProblem = handleAccessContestProblems;
