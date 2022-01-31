const asyncHanlder = require('express-async-handler');
const { IS_NOT_TEST_PERIOD, LOGIN_REQUIRED, IS_NOT_CONTESTANT } = require('../../../../errors');
const { hasRole } = require('../../../../utils/permission');
const { Problem } = require('../../../../models');
const { checkTestPeriodOf, isPublished, isAssigned, parentNotFoundErrors, checkOwnerOf } = require.resolve('./service.js');
const handleAccessProblem = asyncHanlder(async (req, res, next) => {
  const { params: { id }, user } = req;
  const problem = await Problem.findById(id).populate('parent');
  // if (problem.published && isPublished(problem)) next();
  if (!user) return next(LOGIN_REQUIRED);
  const { parent, parentType } = problem;
  if (parentType && !parent) return next(parentNotFoundErrors[parentType]);
  if (checkOwnerOf(problem, user) || hasRole(user)) return next();
  // if (!checkTestPeriodOf(parent)) return next(IS_NOT_TEST_PERIOD);
  if (!isAssigned(user, parent)) return next(IS_NOT_CONTESTANT);
  next();
});

exports.handleAccessProblem = handleAccessProblem;
