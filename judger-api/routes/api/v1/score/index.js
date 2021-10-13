const { Router } = require('express');
const controller = require('./controller');
const router = Router();

router.get('/contest/:id', controller.getContestScoreBoards);

module.exports = router;
