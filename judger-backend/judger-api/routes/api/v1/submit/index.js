const { Router } = require('express');
const { isAuthenticated } = require('../../../../middlewares/auth');
const controller = require('./controller');

const router = Router();

// router.get('/', isAuthenticated, controller.getSubmits);
router.get('/me', isAuthenticated, controller.getMySubmits);
router.get('/:id', isAuthenticated, controller.getSubmit);
router.get('/contest/:id', isAuthenticated, controller.getContestSubmits);
router.get('/contest/:id/me', isAuthenticated, controller.getMyContestSubmits);
router.get('/problem/:id', isAuthenticated,controller.getProblemSubmits);
router.get('/problem/:id/me', isAuthenticated, controller.getMyProblemSubmits);
router.get('/assignment/:id', isAuthenticated, controller.getAssignmentSubmits)
router.get('/assignment/:id/me', isAuthenticated, controller.getMyAssignmentSubmits)

module.exports = router;
