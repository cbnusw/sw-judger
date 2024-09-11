const { Router } = require('express');
const { hasRole, isAuthenticated } = require('../../../../middlewares/auth');
const controller = require('./controller');
const router = Router();

// router.get('/', isAuthenticated, controller.getSubmits);
router.get('/', controller.getNotices);
router.get('/me', isAuthenticated, controller.getMyNotices);
router.get('/:id', controller.getNotice);
router.post('/', ...hasRole(), controller.createNotice);
router.put('/:id', ...hasRole(), controller.updateNotice);
router.delete('/:id', ...hasRole(), controller.removeNotice);

module.exports = router;
