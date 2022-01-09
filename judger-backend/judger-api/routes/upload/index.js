const { Router } = require('express');
const { authenticate, isAuthenticated, isOperator } = require('../../middlewares/auth');
const { createUpload } = require('../../utils/file');
const controller = require('./controller');

const upload = createUpload();

const router = Router();

router.get('/:id/download', authenticate, controller.download);

router.post(
  '/',
  isAuthenticated,
  upload.single('upload'),
  controller.uploadMiddleware,
  controller.upload
);

router.delete('/', ...isOperator, controller.removeFileByUrl);
router.delete('/:id', ...isOperator, controller.removeFileById);

module.exports = router;
