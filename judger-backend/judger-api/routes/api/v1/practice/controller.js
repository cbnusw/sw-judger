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
      .populate({ path: 'exampleFiles', select:"_id filename ref" }); // exampleFiles의 파일 정보 가져오기

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

   // 예제 파일 처리 추가
   body.exampleFiles = (body.exampleFiles || []).map(file => file._id);

   const doc = await Problem.create(body);

   const contentFile = await File.findOne({ url: body.content });

   const ids = [...body.ioSet.map(io => io.inFile), ...body.ioSet.map(io => io.outFile), contentFile._id, ...body.exampleFiles ];

   await Promise.all([
      updateFilesByIds(req, doc._id, 'Problem', ids)
   ]);

   res.json(createResponse(res, doc));
});

exports.updatePractice = asyncHandler(async (req, res, next) => {
   const { params: { id }, body: $set, user } = req;
   const doc = await Problem.findById(id);

   $set.ioSet = ($set.ioSet || []).map(io => ({ inFile: io.inFile._id, outFile: io.outFile._id }));
   $set.exampleFiles = ($set.exampleFiles || []).map(file => file._id); // exampleFiles 처리 추가

   if (!doc) throw PROBLEM_NOT_FOUND;
   if (String(doc.writer) !== String(user.info)) throw FORBIDDEN;

   const contentFile = await File.findOne({ url: $set.content });
   if (!contentFile) throw FILE_NOT_FOUND;

   const ids = [...$set.ioSet.map(io => io.inFile), ...$set.ioSet.map(io => io.outFile), contentFile._id, contentFile._id];

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
   const documents = await Submit.find({parentType: "Practice", user: user.info, problem: id}).sort('-createdAt').limit(100);
   res.json(createResponse(res, documents));
});

exports.getSubmit = asyncHandler(async (req, res) => {
   const { params: { id }, user } = req;
   const exSubmit = await Submit.findById(id)
      .populate({ path: 'user' })
      .populate({ path: 'problem' });

   if (!exSubmit) throw SUBMIT_NOT_FOUND;
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
