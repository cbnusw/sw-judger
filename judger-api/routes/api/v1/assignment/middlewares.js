const asyncHandler = require('express-async-handler');
const { Assignment } = require('../../../../models');
const { hasRole } = require('../../../../utils/permission');
const {
  ASSIGNMENT_NOT_FOUND,
  IS_NOT_TEST_PERIOD,
} = require('../../../../errors');

const handleAccessAssignmentProblems = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;
  const assignment = await Assignment.findById(id);

  if (!assignment) return next(ASSIGNMENT_NOT_FOUND);

  if (String(assignment.writer) === String(user.info) || hasRole(user)) return next();

  const { testPeriod } = assignment;
  const now = new Date();
  const start = new Date(testPeriod.start);
  const end = new Date(testPeriod.end);

  if (now.getTime() < start.getTime() || now.getTime() > end.getTime()) return next(IS_NOT_TEST_PERIOD);
  
  next();
});

exports.handleAccessAssignmentProblem = handleAccessAssignmentProblems;