const fs = require('fs');
const { Problem, Submit, UserInfo } = require('../../../../models');
const { createResponse } = require('../../../../utils/response');
const { hasRole } = require('../../../../utils/permission');
const { updateFilesByUrls } = require('../../../../utils/file');
const {
  PROBLEM_NOT_FOUND,
  CONTEST_NOT_FOUND
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
  const { query } = req;
  const now = Date.now()
  const documents = await Problem.search(query, {
    $and: [{ published: { $ne: null } }, { published: { $lte: now } }]
  }, [{ path: 'parentId'}, { path: 'writer'}]);
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
  if (!body.parent || !body.parentType) return next(CONTEST_NOT_FOUND);
  body.user = user.info;

  const codeFileName = body.source.substring(body.source.lastIndexOf('/') + 1);
  const codeFilePath = '/usr/src/app/uploads/' + codeFileName;
  const code = fs.readFileSync(codeFilePath, 'utf8');
  body.code = code;

  const submit = await Submit.create(body);
  await producingSubmit(producer, String(submit._id));
  await updateFilesByUrls(user, submit._id, 'Submit', [submit.source])
  res.json(createResponse(res, submit));
});


const createProblem = asyncHandler(async (req, res, next) => {
  const { body, user } = req;
  body.writer = user.info;
  body.ioSet = (body.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));
  const parent = await parentModels[body.parentType].findById(body.parentId);

  const err = validateParentOf(body, parent);
  if (err) return next(err);

  const problem = await Problem.create(body);
  await updateFilesOf(body, user);

  if (parent) await assignTo(parent, problem);
  res.json(createResponse(res, problem));
});


const updateProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }, body: $set, user} = req;
  const {err, problem} = await validateByProblem(id);
  if (err) return next(err);
  if (!hasRole(user) && !checkOwnerOf(problem, user)) return next(FORBIDDEN);
  $set.ioSet = ($set.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));
  await Promise.all([problem.updateOne({ $set }), updateFilesOf($set, user)]);
  res.json(createResponse(res));
});

const removeProblem = asyncHandler(async (req, res, next) => {
  const { params: { id }, user} = req;
  const {err, problem, problem: {parentId}} = await validateByProblem(id);
  if (err) return next(err);
  if (!hasRole(user) && !checkOwnerOf(problem, user)) return next(FORBIDDEN);
  if (parentId) await removeProblemAt(parentId, id);
  await Promise.all([
    problem.deleteOne(),
    removeFilesOf(problem, user)
  ]);
  res.json(createResponse(res));
});


exports.getProblems = getProblems;
exports.getProblem = getProblem;
exports.createProblem = createProblem;
exports.updateProblem = updateProblem;
exports.removeProblem = removeProblem;
exports.createSubmit = createSubmit;
