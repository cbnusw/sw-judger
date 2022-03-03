const { Router } = require('express');
const { authenticate, isAuthenticated, hasProblemPermission} = require('../../../../middlewares/auth');
const { handleAccessProblem } = require('./middlewares');
const controller = require('./controller');
const router = Router();

router.get('/', controller.getProblems);
router.get('/:id', authenticate, handleAccessProblem, controller.getProblem);
router.post('/', ...hasProblemPermission, controller.createProblem);
// router.post('/:id/submit', controller.createSubmit);
router.post('/:id/submit', isAuthenticated, handleAccessProblem, controller.createSubmit);
router.put('/:id', ...hasProblemPermission, controller.updateProblem);
router.delete('/:id', ...hasProblemPermission, handleAccessProblem, controller.removeProblem);

module.exports = router;
