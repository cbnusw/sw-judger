const { Contest } = require('../../../../models');
const { ScoreBoard } = require('../../../../models');
const { findImageUrlFromHtml, updateFilesByUrls } = require('../../../../utils/file');
const { createResponse } = require('../../../../utils/response');
const asyncHandler = require('express-async-handler');
const {
  AFTER_APPLYING_PERIOD,
  AFTER_TEST_START,
  BEFORE_APPLYING_PERIOD,
  CONTEST_NOT_FOUND,
  CONTEST_ENROLLED,
  FORBIDDEN,
  PROGRESSING_CONTEST,
  CONTEST_PASSWORD_NOT_MATCH,
} = require('../../../../errors');
const { async } = require('rxjs');

const getContests = asyncHandler(async (req, res, next) => {
  const { query } = req;
  const documents = await Contest.search(query);
  res.json(createResponse(res, documents));
});

const getMyContests = asyncHandler(async (req, res, next) => {
  const { query, user } = req;
  const documents = await Contest.search(query, { writer: user.info });
  res.json(createResponse(res, documents));
});

const confirmPassword = asyncHandler(async (req, res) => {
  const {
    params: { id },
    query: { password },
  } = req;
  const document = await Contest.findById(id);
  if (!document) throw CONTEST_NOT_FOUND;

  if (!document.password) res.json(createResponse(res));

  if (document.password && document.password === password) res.json(createResponse(res));
  else if (document.password && document.password !== password) throw CONTEST_PASSWORD_NOT_MATCH;
});

const getRegisteredContests = asyncHandler(async (req, res, next) => {
  const { query, user } = req;
  const now = new Date();
  const documents = await Contest.search(query, {
    $and: [{ contestants: user.info }, { 'testPeriod.end': { $gt: now } }],
  });
  res.json(createResponse(res, documents));
});

const getApplyingContests = asyncHandler(async (req, res, next) => {
  const now = new Date();

  const documents = await Contest.search(
    {},
    {
      $or: [
        { $and: [{ applyingPeriod: null }, { testPeriod: null }] },
        {
          $and: [{ applyingPeriod: null }, { 'testPeriod.start': { $gt: now } }],
        },
        {
          $and: [{ 'applyingPeriod.start': { $lte: now } }, { 'applyingPeriod.end': { $gte: now } }],
        },
      ],
    }
  );

  res.json(createResponse(res, documents));
});

const getProgressingContests = asyncHandler(async (req, res, next) => {
  const now = new Date();

  const documents = await Contest.search(
    {},
    {
      'testPeriod.end': { $gt: now },
    }
  );

  res.json(createResponse(res, documents));
});

const getContest = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;

  const doc = await Contest.findById(id)
    .populate({
      path: 'writer',
      select: '-no -phone -email -role -permissions',
    })
    .populate({ path: 'contestants', select: '-permissions' })
    .select('-problems -password');

  if (!doc) return next(CONTEST_NOT_FOUND);

  res.json(createResponse(res, doc));
});

const getContestForAdmin = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
  } = req;

  const doc = await Contest.findById(id).populate({ path: 'writer' }).populate({ path: 'contestants' });

  if (!doc) return next(CONTEST_NOT_FOUND);

  res.json(createResponse(res, doc));
});

const getContestProblems = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;

  const contest = await Contest.findById(id);
  if (!contest) return next(CONTEST_NOT_FOUND);

  const query = Contest.findById(id)
    .populate({ path: 'writer' })
    .populate({ path: 'problems', populate: { path: 'writer' } });

  if (String(contest.writer) === String(user.info)) {
    query.populate({ path: 'problems' });
  }

  const doc = await query.exec();

  res.json(createResponse(res, doc));
});

const getMyEnrollContests = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const contests = await Contest.find(
    {
      contestants: { $elemMatch: { $eq: user.info } },
    },
    'title _id'
  );

  if (!contests || contests.length === 0) {
    return next(CONTEST_NOT_FOUND);
  }

  const contestData = [];
  for (const contest of contests) {
    const contestScore = await additionalDataContest(contest, user.info);
    // 대회 정보와 추가 데이터를 합치고 결과 배열에 추가
    const contestWithAdditionalData = {
      ...contest.toObject(),
      contestScore,
    };

    contestData.push(contestWithAdditionalData);
  }

  res.json(createResponse(res, contestData));
});

// 대회에 대한 추가 작업을 수행하는 함수
async function additionalDataContest(contest, userId) {
  const data = await ScoreBoard.findOne({
    contest: contest._id,
    user: userId,
  });
  if (data == null) {
    //noData = "제출없음";
    return null;
  }
  // scores 배열의 전체 원소 수 계산
  const totalScores = data.scores.length;

  // right: true인 원소의 개수 계산
  const trueScores = data.scores.filter((score) => score.right).length;
  const additionalData = `${totalScores} / ${trueScores}`;
  return additionalData;
}

const createContest = asyncHandler(async (req, res, next) => {
  const { body, user } = req;

  body.writer = user.info;
  const urls = findImageUrlFromHtml(body.content);
  const doc = await Contest.create(body);

  await updateFilesByUrls(req, doc._id, 'Contest', urls);

  res.json(createResponse(res, doc));
});

// const createContestProblem = asyncHandler(async (req, res, next) => {
//   const { params: { id }, body, user } = req;

//   const contest = await Contest.findById(id);

//   if (!contest) return next(CONTEST_NOT_FOUND);
//   if (String(contest.writer) !== String(user.info)) return next(FORBIDDEN);

//   const { testPeriod } = contest;
//   const now = new Date();
//   const start = new Date(testPeriod.start);
//   if (now.getTime() > start.getTime()) return next(AFTER_TEST_START);

//   body.contest = id;
//   body.writer = user.info;

//   const problem = await Problem.create(body);

//   const urls = [body.content, ...(body.ioSet || []).map(io => io.inFile.url), ...(body.ioSet || []).map(io => io.outFile.url)];
//   contest.problems.push(problem._id);

//   await Promise.all([contest.save(), updateFilesByUrls(req, problem._id, 'Problem', urls)]);

//   res.json(createResponse(res, problem));
// });

const enrollContest = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  const contest = await Contest.findById(id);

  if (!contest) return next(CONTEST_NOT_FOUND);

  const { applyingPeriod, testPeriod } = contest;

  if (applyingPeriod) {
    const now = new Date();
    let { start, end } = applyingPeriod;
    start = new Date(start);
    end = new Date(end);

    if (now.getTime() < start.getTime()) return next(BEFORE_APPLYING_PERIOD);
    if (now.getTime > end.getTime()) return next(AFTER_APPLYING_PERIOD);
  }

  if (testPeriod) {
    const now = new Date();
    const start = new Date(testPeriod.start);
    if (now.getTime() > start.getTime()) return next(PROGRESSING_CONTEST);
  }

  if (contest.contestants.map((id) => String(id)).includes(String(user.info))) return next(CONTEST_ENROLLED);
  contest.contestants.unshift(user.info);
  await contest.save();

  return res.json(createResponse(res));
});

const unenrollContest = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  const contest = await Contest.findById(id);

  if (!contest) return next(CONTEST_NOT_FOUND);

  const { testPeriod } = contest;

  if (testPeriod) {
    const now = new Date();
    let { start } = testPeriod;
    start = new Date(start);

    if (now.getTime() > start.getTime()) return next(PROGRESSING_CONTEST);
  }

  const idx = contest.contestants.map((id) => String(id)).indexOf(String(user.info));
  if (idx !== -1) {
    contest.contestants.splice(idx, 1);
    await contest.save();
  }
  return res.json(createResponse(res));
});

const updateContest = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    body: $set,
    user,
  } = req;

  const doc = await Contest.findById(id);

  if (!doc) return next(CONTEST_NOT_FOUND);
  if (String(doc.writer) !== String(user.info)) return next(FORBIDDEN);

  if ($set.content) {
    const urls = findImageUrlFromHtml($set.content);
    await updateFilesByUrls(req, doc._id, 'Contest', urls);
  }
  await doc.updateOne({ $set });

  res.json(createResponse(res));
});

// const updateContestProblem = asyncHandler(async (req, res, next) => {
//   const { params: { id, problemId }, body: $set, user } = req;

//   const contest = await Contest.findById(id);
//   const problem = await Problem.findById(problemId);

//   if (!contest) return next(CONTEST_NOT_FOUND);
//   if (!problem) return next(PROBLEM_NOT_FOUND);

//   if (String(contest.writer) !== String(user.info)) return next(FORBIDDEN);
//   if (String(problem.writer) !== String(user.info)) return next(FORBIDDEN);
//   if (!contest.problems.map(p => String(p)).includes(String(problem._id))) return next(IS_NOT_CONTEST_PROBLEM);

//   // const { testPeriod } = contest;
//   // const now = new Date();
//   // const start = new Date(testPeriod.start);
//   // if (now.getTime() > start.getTime()) return next(AFTER_TEST_START);

//   const urls = [...($set.ioSet || []).map(io => io.inFile.url), ...($set.ioSet || []).map(io => io.outFile.url)];
//   if ($set.content) urls.push($set.content);

//   await Promise.all([problem.updateOne({ $set }), updateFilesByUrls(req, problem._id, 'Problem', urls)]);

//   res.json(createResponse(res));
// });

const reorderContestProblems = asyncHandler(async (req, res, next) => {
  let {
    params: { id },
    body: { problems },
    user,
  } = req;

  const contest = await Contest.findById(id);

  if (!contest) return next(CONTEST_NOT_FOUND);
  if (String(contest.writer) !== String(user.info)) return next(FORBIDDEN);

  problems = problems.map((problem) => problem._id);
  await contest.updateOne({ $set: { problems } });

  res.json(createResponse(res));
});

const removeContest = asyncHandler(async (req, res, next) => {
  const {
    params: { id },
    user,
  } = req;
  const doc = await Contest.findById(id);

  if (!doc) return next(CONTEST_NOT_FOUND);

  const { testPeriod } = doc;
  const now = new Date();
  const start = new Date(testPeriod.start);
  if (now.getTime() > start.getTime()) return next(AFTER_TEST_START);

  await doc.deleteOne();

  res.json(createResponse(res));
});

exports.getContests = getContests;
exports.getMyContests = getMyContests;
exports.getRegisteredContests = getRegisteredContests;
exports.getApplyingContests = getApplyingContests;
exports.getProgressingContests = getProgressingContests;
exports.getContest = getContest;
exports.getContestForAdmin = getContestForAdmin;
exports.getContestProblems = getContestProblems;
exports.getMyEnrollContests = getMyEnrollContests;
exports.createContest = createContest;

exports.enrollContest = enrollContest;
exports.unenrollContest = unenrollContest;
exports.updateContest = updateContest;

exports.reorderContestProblems = reorderContestProblems;
exports.removeContest = removeContest;
exports.confirmPassword = confirmPassword;
// exports.createContestProblem = createContestProblem;
// exports.updateContestProblem = updateContestProblem;
