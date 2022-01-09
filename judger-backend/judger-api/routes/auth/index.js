const { Router } = require('express');
const { isAuthenticated } = require('../../middlewares/auth');
const controller = require('./controller');


const router = Router();

router.get('/me', isAuthenticated, controller.getMe);
router.post('/login', controller.login);

module.exports = router;
