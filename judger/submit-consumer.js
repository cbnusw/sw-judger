const { Kafka } = require('kafkajs');

const judger = require('./judger')
const resultProducer = require('./result-producer');
const { Submit, Problem, File } = require('./models/@main');
const {
  KAFKA_BOOTSTRAP_SERVER,
  SUBMIT_CLIENT_ID,
  SUBMIT_GROUP_ID,
  SUBMIT_TOPIC,
} = require('./env');

const kafka = new Kafka({
  brokers: [KAFKA_BOOTSTRAP_SERVER],
  clientId: SUBMIT_CLIENT_ID,
});

const init = async () => {
  const consumer = kafka.consumer({ groupId: SUBMIT_GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ topic: SUBMIT_TOPIC });
  consumer.run({
    partitionsConsumedConcurrently: 1,
    eachMessage: async ({ topic, partition, message }) => {
      const submitId = message.value.toString('utf-8');
      const submit = await Submit.findOne({ _id: submitId });
      console.log("시작 :::::: ", `타켓 ID: ${submitId}, 파티션: ${partition}`);
      await judger.startJudge(submit);
      console.log("프로듀서 동작 :::::: ", `타겟 ID: ${submitId}`);
      await resultProducer.init();
      if(submit.parentType === 'Contest')await resultProducer.sendMessage(submitId);
      console.log( `ID ${submitId} 작업 완료`)
    },
  });

  return consumer;
};

module.exports = {
  init
};
