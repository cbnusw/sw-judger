const { Contest, Assignment } = require('../../../../models');
const { SUBMIT_TOPIC: topic } = require('../../../../env');
const { refreshMetaData } = require("../../../../kafka");
const {
   ASSIGNMENT_NOT_FOUND,
   CONTEST_NOT_FOUND,
} = require('../../../../errors');

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
};

exports.isAssigned = async (user, parentId, parentType) => {
   const parent = await parentModels[parentType].findById(parentId);
   return parent[parentAssignees[parentType]].map(assignee => String(assignee)).includes(String(user.info))
};

exports.checkTestPeriodOf = async (parentId, parentType) => {
   const parent = await parentModels[parentType].findById(parentId);

   const now = new Date();
   const start = new Date(parent.testPeriod.start);
   const end = new Date(parent.testPeriod.end);
   if (now.getTime() > end.getTime() || now.getTime() < start.getTime()) return false;
   return true;
};
