const { Problem, File, Submit, Assignment, Contest } = require('../../../../models');
const { updateFilesByUrls, updateFilesByIds, removeFilesByIds } = require('../../../../utils/file');
const { createResponse } = require('../../../../utils/response');
const asyncHandler = require('express-async-handler');
const {
   FORBIDDEN,
   PROBLEM_NOT_FOUND,
   FILE_NOT_FOUND, SUBMIT_NOT_FOUND, RESULT_NOT_FOUND,
} = require('../../../../errors');
const { hasRole } = require("../../../../utils/permission");
const { producingSubmit } = require("../problem/service");

exports.getPractices = asyncHandler(async (req, res, next) => {
   const { query } = req;
   query.parentType = "Practice"
   const documents = await Problem.search(query, null, [{ path: "writer", select: 'name' }]);
   res.json(createResponse(res, documents));
});

exports.getPractice = asyncHandler(async (req, res, next) => {
   const { params: { id }, user } = req;

   const problem = await Problem.findById(id);
   if (!problem) throw PROBLEM_NOT_FOUND;

   const query = Problem.findById(id)
      .populate({ path: 'writer' })

   if (String(problem.writer) === String(user.info)) {
      query.populate({ path: 'ioSet.inFile' })
         .populate({ path: 'ioSet.outFile' });
   }
   const doc = await query.exec();

   res.json(createResponse(res, doc));
});


exports.createPracticeSubmit = asyncHandler(async (req, res, next) => {
   const { params: { id }, body, user } = req;
   const producer = req.app.get('submitProducer');

   body.parentType = "Practice";
   body.problem = id;
   body.user = user.info;

   const submit = await Submit.create(body);
   await producingSubmit(producer, String(submit._id));
   await updateFilesByUrls(req, submit._id, 'Submit', [submit.source])

   res.json(createResponse(res, submit));
});

exports.createPractice = asyncHandler(async (req, res, next) => {
   const { body, user } = req;

   body.writer = user.info;
   body.ioSet = (body.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));
   body.parentType = "Practice"

   const doc = await Problem.create(body);

   const contentFile = await File.findOne({ url: body.content });

   const ids = [...body.ioSet.map(io => io.inFile), ...body.ioSet.map(io => io.outFile), contentFile._id];

   await Promise.all([
      updateFilesByIds(req, doc._id, 'Problem', ids)
   ]);

   res.json(createResponse(res, doc));
});

exports.updatePractice = asyncHandler(async (req, res, next) => {
   const { params: { id }, body: $set, user } = req;
   const doc = await Problem.findById(id);

   $set.ioSet = ($set.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));

   if (!doc) throw PROBLEM_NOT_FOUND;
   if (String(doc.writer) !== String(user.info)) throw FORBIDDEN;

   const contentFile = await File.findOne({ url: $set.content });
   if (!contentFile) throw FILE_NOT_FOUND;

   const ids = [...$set.ioSet.map(io => io.inFile), ...$set.ioSet.map(io => io.outFile), contentFile._id];

   await Promise.all([
      doc.updateOne({ $set }),
      updateFilesByIds(req, doc._id, 'Problem', ids),
   ]);

   res.json(createResponse(res));
});

exports.removePractice = asyncHandler(async (req, res, next) => {
   const { params: { id }, user } = req;

   const doc = await Problem.findById(id);
   if (!hasRole(user) && String(problem.writer !== String(user.info))) throw FORBIDDEN;

   const contentFile = await File.findOne({ url: doc.content });
   const ids = [...doc.ioSet.map(io => io.inFile), ...doc.ioSet.map(io => io.outFile), contentFile._id];

   await Promise.all([
      doc.deleteOne(),
      removeFilesByIds(req, ids),
   ]);

   res.json(createResponse(res));
});

exports.getMyPracticeSubmits = asyncHandler(async (req, res) => {
   const { user, params: { id } } = req;
   const documents = await Submit.find({parentType: "Practice", user: user.info, problem: id});
   res.json(createResponse(res, documents));
});

exports.getSubmit = asyncHandler(async (req, res) => {
   const { params: { id }, user } = req;
   const exSubmit = await Submit.findById(id)
      .populate({ path: 'user' })
      .populate({ path: 'problem' });

   if (!exSubmit) throw SUBMIT_NOT_FOUND;
   console.log(exSubmit)
   console.log(user)
   switch (user.info.toString()) {
      case(exSubmit.problem.writer.toString()):
         break;
      case(exSubmit.user._id.toString()):
         break;
      default:
         throw FORBIDDEN
   };

   res.json(createResponse(res, exSubmit));
})

