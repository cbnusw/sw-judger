const asyncHandler = require('express-async-handler');
const { Assignment } = require('../../../../models');
const { hasRole } = require('../../../../utils/permission');
const {
   ASSIGNMENT_NOT_FOUND,
   IS_NOT_TEST_PERIOD,
   IS_NOT_CONTESTANT,
} = require('../../../../errors');


const handleAccessAssignmentProblems = asyncHandler(async (req, res, next) => {
   const { params: { id }, user } = req;
   const assignment = await Assignment.findById(id);

   if (!assignment) throw ASSIGNMENT_NOT_FOUND;

   if (String(assignment.writer) === String(user.info) || hasRole(user)) return next();
   if (!assignment.students.map(student => String(student)).includes(String(user.info))) throw IS_NOT_CONTESTANT;

   const { testPeriod } = assignment;
   const now = new Date();
   const start = new Date(testPeriod.start);
   const end = new Date(testPeriod.end);

   if (now.getTime() < start.getTime() || now.getTime() > end.getTime()) throw IS_NOT_TEST_PERIOD;
   next();
});

exports.handleAccessAssignmentProblem = handleAccessAssignmentProblems;
