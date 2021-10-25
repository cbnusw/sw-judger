const { KafkaClient, Producer, Consumer } = require('kafka-node');
const { debug, error } = require('../utils/logger');
const { RESULT_TOPIC: topic, KAFKA_BOOTSTRAP_SERVER } = require('../env');
const { Submit, ScoreBoard, Contest } = require('../models');
const { CONTEST_NOT_FOUND } = require('../errors');

const client = new KafkaClient({idleConnection: 24 * 60 * 60 * 1000, kafkaHost: KAFKA_BOOTSTRAP_SERVER });


const initConsumer = io => {
  const topics = [{ topic, partition: 0 }];
  const options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
  const consumer = new Consumer(client, topics, options);

  consumer.on('message', async (message) => {
    debug(`comsumer message:::${message.value}`);

    const id = message.value;

    try {
      const submitResult = await Submit.findById(id);
      const { contest, user, problem, result, createdAt } = submitResult;
      const contestDoc = await Contest.findById(contest);

      if (!contestDoc) throw CONTEST_NOT_FOUND;

      const { testPeriod } = contestDoc;
      const start = new Date(testPeriod.start);
      const submittedAt = new Date(createdAt);

      let scoreBoard = await ScoreBoard.findOne({ contest, user });
      if (!scoreBoard) {
        const problems = contestDoc.problems;
        scoreBoard = await ScoreBoard.create({ contest, user, scores: problems.map(problem => ({ problem })) });
      }

      const score = scoreBoard.scores.find(s => s.problem === problem);

      score.right = result.type === 'done';
      score.tries++;
      score.time = Math.floor((submittedAt.getTime() - start.getTime()) / 60000); // 대회 시작 후 걸린 시간(분)

      await scoreBoard.save();

      io.emit('result', submitResult);
    } catch (e) {
      io.emit('error', e);
    }

  });

  consumer.on('error', error => {
    console.error(error);
  });
};

const createProducer = () => {
  const producer = new Producer(client);
  producer.on('ready', () => debug('ready producer'));
  producer.on('error', err => error('producer error', err));
  return producer;
};

module.exports = {
  createProducer,
  initConsumer,
};
