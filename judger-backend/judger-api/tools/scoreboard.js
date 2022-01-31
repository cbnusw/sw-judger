const { Submit, ScoreBoard, Contest, Problem } = require('../models');
const { CONTEST_NOT_FOUND, SUBMIT_NOT_FOUND } = require("../errors");

async function run(submitId) {
  // const submits = await Submit.findById({_id:submitId}).sort('createdAt');
  //
  // console.log(submits)
  //
  // const rightProblems = {};
  //
  // for (let submit of submits) {
  //   const { contest, user, problem, result, createdAt } = submit;
  //   const contestDoc = await Contest.findById(contest);
  //
  //   if (!result) {
  //     continue;
  //   }
  //
  //   if (!contestDoc) {
  //     console.log('contest not found');
  //     continue;
  //   }
  //
  //   const { testPeriod } = contestDoc;
  //   const start = new Date(testPeriod.start);
  //   const submittedAt = new Date(createdAt);
  //
  //   let scoreBoard = await ScoreBoard.findOne({ contest, user });
  //   if (!scoreBoard) {
  //     const problems = contestDoc.problems;
  //     scoreBoard = await ScoreBoard.create({ contest, user, scores: problems.map(problem => ({ problem })) });
  //   }
  //
  //   const score = scoreBoard.scores.find(s => String(s.problem) === String(problem));
  //
  //   if (score && !score.right) {
  //     score.right = result.type === 'done';
  //     score.tries++;
  //     score.time = Math.floor((submittedAt.getTime() - start.getTime()) / 60000);
  //
  //     if (score.right) {
  //       rightProblems[String(problem)] = (rightProblems[String(problem)] || 0) + 1;
  //     }
  //     await scoreBoard.save();
  //     console.log("done!")
  //   }
  // }
  // console.log(rightProblems);
  const submitResult = await Submit.findById({ _id: submitId }).populate('parent').populate('problem');
  if (!submitResult) throw SUBMIT_NOT_FOUND;
  const { parent, user, problem, result, createdAt } = submitResult;
  if (!parent) throw CONTEST_NOT_FOUND;
  const { testPeriod } = parent;
  const start = new Date(testPeriod.start);
  const submittedAt = new Date(createdAt);
  let scoreBoard = await ScoreBoard.findOne({ contest, user });
  if (!scoreBoard) {
    const problems = parent.problems;
    scoreBoard = await ScoreBoard.create({ parent: parent._id, user, scores: problems.map(problem => ({ problem })) });
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
