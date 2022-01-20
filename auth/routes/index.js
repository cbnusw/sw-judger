const { Router } = require('express');
const { isAuthenticated } = require('./middlewares');
const controller = require('./controller');

const router = Router();

router.get('/me', isAuthenticated, controller.getMe);
router.get('/logout', isAuthenticated, controller.logout);
router.get('/token/validate', isAuthenticated, controller.validateAccessToken);
router.get('/token/refresh', controller.refreshToken);

router.post('/join', controller.join);
// router.post('/student/join', controller.joinStudent);
// router.post('/staff/join', controller.joinStaff);
router.post('/login', controller.login);
router.post('/operator/login', controller.loginOperator);
router.post('/no/find', controller.findRegNo);
router.post('/otp/send', controller.sendOtp);
router.post('/otp/check', controller.checkOtp);
router.post('/password/init', controller.initPassword);

router.put('/me', isAuthenticated, controller.updateMe);

router.patch('/password', isAuthenticated, controller.changePassword);

// readdirSync(__dirname)
//   .filter(dir => statSync(join(__dirname, dir)).isDirectory())
//   .forEach(dir => router.use(`/${dir}`, require(`./${dir}`)));

module.exports = router;
