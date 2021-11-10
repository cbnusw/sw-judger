const { Submit, ScoreBoard, Contest, Problem } = require('../models');
const { CONTEST_NOT_FOUND } = require("../errors");

async function run(submitId) {
  const submitResult = await Submit.findById({_id:submitId});
  const { contest, user, problem, result, createdAt } = submitResult;
  const contestDoc = await Contest.findById(contest);
  const problemData = await Problem.findById(problem);

  if (!contestDoc) throw CONTEST_NOT_FOUND;

  const { testPeriod } = contestDoc;
  const start = new Date(testPeriod.start);
  const submittedAt = new Date(createdAt);
  let scoreBoard = await ScoreBoard.findOne({ contest, user });
  if (!scoreBoard) {
    const problems = contestDoc.problems;
    scoreBoard = await ScoreBoard.create({ contest, user, scores: problems.map(problem => ({ problem })) });
  }
  const score = scoreBoard.scores.find(elem => elem.problem.toString() === problem.toString());
  score.right = result.type === 'done';
  score.tries++;
  score.time = Math.floor((submittedAt.getTime() - start.getTime()) / 60000); // 대회 시작 후 걸린 시간(분)
  if (result.type === 'done')
  {
    score.score = problemData.score;
  } else {
    score.score = 0;
  }

  await scoreBoard.save();
}

module.exports = {
  run
}
