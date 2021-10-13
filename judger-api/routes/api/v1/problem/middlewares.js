const asyncHanlder = require('express-async-handler');
const { FORBIDDEN, IS_NOT_TEST_PERIOD, LOGIN_REQUIRED } = require('../../../../errors');
const { hasRole } = require('../../../../utils/permission');
const { Contest, Problem } = require('../../../../models');

const handleAccessProblem = asyncHanlder(async (req, res, next) => {
  const { params: { id }, user } = req;
  const problem = await Problem.findById(id);

  if (user && String(user.info) === String(problem.writer) || hasRole(user)) return next();

  const now = new Date();

  if (problem.publised) {
    const published = new Date(problem.publised);
    return now.getTime() > published.getTime() ? next(FORBIDDEN) : next();
  }

  if (!problem.contest) return next(FORBIDDEN);

  const contest = await Contest.findById(problem.contest);
  const { testPeriod } = contest;
  const start = new Date(testPeriod.start);
  const end = new Date(testPeriod.end);

  if (now.getTime() < start.getTime() || now.getTime() > end.getTime()) return next(IS_NOT_TEST_PERIOD);
  if (!user) return next(LOGIN_REQUIRED);
  if (!contest.contestants.map(contestant => String(contestant)).includes(String(user.info)))
    return next(IS_NOT_TEST_PERIOD);

  next();
});

exports.handleAccessProblem = handleAccessProblem;
