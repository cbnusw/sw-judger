const { Contest, Assignment, Problem } = require('../../../../models');
const { SUBMIT_TOPIC: topic } = require('../../../../env');
const { refreshMetaData } = require("../../../../kafka");
const {
  PROBLEM_NOT_FOUND,
  ASSIGNMENT_NOT_FOUND,
  CONTEST_NOT_FOUND,
} = require('../../../../errors');
const { updateFilesByUrls, removeFilesByUrls } = require('../../../../utils/file');

const parentModels = {
  'Assignment': Assignment,
  'Contest': Contest,
}


const parentAssignees = {
  'Assignment': 'students',
  'Contest': 'contestants'
}

const parentNotFoundErrors = {
  'Assignment': ASSIGNMENT_NOT_FOUND,
  'Contest': CONTEST_NOT_FOUND
}


exports.producingSubmit = (producer, submitId) => {
  refreshMetaData()
  const payloads = [{
    topic,
    messages: submitId
  }];

  return new Promise((resolve, reject) => {
    producer.send(payloads, (err, data) => {
      console.log(`::: ID ${payloads[0].messages} message sent :::::: partition info : ${payloads[0].partition}`)
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.isPublished = (problem) => {
  const now = new Date();
  const published = new Date(problem.published);
  return now.getTime() > published.getTime();
}

exports.isAssigned = async (user, parentId, parentType) => {
  const parent = await parentModels[parentType].findById(parentId);
  return parent[parentAssignees[parentType]].map(assignee => String(assignee)).includes(String(user.info))
}

exports.checkTestPeriodOf = ({testPeriod}) => {
  const now = new Date();
  const start = new Date(testPeriod.start);
  const end = new Date(testPeriod.end);
  if (now.getTime() > end.getTime() || now.getTime() < start.getTime()) return false;
  return true;
}

exports.removeProblemAt = async (parent, problemId) => {
  const index = parent.problems.indexOf(problemId);
  if (index !== -1) {
    parent.problems.splice(index, 1);
    await parent.save();
  }
}

exports.assignTo = async (parent, problem) => {
  parent.problems.push(problem._id);
  await parent.save();
}

const validateParentOf = ({ parentType }, parent) => {

  if (!parentType) return null;
  
  if (!parent) return parentNotFoundErrors[parentType];
  // if (!hasRole(user) && !checkTestPeriodOf(parent)) return IS_NOT_TEST_PERIOD;
  return null;
}


exports.validateByProblem = async (id) => {
  const problem = await Problem.findById(id).populate('parentId');
  if (!problem) return ({ err: PROBLEM_NOT_FOUND });
  const { parentId } = problem;
  const err = validateParentOf(problem, parentId);
  if (err) return ({ err });
  return ({ problem });
}

exports.checkPublishingTime = ({published}, {testPeriod}) => {
  published = new Date(published);
  const end = new Date(testPeriod.end);
  if (published.getTime() > end.getTime()) return true;
  return false;
}

exports.updateFilesOf = async (problem, user) => {
  const urls = [problem.content, ...(problem.ioSet || []).map(io => io.inFile.url), ...(problem.ioSet || []).map(io => io.outFile.url)];
  await Promise.all([
    updateFilesByUrls(user, problem._id, 'Problem', urls),
  ]);
} 

exports.removeFilesOf = async (problem, user) => {
  const urls = [problem.content, ...(problem.ioSet || []).map(io => io.inFile.url), ...(problem.ioSet || []).map(io => io.outFile.url)];
  await Promise.all([
    removeFilesByUrls(user, urls),
  ])
}


const checkOwnerOf = (target, user) => {
  return String(target.writer) === String(user.info);
}

exports.parentModels = parentModels;
exports.parentAssignees = parentAssignees;
exports.parentNotFoundErrors = parentNotFoundErrors;
exports.validateParentOf = validateParentOf;
exports.checkOwnerOf = checkOwnerOf;