const { Problem, Submit, UserInfo } = require('../../../../models');
const { createResponse } = require('../../../../utils/response');
const { hasRole } = require('../../../../utils/permission');
const { updateFilesByUrls } = require('../../../../utils/file');
const {
  PROBLEM_NOT_FOUND,
} = require('../../../../errors');
const asyncHandler = require('express-async-handler');
const {
  producingSubmit,
  checkOwnerOf,
  validateParentOf,
  validateByProblem,
  removeProblemAt,
  parentModels,
  assignTo,
  updateFilesOf,
  removeFilesOf,
} = require('./service');

const getProblems = asyncHandler(async (req, res, next) => {
  const { query, query : { parentType }} = req;
  const documents = await Problem.search(query, {
    $and: [{ published: { $ne: null } }, { published: { $lte: now } }, { parentType: parentType }]
  }, [{ path: 'parentId'}, { path: 'writer', model: UserInfo }])
  res.json(createResponse(res, documents));
});

const getProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }, user } = req;
  const problem = await Problem.findById(id);
  if (!problem) return next(PROBLEM_NOT_FOUND);
  const query = Problem.findById(id).populate({ path: 'writer' });
  if (hasRole(user) || checkOwnerOf(problem, user)){
    query.populate({ path: 'ioSet.inFile' })
      .populate({ path: 'ioSet.outFile' });
  }
  const doc = await query.exec();
  res.json(createResponse(res, doc));
});


const createSubmit = asyncHandler(async (req, res, next) => {
  const { params: { id }, body, user } = req;
  const producer = req.app.get('submitProducer');
  body.problem = id;
  body.user = user.info;
  const submit = await Submit.create(body);
  await producingSubmit(producer, String(submit._id));
  await updateFilesByUrls(req, submit._id, 'Submit', [submit.source])
  res.json(createResponse(res, submit));
});


const createProblem = asyncHandler(async (req, res, next) => {
  const { body, user, body: {parentType, parent} } = req;
  body.writer = user.info;
  body.ioSet = (body.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));
  parent = await parentModels[parentType].findById(parent);
  const err = validateParentOf(body, parent);
  if (err) return next(err);
  if (published && !validatePublishingTimeOf(body, parent))
    return ({ err: INVALID_PROBLEM_PUBLISH });
  const problem = await Problem.create(body);
  await updateFilesOf(body);
  if (parent) await assignTo(parent, problem);
  res.json(createResponse(res, doc));
});


const updateProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }, body: $set, user} = req;
  const {err, problem} = await validateByProblem(id);
  if (err) return next(err);
  if (!hasRole(user) && !checkOwnerOf(problem, user)) return next(FORBIDDEN);
  $set.ioSet = ($set.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));
  await Promise.all([problem.updateOne({ $set }), updateFilesOf($set)]);
  res.json(createResponse(res));
});

const removeProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }} = req;
  const {err, problem, problem: {parent}} = await validateByProblem(id);
  if (err) return next(err);
  if (!hasRole(user) && !checkOwnerOf(problem, user)) return next(FORBIDDEN);
  if (parent) await removeProblemAt(parent, id);
  await Promise.all([
    problem.deleteOne(),
    removeFilesOf(problem)
  ]);
  res.json(createResponse(res));
});


exports.getProblems = getProblems;
exports.getProblem = getProblem;
exports.createProblem = createProblem;
exports.updateProblem = updateProblem;
exports.removeProblem = removeProblem;
exports.createSubmit = createSubmit;
