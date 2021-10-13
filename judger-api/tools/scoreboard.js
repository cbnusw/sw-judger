const { Submit, ScoreBoard, Contest } = require('../models');

async function run() {
  const submits = await Submit.find({}).sort('createdAt');

  const rightProblems = {};

  for (let submit of submits) {
    const { contest, user, problem, result, createdAt } = submit;
    const contestDoc = await Contest.findById(contest);

    if (!result) {
      continue;
    }

    if (!contestDoc) {
      console.log('contest not found');
      continue;
    }

    const { testPeriod } = contestDoc;
    const start = new Date(testPeriod.start);
    const submittedAt = new Date(createdAt);

    let scoreBoard = await ScoreBoard.findOne({ contest, user });
    if (!scoreBoard) {
      const problems = contestDoc.problems;
      scoreBoard = await ScoreBoard.create({ contest, user, scores: problems.map(problem => ({ problem })) });
    }

    const score = scoreBoard.scores.find(s => String(s.problem) === String(problem));

    if (score && !score.right) {
      score.right = result.type === 'done';
      score.tries++;
      score.time = Math.floor((submittedAt.getTime() - start.getTime()) / 60000);

      if (score.right) {
        rightProblems[String(problem)] = (rightProblems[String(problem)] || 0) + 1;
      }
      await scoreBoard.save();
    }
  }
  console.log(rightProblems);
}

run()
  .then(() => console.log('complete'))
  .catch(err => console.error(err.message))
  .then(() => process.exit());
