const { Router } = require('express');
const { authenticate, isAuthenticated, hasPermission } = require('../../../../middlewares/auth');
const { handleAccessProblem } = require('./middlewares');
const controller = require('./controller');
const { PARENT_TYPES } = require('../../../../constants');
const { CONTEST, ASSIGNMENT } = PARENT_TYPES;
const router = Router();

router.get('/', controller.getProblems(null));
router.get('/contest', controller.getProblems(CONTEST));
router.get('/assignment', controller.getProblems(ASSIGNMENT));
router.get('/:id', authenticate, handleAccessProblem, controller.getProblem);
router.post('/', ...hasPermission('judge'), controller.createProblem(CONTEST));
router.post('/assignment', ...hasRole('professor'), controller.createProblem(ASSIGNMENT))
// router.post('/:id/submit', controller.createSubmit);
router.post('/:id/submit', isAuthenticated, handleAccessProblem, controller.createSubmit);
router.put('/:id', ...hasPermission('judge'), controller.updateProblem);
router.delete('/:id', ...hasPermission('judge'), handleAccessProblem, controller.removeProblem);

module.exports = router;
