const { Router } = require('express');
const { authenticate, isAuthenticated, hasPermission } = require('../../../../middlewares/auth');
const { handleAccessProblem } = require('./middlewares');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getProblems);
router.get('/:id', isAuthenticated, handleAccessProblem, controller.getProblem);
router.post('/', ...hasPermission('judge'), controller.createProblem);
// router.post('/:id/submit', controller.createSubmit);
router.post('/:id/submit', isAuthenticated, handleAccessProblem, controller.createSubmit);
router.put('/:id', ...hasPermission('judge'), controller.updateProblem);
router.delete('/:id',...hasPermission('judge'), handleAccessProblem,controller.removeProblem);

module.exports = router;
