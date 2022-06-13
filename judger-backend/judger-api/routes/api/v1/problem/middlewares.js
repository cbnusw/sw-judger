const asyncHanlder = require('express-async-handler');
const { IS_NOT_TEST_PERIOD, LOGIN_REQUIRED, IS_NOT_CONTESTANT } = require('../../../../errors');
const { hasRole } = require('../../../../utils/permission');
const { Problem } = require('../../../../models');
const {
   isAssigned,
   checkTestPeriodOf,
} = require('./service.js');

const handleAccessProblem = asyncHanlder(async (req, res, next) => {
   const { params: { id }, user } = req;
   const problem = await Problem.findById(id).populate('parentId');

   if (!user) throw LOGIN_REQUIRED;

   if (String(problem.writer) === String(user.info) || hasRole(user)) return next();
   if (!checkTestPeriodOf(parentId)) throw IS_NOT_TEST_PERIOD;
   if ((parentType === "Assignment" || parentType === "Contest") && !(await isAssigned(user, parentId, parentType))) throw IS_NOT_CONTESTANT;

   // if (problem.published && problem.parentType === "Contest") {
   //   if (!isPublished(problem)) {
   //     if (!checkTestPeriodOf(parentId)) throw IS_NOT_TEST_PERIOD;
   //     if ((parentType === "Assignment" || parentType === "Contest") && !(await isAssigned(user, parentId, parentType))) throw IS_NOT_CONTESTANT;
   //   }
   // } else if (!problem.published) {
   //   if (!checkTestPeriodOf(parentId)) throw IS_NOT_TEST_PERIOD;
   //   if (
   //     (parentType === "Assignment" || parentType === "Contest") &&
   //     !(await isAssigned(user, parentId, parentType))
   //   )
   //     return next(IS_NOT_CONTESTANT);
   // }

   next();
});

exports.handleAccessProblem = handleAccessProblem;
