const { Router } = require('express');
const { hasRole, isAuthenticated } = require('../../../../middlewares/auth');
const { handleAccessContestProblem } = require('./middlewares');
const controller = require('./controller');

const router = Router();

router.get('/', controller.getAssignments);
router.get('/me', isAuthenticated, controller.getMyAssignments);
router.get('/registered', isAuthenticated, controller.getRegisteredAssignments);
//router.get('/applying', controller.getApplyingAssignments);
router.get('/progressing', controller.getProgressingAssignments);
router.get('/:id', controller.getAssignment);
router.get(
  '/:id/problems',
  isAuthenticated,
  handleAccessContestProblem,
  controller.getAssignmentProblems
);

router.post('/', ...hasRole(), controller.createAssignment);
router.post('/:id/problem', ...hasRole(), controller.createAssignmentProblem);
router.post('/:id/enroll', isAuthenticated, controller.enrollAssignment);
router.post('/:id/unenroll', isAuthenticated, controller.unenrollAssignment);
router.put('/:id', ...hasRole(), controller.updateAssignment);
router.put('/:id/problem/:problemId', ...hasRole(), controller.updateAssignmentProblem);
router.patch('/:id/problem/reorder', ...hasRole(), controller.reorderAssignmentProblems);
router.delete('/:id', ...hasRole(), controller.removeAssignment);

module.exports = router;
