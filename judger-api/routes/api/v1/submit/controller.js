const asyncHandler = require("express-async-handler");
const { Submit, UserInfo, Assignment } = require("../../../../models");
const { FORBIDDEN } = require('../../../../errors')
const { createResponse } = require("../../../../utils/response");

const getSubmits = asyncHandler(async (req, res, next) => {
  const documents = await Submit.search(query);
  res.json(createResponse(res, documents));
});

const getMySubmits = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const documents = await Submit.search({ limit: 100 }, { user: user.info });
  res.json(createResponse(res, documents));
});

const getContestSubmits = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const documents = await Submit.search(
    { limit: 100 },
    { parent: id, parentType: "Contest" }
  );
  res.json(createResponse(res, documents));
});

const getMyContestSubmits = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  const documents = await Submit.search(
    { limit: 100 },
    { parent: id, parentType: "Contest", user: user.info }
  );
  res.json(createResponse(res, documents));
});

const getAssignmentSubmits = asyncHandler(async (req, res) => {
  const {
    params: { id },
    query,
    user,
  } = req;
  const exAssignment = await Assignment.findById(id)
  if (exAssignment.writer.toString() !== user.info.toString()) throw FORBIDDEN;
  const documents = await Submit.search(
    query,
    { parent: id, parentType: "Assignment" },
    { path: "user", model: UserInfo }
  );
  res.json(createResponse(res, documents));
});

const getMyAssignmentSubmits = asyncHandler(async (req, res) => {
  const {
    params: { id },
    user,
  } = req;
  const documents = await Submit.search(
    { limit: 100 },
    { parent: id, parentType: "Assignment", user: user.info }
  );
  res.json(createResponse(res, documents));
});

const getProblemSubmits = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const documents = await Submit.search({ limit: 100 }, { problem: id });
  res.json(createResponse(res, documents));
});

const getMyProblemSubmits = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  const documents = await Submit.search(
    { limit: 100 },
    { problem: id, user: user.info }
  );
  res.json(createResponse(res, documents));
});

exports.getSubmits = getSubmits;
exports.getMySubmits = getMySubmits;
exports.getContestSubmits = getContestSubmits;
exports.getMyContestSubmits = getMyContestSubmits;
exports.getAssignmentSubmits = getAssignmentSubmits;
exports.getMyAssignmentSubmits = getMyAssignmentSubmits;
exports.getProblemSubmits = getProblemSubmits;
exports.getMyProblemSubmits = getMyProblemSubmits;
