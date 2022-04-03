const asyncHanlder = require('express-async-handler');
const { IS_NOT_TEST_PERIOD, LOGIN_REQUIRED, IS_NOT_CONTESTANT } = require('../../../../errors');
const { hasRole } = require('../../../../utils/permission');
const { Problem } = require('../../../../models');
const { isAssigned, parentNotFoundErrors, checkOwnerOf } = require('./service.js');

const handleAccessProblem = asyncHanlder(async (req, res, next) => {
  const { params: { id }, user } = req;
  const problem = await Problem.findById(id).populate('parentId');
  // if (problem.published && isPublished(problem)) next();
  if (!user) return next(LOGIN_REQUIRED);
  const { parentId, parentType } = problem;
  if (parentType && !parentId) return next(parentNotFoundErrors[parentType]);
  if (checkOwnerOf(problem, user) || hasRole(user)) return next();
  // if (!checkTestPeriodOf(parent)) return next(IS_NOT_TEST_PERIOD);
  if ((parentType === "Assignment" || parentType === "Contest") && !await isAssigned(user, parentId, parentType)) return next(IS_NOT_CONTESTANT);
  next();
});

exports.handleAccessProblem = handleAccessProblem;
