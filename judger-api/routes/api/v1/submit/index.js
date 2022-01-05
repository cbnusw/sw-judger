const { Router } = require('express');
const { isAuthenticated } = require('../../../../middlewares/auth');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getSubmits);
router.get('/me', isAuthenticated, controller.getMySubmits);
router.get('/contest/:id', controller.getContestSubmits);
router.get('/contest/:id/me', isAuthenticated, controller.getMyContestSubmits);
router.get('/problem/:id', controller.getProblemSubmits);
router.get('/problem/:id/me', isAuthenticated, controller.getMyProblemSubmits);

module.exports = router;
