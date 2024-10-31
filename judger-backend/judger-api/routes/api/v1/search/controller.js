const path = require('path');
const fs = require('fs');
const {
   Problem,
   File
} = require('../../../../models');
const { createResponse } = require('../../../../utils/response');
const {
   PROBLEM_NOT_FOUND,FORBIDDEN
} = require('../../../../errors');
const asyncHandler = require('express-async-handler');

exports.getProblems = asyncHandler(async (req, res, next) => {
   const { query, user } = req;
   //const documents = await Problem.search(query);
   const documents = await Problem.search(query, { writer: user.info });

   res.json(createResponse(res, documents));
});

exports.getProblem = asyncHandler(async (req, res, next) => {
   const { params: { id } } = req;

   const problem = await Problem.findById(id);
   if (!problem) throw PROBLEM_NOT_FOUND;
   //if (problem.writer != user._id) throw FORBIDDEN;

   const pdfUrl = problem.content;
   const pdfFile = await File.findOne({ url: pdfUrl });
   const pdfId = pdfFile ? pdfFile._id : null;

   // content 필드에 pdfId 포함하여 응답 데이터 생성
   const responseData = {
      ...problem.toObject(),
      content: {
         _id: pdfId ? pdfId : null,
         url: pdfUrl,
      }
   };

   res.json(createResponse(res, responseData));
});

// 파일 다운로드 API
exports.downloadFile = asyncHandler(async (req, res, next) => {
   const { fileId } = req.params;

   // 데이터베이스에서 파일 검색
   const file = await File.findOne({ _id: fileId });
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
