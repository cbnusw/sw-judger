const path = require('path');
const fs = require('fs');
const db = require('../../../../models')
const {
   Problem,
   Submit,
   File
} = require('../../../../models');
const { createResponse } = require('../../../../utils/response');
const { hasRole } = require('../../../../utils/permission');
const { updateFilesByUrls, updateFilesByIds, removeFilesByUrls, removeFilesByIds } = require('../../../../utils/file');
const {
   PROBLEM_NOT_FOUND,
   CONTEST_NOT_FOUND,
   ASSIGNMENT_NOT_FOUND,
   FILE_NOT_FOUND,
   PARENT_NOT_FOUND,
   FORBIDDEN
} = require('../../../../errors');
const asyncHandler = require('express-async-handler');

const {
   producingSubmit,
} = require('./service');


exports.getProblems = asyncHandler(async (req, res, next) => {
   const { query } = req;

   const now = Date.now()
   const documents = await Problem.search(
      query,
      { $and: [{ published: { $ne: null } }, { published: { $lte: now } }] },
      [{ path: "parentId", select: "title" }, { path: "writer" }]
   );

   res.json(createResponse(res, documents));
});

exports.getProblem = asyncHandler(async (req, res, next) => {
   const { params: { id }, user } = req;

   const problem = await Problem.findById(id);
   if (!problem) throw PROBLEM_NOT_FOUND;

   const query = Problem.findById(id)
      .populate({ path: 'writer' })
      .populate({ path: 'parentId' })
      .populate({ path: 'exampleFiles', select:"_id filename ref" }); // exampleFiles의 파일 정보 가져오기

   if (String(problem.writer) === String(user.info)) {
      query.populate({ path: 'ioSet.inFile'})
         .populate({ path: 'ioSet.outFile' });
   }

   const doc = await query.exec();

   res.json(createResponse(res, doc));
});


exports.createSubmit = asyncHandler(async (req, res, next) => {
   const { params: { id }, body, user } = req;
   const producer = req.app.get('submitProducer');

   body.problem = id;
   if (!body.parentId || !body.parentType) throw PARENT_NOT_FOUND;
   body.user = user.info;

   const submit = await Submit.create(body);
   await producingSubmit(producer, String(submit._id));
   await updateFilesByUrls(req, submit._id, 'Submit', [submit.source])

   res.json(createResponse(res, submit));
});


exports.createProblem = asyncHandler(async (req, res, next) => {
   const { body, user } = req;

   body.writer = user.info;
   body.ioSet = (body.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));

   // 예제 파일 처리 추가
   body.exampleFiles = (body.exampleFiles || []).map(file => file._id);

   const doc = await Problem.create(body);

   const parentDoc = await db[doc.parentType].findById(doc.parentId);
   if (!parentDoc && doc.parentType === 'Assignment') throw ASSIGNMENT_NOT_FOUND;
   if (!parentDoc && doc.parentType === 'Contest') throw CONTEST_NOT_FOUND;

   parentDoc.problems = [...parentDoc.problems, doc._id];

   const contentFile = await File.findOne({ url: body.content });

   const ids = [...body.ioSet.map(io => io.inFile), ...body.ioSet.map(io => io.outFile), contentFile._id, ...body.exampleFiles ];// 예제 파일 ID 추가

   await Promise.all([
      parentDoc.save(),
      updateFilesByIds(req, doc._id, 'Problem', ids)
   ]);

   res.json(createResponse(res, doc));
});


exports.updateProblem = asyncHandler(async (req, res, next) => {
   const { params: { id }, body: $set, user } = req;
   const doc = await Problem.findById(id);

   $set.ioSet = ($set.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));

   if (!doc) throw PROBLEM_NOT_FOUND;
   if (String(doc.writer) !== String(user.info)) throw FORBIDDEN;

   const parentDoc = await db[doc.parentType].findById(doc.parentId);

   if (!parentDoc && doc.parentType === 'Assignment') throw ASSIGNMENT_NOT_FOUND;
   if (!parentDoc && doc.parentType === 'Contest') throw CONTEST_NOT_FOUND;

   const contentFile = await File.findOne({ url: $set.content });
   if (!contentFile) throw FILE_NOT_FOUND;

   const ids = [...$set.ioSet.map(io => io.inFile), ...$set.ioSet.map(io => io.outFile), contentFile._id];

   await Promise.all([
      doc.updateOne({ $set }),
      updateFilesByIds(req, doc._id, 'Problem', ids),
   ]);


   res.json(createResponse(res));
});


exports.removeProblem = asyncHandler(async (req, res, next) => {
   const { params: { id }, user } = req;

   const doc = await Problem.findById(id).populate('parentId');

   if (!hasRole(user) && String(problem.writer !== String(user.info))) throw FORBIDDEN;

   const parentDoc = await db[doc.parentType].findById(doc.parentId);
   if (!parentDoc && doc.parentType === 'Assignment') throw ASSIGNMENT_NOT_FOUND;
   if (!parentDoc && doc.parentType === 'Contest') throw CONTEST_NOT_FOUND;

   const index = parentDoc.problems.indexOf(doc._id);
   if (index !== -1) {
      parentDoc.problems.splice(index, 1);
      await parentDoc.save();
   }

   const contentFile = await File.findOne({ url: doc.content });

   const ids = [...doc.ioSet.map(io => io.inFile), ...doc.ioSet.map(io => io.outFile), contentFile._id];

   await Promise.all([
      doc.deleteOne(),
      removeFilesByIds(req, ids),
   ]);
   res.json(createResponse(res));
});

// 파일 다운로드 API
exports.downloadExampleFile = asyncHandler(async (req, res, next) => {
   const { problemId, fileId } = req.params;

   // 데이터베이스에서 파일 검색
   const file = await File.findOne({ ref: problemId, _id: fileId });
   if (!file) {
      return res.status(404).json({ message: 'DB에서 파일을 찾을 수 없습니다.' });
   }

   // 파일 URL을 실제 서버 내 경로로 변환
   const fileUrl = file.url;  // 예: http://localhost:4003/uploads/filename.c
   const uploadsDirectory = path.join('/usr/src/app/uploads'); // 컨테이너 내의 절대 경로로 수정
   const filePath = path.join(uploadsDirectory, path.basename(fileUrl));

   const filename = file.filename; // 다운로드될 파일 이름
   console.log(filePath); // 경로 확인

   // 파일이 실제로 존재하는지 확인
   if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: '다운로드 파일을 찾을 수 없습니다.' });
   }

   // 파일 다운로드 처리
   res.download(filePath, filename, (err) => {
      if (err) {
         console.error('파일 다운로드 오류:', err); // 에러 메시지 로그
         return res.status(500).json({ message: '파일 다운로드 중 오류가 발생했습니다.', error: err.message });
      }
   });
});
