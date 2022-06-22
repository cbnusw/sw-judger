const asyncHandler = require("express-async-handler");
const { Submit, UserInfo, Assignment, Contest } = require("../../../../models");
const { createResponse } = require("../../../../utils/response");
const {
   FORBIDDEN,
   SUBMIT_NOT_FOUND,
   RESULT_NOT_FOUND
} = require('../../../../errors')


const getSubmits = asyncHandler(async (req, res, next) => {
   const documents = await Submit.search(query);
   res.json(createResponse(res, documents));
});


const getSubmit = asyncHandler(async (req, res) => {
   const { params: { id }, user } = req;
   let varifyDoc;

   const exSubmit = await Submit.findById(id)
      .populate({ path: 'parentId', select: '-password', populate: { path: 'writer', select: 'name' } })
      .populate({ path: 'user' })
      .populate({ path: 'problem' });

   if (!exSubmit) throw SUBMIT_NOT_FOUND;
   if (exSubmit.parentType === "Assignment") varifyDoc = await Assignment.findById(exSubmit.parentId);
   else if (exSubmit.parentType === "Contest") varifyDoc = await Contest.findById(exSubmit.parentId);

   else throw RESULT_NOT_FOUND;

   switch (user.info.toString()) {
      case(varifyDoc.writer.toString()):
         break;
      case(exSubmit.user._id.toString()):
         break;
      default:
         throw FORBIDDEN
   };

   res.json(createResponse(res, exSubmit));
})



const getMySubmits = asyncHandler(async (req, res, next) => {
   const { user } = req;
   const documents = await Submit.search({ limit: 100 }, { user: user.info });
   res.json(createResponse(res, documents));
});



const getContestSubmits = asyncHandler(async (req, res, next) => {
   const { params: { id }, query, user, } = req;

   const exContest = await Contest.findById(id)
   if (String(exContest.writer) !== String(user.info)) throw FORBIDDEN;

   const documents = await Submit.search(
      query,
      { parentId: id, parentType: "Contest" },
      { path: "user", model: UserInfo }
   );

   res.json(createResponse(res, documents));
});

const getMyContestSubmits = asyncHandler(async (req, res, next) => {
   const { params: { id }, user } = req;

   const documents = await Submit.search(
      { limit: 100 },
      { parentId: id, parentType: "Contest", user: user.info }
   );
   res.json(createResponse(res, documents));
});

const getAssignmentSubmits = asyncHandler(async (req, res) => {
   const { params: { id }, query, user, } = req;
   const exAssignment = await Assignment.findById(id)
   if (exAssignment.writer.toString() !== user.info.toString()) throw FORBIDDEN;
   const documents = await Submit.search(
      query,
      { parentId: id, parentType: "Assignment" },
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
      { parentId: id, parentType: "Assignment", user: user.info }
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
exports.getSubmit = getSubmit;
exports.getMySubmits = getMySubmits;
exports.getContestSubmits = getContestSubmits;
exports.getMyContestSubmits = getMyContestSubmits;
exports.getAssignmentSubmits = getAssignmentSubmits;
exports.getMyAssignmentSubmits = getMyAssignmentSubmits;
exports.getProblemSubmits = getProblemSubmits;
exports.getMyProblemSubmits = getMyProblemSubmits;
