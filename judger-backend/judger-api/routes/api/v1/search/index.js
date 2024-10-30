const { Router } = require('express');
const { hasRole} = require('../../../../middlewares/auth');
const controller = require('./controller');
const router = Router();

// 관리자 권한 추가 필요 자기 자신이 작성 or 모든 작성자의 문제
router.get('/', controller.getProblems); // isAuthenticated, hasRole
router.get('/:id', controller.getProblem);
router.get('/:id/:fileId', controller.downloadFile);

module.exports = router;
