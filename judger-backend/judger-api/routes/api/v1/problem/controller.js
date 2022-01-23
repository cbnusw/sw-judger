const { Contest, Problem, Submit, UserInfo } = require('../../../../models');
const { createResponse } = require('../../../../utils/response');
const { hasRole } = require('../../../../utils/permission');
const { updateFilesByIds, updateFilesByUrls, removeFilesByUrls, removeFilesByIds } = require('../../../../utils/file');
const {
  CONTEST_NOT_FOUND,
  FORBIDDEN,
  INVALID_PROBLEM_PUBLISH,
  PROBLEM_NOT_FOUND,
  AFTER_TEST_START,
} = require('../../../../errors');
const asyncHandler = require('express-async-handler');
// const { producingSubmit } = require('./service');

const getProblems = (parentType) => asyncHandler(async (req, res, next) => {
  const { query } = req;

  const now = new Date();

  const documents = await Problem.search(query, {
    $and: [{ published: { $ne: null } }, { published: { $lte: now } }, { parentType: parentType }]
  }, [{ path: 'contest', model: Contest }, { path: 'writer', model: UserInfo }])

  res.json(createResponse(res, documents));
});

const getProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;
  const problem = await Problem.findById(id);
  if (!problem) return next(PROBLEM_NOT_FOUND);

  const query = Problem.findById(id).populate({ path: 'writer' });

  if (String(problem.writer) === String(user.info)) {
    query.populate({ path: 'ioSet.inFile' })
      .populate({ path: 'ioSet.outFile' });
  }

  const doc = await query.exec();

  res.json(createResponse(res, doc));
});


const createSubmit = asyncHandler(async (req, res, next) => {
  const { params: { id }, body, user } = req;
  // const producer = req.app.get('submitProducer');
  body.problem = id;
  body.user = user.info;

  const submit = await Submit.create(body);
  await producingSubmit(producer, String(submit._id));
  await updateFilesByUrls(req, submit._id, 'Submit', [submit.source])
  res.json(createResponse(res, submit));
});


const createProblem = (parentType) => asyncHandler(async (req, res, next) => {
  const { body, user } = req;

  body.writer = user.info;
  body.ioSet = (body.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));
  body.parentType = parentType;
  const err = validateContest(parentType, body);
  if (err) return next(err);

  const doc = await Problem.create(body);
  const urls = [body.content];
  const ids = [...body.ioSet.map(io => io.inFile), ...body.ioSet.map(io => io.outFile)];
  await Promise.all([
    updateFilesByUrls(req, doc._id, 'Problem', urls),
    updateFilesByIds(req, doc._id, 'Problem', ids)
  ]);

  res.json(createResponse(res, doc));
});


const updateProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }, body: $set, user } = req;
  const doc = await Problem.findById(id);

  $set.ioSet = ($set.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));

  if (!doc) return next(PROBLEM_NOT_FOUND);
  if (String(doc.writer) !== String(user.info)) return next(FORBIDDEN);

  const err = validateContest($set);
  if (err) return next(err);

  const urls = [$set.content]
  const ids = [...$set.ioSet.map(io => io.inFile), ...$set.ioSet.map(io => io.outFile)];
  await Promise.all([
    doc.updateOne({ $set }),
    updateFilesByUrls(req, doc._id, 'Problem', urls),
    updateFilesByIds(req, doc._id, 'Problem', ids),
  ]);

  res.json(createResponse(res));
});

const removeProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;
  const doc = await Problem.findById(id);
  if (!doc) return next(PROBLEM_NOT_FOUND);

  if (!hasRole(user) && String(user.info) !== String(doc.writer)) return next(FORBIDDEN);

  const contest = await Contest.findById(doc.contest);

  const { testPeriod } = contest;
  const now = new Date();
  const start = new Date(testPeriod.start);
  if (now.getTime() > start.getTime()) return next(AFTER_TEST_START);

  if (doc.contest) {
    const contest = await Contest.findById(doc.contest);
    const index = contest.problems.indexOf(doc._id);
    if (index !== -1) {
      contest.problems.splice(index, 1);
      await contest.save();
    }
  }

  const urls = [doc.content];
  const ids = [...doc.ioSet.map(io => io.inFile), ...doc.ioSet.map(io => io.outFile)];
  await Promise.all([
    doc.deleteOne(),
    removeFilesByUrls(req, urls),
    removeFilesByIds(req, ids),
  ]);

  res.json(createResponse(res));
});


// utility functions
async function validateContest(parentType, problem) {
  if (problem.contest) {
    const contest = await Contest.findById(problem.contest);
    if (!contest) return CONTEST_NOT_FOUND;
    if (problem.published) {
      const published = new Date(problem.published);
      const { testPeriod } = contest;
      const end = new Date(testPeriod.end);
      if (published.getTime() < end.getTime()) return INVALID_PROBLEM_PUBLISH;
    }
    if (String(problem.writer) !== String(contest.writer)) return FORBIDDEN;
  }
  return null;
}

exports.getProblems = getProblems;
exports.getProblem = getProblem;
exports.createProblem = createProblem;
exports.updateProblem = updateProblem;
exports.removeProblem = removeProblem;
exports.createSubmit = createSubmit;
