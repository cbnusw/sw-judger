const { Notice } = require('../../../../models');
const { createResponse } = require('../../../../utils/response');
const asyncHandler = require('express-async-handler');
const {
   FORBIDDEN,
   PROBLEM_NOT_FOUND,
   FILE_NOT_FOUND
} = require('../../../../errors');
const { hasRole } = require("../../../../utils/permission");

// 공지사항 여러개
const getNotices = asyncHandler(async (req, res, next) => {
   const { query } = req;
   const documents = await Notice.search(query);

   res.json(createResponse(res, documents));
});

// 단일 공지사항
const getNotice = asyncHandler(async (req, res, next) => {
   const { params: { id }, user } = req;
   const notice= await Notice.findById(id);

   if (!notice) throw PROBLEM_NOT_FOUND;

   res.json(createResponse(res, doc));
});

//공지사항 생성
const createNotice = asyncHandler(async (req, res, next) => {
   const { body, user } = req;

   body.writer = user.info;

   const doc = await Notice.create(body);

   res.json(createResponse(res, doc));
});

// 공지사항 수정
const updateNotice = asyncHandler(async (req, res, next) => {
   const { params: { id }, body: $set, user } = req;
   const doc = await Notice.findById(id);

   if (!doc) throw PROBLEM_NOT_FOUND;
   if (String(doc.writer) !== String(user.info)) throw FORBIDDEN;

   await doc.updateOne({ $set });

   res.json(createResponse(res));
});

// 공지사항 삭제
const removeNotice = asyncHandler(async (req, res, next) => {
   const { params: { id }, user } = req;

   const doc = await Notice.findById(id);
   if (!hasRole(user) && String(doc.writer !== String(user.info))) throw FORBIDDEN;

   await Promise.all([
      doc.deleteOne(),
   ]);

   res.json(createResponse(res));
});

//공지사항 등록 페이지

exports.getNotices = getNotices;
exports.getNotice = getNotice;
exports.createNotice = createNotice;
exports.updateNotice = updateNotice;
exports.removeNotice = removeNotice;