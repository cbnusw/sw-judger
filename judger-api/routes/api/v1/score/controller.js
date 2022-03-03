const asyncHandler = require('express-async-handler');
const { ScoreBoard } = require('../../../../models');
const { createResponse } = require('../../../../utils/response');

const getContestScoreBoards = asyncHandler(async (req, res, next) => {
  const { params: { id } } = req;

  const scores = await ScoreBoard.find({ contest: id }).populate({ path: 'user' });
  res.json(createResponse(res, scores));
});

exports.getContestScoreBoards = getContestScoreBoards;
