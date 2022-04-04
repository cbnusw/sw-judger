const { Assignment, Problem } = require('../../../../models');
const { findImageUrlFromHtml, updateFilesByUrls } = require('../../../../utils/file');
const { createResponse } = require('../../../../utils/response');
const asyncHandler = require('express-async-handler');
const {
  ENDED_ASSIGNMENT,
  ASSIGNMENT_NOT_FOUND,
  ASSIGNMENT_ENROLLED,
  FORBIDDEN,
  IS_NOT_ASSIGNMENT_PROBLEM,
  PROBLEM_NOT_FOUND,
} = require('../../../../errors');


const getAssignments = asyncHandler(async (req, res, next) => {
  const { query } = req;
  const documents = await Assignment.search(query);
  res.json(createResponse(res, documents));
});


const getMyAssignments = asyncHandler(async (req, res, next) => {
  const { query, user } = req;
  const documents = await Assignment.search(query, { writer: user.info });
  res.json(createResponse(res, documents));
});


const getRegisteredAssignments = asyncHandler(async (req, res, next) => {
  const { query, user } = req;
  const now = new Date();
  const documents = await Assignment.search(query, {
    $and: [
      { students: user.info },
      { 'testPeriod.end': { $gt: now } }
    ]
  });
  res.json(createResponse(res, documents));
});


const getProgressingAssignments = asyncHandler(async (req, res, next) => {
  const now = new Date();

  const documents = await Assignment.search({}, {
    'testPeriod.end': { $gt: now }
  });

  res.json(createResponse(res, documents));
});


const getAssignment = asyncHandler(async (req, res, next) => {
  const { params: { id } } = req;

  const doc = await Assignment.findById(id)
    .populate({ path: 'writer' })
    .populate({ path: 'students' });

  if (!doc) return next(ASSIGNMENT_NOT_FOUND);

  res.json(createResponse(res, doc));
});


const getAssignmentProblems = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;

  const assignment = await Assignment.findById(id);
  if (!assignment) return next(ASSIGNMENT_NOT_FOUND);

  const query = Assignment.findById(id).populate({ path: 'writer' })
    .populate({ path: 'problems', populate: { path: 'writer' } });

  if (String(assignment.writer) === String(user.info)) {
    query.populate({ path: 'problems' });
  }

  const doc = await query.exec();

  res.json(createResponse(res, doc));
});


const createAssignment = asyncHandler(async (req, res, next) => {
  const { body, user } = req;

  body.writer = user.info;
  const urls = findImageUrlFromHtml(body.content);
  const doc = await Assignment.create(body);

  await updateFilesByUrls(req, doc._id, 'Assignment', urls);

  res.json(createResponse(res, doc));
});


const createAssignmentProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }, body, user } = req;

  const assignment = await Assignment.findById(id);

  if (!assignment) return next(ASSIGNMENT_NOT_FOUND);
  if (String(assignment.writer) !== String(user.info)) return next(FORBIDDEN);

  const { testPeriod } = assignment;
  const now = new Date();
  const end = new Date(testPeriod.end);
  if (now.getTime() > end) return next(ENDED_ASSIGNMENT);
  body.assignment = id;
  body.writer = user.info;

  const problem = await Problem.create(body);

  const urls = [body.content, ...(body.ioSet || []).map(io => io.inFile.url), ...(body.ioSet || []).map(io => io.outFile.url)];
  assignment.problems.push(problem._id);

  await Promise.all([assignment.save(), updateFilesByUrls(req, problem._id, 'Problem', urls)]);

  res.json(createResponse(res, problem));
});


const enrollAssignment = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;
  const assignment = await Assignment.findById(id);

  if (!assignment) return next(ASSIGNMENT_NOT_FOUND);

  const { deadline } = assignment;
  const now = new Date();
  const start = new Date(deadline);
  if (now.getTime() > start.getTime()) return next(ENDED_ASSIGNMENT);

  if (assignment.students.map(id => String(id)).includes(String(user.info))) return next(ASSIGNMENT_ENROLLED);
  assignment.students.unshift(user.info);
  await assignment.save();

  return res.json(createResponse(res));
})


const unenrollAssignment = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;
  const assignment = await Assignment.findById(id);

  if (!assignment) return next(ASSIGNMENT_NOT_FOUND);

  const { deadline } = assignment;

  const now = new Date();
  const start = new Date(deadline);

  if (now.getTime() > start.getTime()) return next(ENDED_ASSIGNMENT);


  const idx = assignment.students.map(id => String(id)).indexOf(String(user.info));
  if (idx !== -1) {
    assignment.students.splice(idx, 1);
    await assignment.save();
  }
  return res.json(createResponse(res));
})


const updateAssignment = asyncHandler(async (req, res, next) => {
  const { params: { id }, body: $set, user } = req;

  const doc = await Assignment.findById(id);

  if (!doc) return next(ASSIGNMENT_NOT_FOUND);
  if (String(doc.writer) !== String(user.info)) return next(FORBIDDEN);

  if ($set.content) {
    const urls = findImageUrlFromHtml($set.content);
    await updateFilesByUrls(req, doc._id, 'Content', urls);
  }
  await doc.updateOne({ $set });

  res.json(createResponse(res));
});


const updateAssignmentProblem = asyncHandler(async (req, res, next) => {
  const { params: { id, problemId }, body: $set, user } = req;

  const assignment = await Assignment.findById(id);
  const problem = await Problem.findById(problemId);

  if (!assignment) return next(ASSIGNMENT_NOT_FOUND);
  if (!problem) return next(PROBLEM_NOT_FOUND);

  if (String(assignment.writer) !== String(user.info)) return next(FORBIDDEN);
  if (String(problem.writer) !== String(user.info)) return next(FORBIDDEN);
  if (!assignment.problems.map(p => String(p)).includes(String(problem._id))) return next(IS_NOT_ASSIGNMENT_PROBLEM);

  // const { testdeadline } = assignment;
  // const now = new Date();
  // const start = new Date(testdeadline.start);
  // if (now.getTime() > start.getTime()) return next(AFTER_TEST_START);

  const urls = [...($set.ioSet || []).map(io => io.inFile.url), ...($set.ioSet || []).map(io => io.outFile.url)];
  if ($set.content) urls.push($set.content);

  await Promise.all([problem.updateOne({ $set }), updateFilesByUrls(req, problem._id, 'Problem', urls)]);

  res.json(createResponse(res));
});

const reorderAssignmentProblems = asyncHandler(async (req, res, next) => {
  let { params: { id }, body: { problems }, user } = req;

  const assignment = await Assignment.findById(id);

  if (!assignment) return next(ASSIGNMENT_NOT_FOUND);
  if (String(assignment.writer) !== String(user.info)) return next(FORBIDDEN);

  problems = problems.map(problem => problem._id);
  await assignment.updateOne({ $set: { problems } });

  res.json(createResponse(res));
});


const removeAssignment = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;
  const doc = await Assignment.findById(id);

  if (!doc) return next(ASSIGNMENT_NOT_FOUND);

  if (String(doc.writer) !== String(user.info)) return next(FORBIDDEN);
  await doc.deleteOne();

  res.json(createResponse(res));
});


exports.getAssignments = getAssignments;
exports.getMyAssignments = getMyAssignments;
exports.getRegisteredAssignments = getRegisteredAssignments;
exports.getProgressingAssignments = getProgressingAssignments;
exports.getAssignment = getAssignment;
exports.getAssignmentProblems = getAssignmentProblems;
exports.createAssignment = createAssignment;
exports.createAssignmentProblem = createAssignmentProblem;
exports.enrollAssignment = enrollAssignment;
exports.unenrollAssignment = unenrollAssignment;
exports.updateAssignment = updateAssignment;
exports.updateAssignmentProblem = updateAssignmentProblem;
exports.reorderAssignmentProblems = reorderAssignmentProblems;
exports.removeAssignment = removeAssignment;
