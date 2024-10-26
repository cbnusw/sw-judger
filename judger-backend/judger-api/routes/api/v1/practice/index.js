const { Router } = require('express');
const { isAuthenticated } = require('../../../../middlewares/auth');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getPractices);
router.get('/:id', isAuthenticated, controller.getPractice);
router.get('/:id/my-submits', isAuthenticated, controller.getMyPracticeSubmits);
router.get('/:id/submit/detail', isAuthenticated, controller.getSubmit);
router.get('/:problemId/example-files/:fileId', controller.downloadExampleFile);
router.post('/', isAuthenticated, controller.createPractice);
router.post('/:id/submit', isAuthenticated, controller.createPracticeSubmit);
router.patch('/:id', isAuthenticated, controller.updatePractice);
router.delete('/:id', isAuthenticated, controller.removePractice);

module.exports = router;
