const { Submit, ScoreBoard } = require('../models');
const { CONTEST_NOT_FOUND, SUBMIT_NOT_FOUND } = require("../errors");

async function run(submitId) {
  const submitResult = await Submit.findById(submitId.replace(/\"/gi, "")).populate('parentId').populate('problem');
  if (!submitResult) throw SUBMIT_NOT_FOUND;
  const { parentId, user, problem, result, createdAt } = submitResult;
  if (!parentId) throw CONTEST_NOT_FOUND;
  const { testPeriod } = parentId;
  const start = new Date(testPeriod.start);
  const submittedAt = new Date(createdAt);
  let scoreBoard = await ScoreBoard.findOne({ contest: parentId._id, user });
  if (!scoreBoard) {
    const problems = parentId.problems;
    scoreBoard = await ScoreBoard.create({ contest: parentId._id, user, scores: problems.map(problem => ({ problem })) });
  }
  const score = scoreBoard.scores.find(elem => { return elem.problem.toString() === problem._id.toString()});
  score.right = result.type === 'done';
  score.tries++;
  score.time = Math.floor((submittedAt.getTime() - start.getTime()) / 60000); // 대회 시작 후 걸린 시간(분)
  if (result.type === 'done')
  {
    score.score = problem.score;
  } else {
    score.score = 0;
  }

  await scoreBoard.save();
}

module.exports = {
  run
}
