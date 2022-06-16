const { Router } = require('express');
const { hasRole, isAuthenticated } = require('../../../../middlewares/auth');
const controller = require('./controller');

const router = Router();

router.get('/', isAuthenticated, controller.getPractices);
router.get('/:id', isAuthenticated, controller.getPractice);
router.get('/:id/my-submits', isAuthenticated, controller.getMyPracticeSubmits);
router.get('/:id/submit/detail', isAuthenticated, controller.getSubmit);
router.post('/', isAuthenticated, controller.createPractice);
router.post('/:id/submit', isAuthenticated, controller.createPracticeSubmit);
router.patch('/:id', isAuthenticated, controller.updatePractice);
router.delete('/:id', isAuthenticated, controller.removePractice);


module.exports = router;
