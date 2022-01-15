const { KafkaClient, Producer, Consumer } = require('kafka-node');
const { debug, error } = require('../utils/logger');
const { RESULT_TOPIC: topic, SUBMIT_TOPIC: s_topic, KAFKA_BOOTSTRAP_SERVER, RESULT_GROUP_ID } = require('../env');
const { run } = require('../tools/scoreboard')

const client = new KafkaClient({idleConnection: 24 * 60 * 60 * 1000, kafkaHost: KAFKA_BOOTSTRAP_SERVER });

const initConsumer = () => {
  const topics = [{ topic, partition: 0 }]; 
  const options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024};
  const consumer = new Consumer(client, topics, options);

  debug("ready consumer")

  consumer.on('message', async (message) => {
    debug(`comsumer message:::${message.value}, consumer partition ::: ${message.partition}`);
    const id = message.value;
    console.log(`ID ${id} 제출 건 체점 시작`)
    await run(id)
    console.log(`ID ${id} 제출 건 체점 끝`)
    });

  consumer.on('error', error => {
    debug(error);
    console.log(error)
  });
};

const createProducer = () => {
  const producer = new Producer(client,{partitionerType:2});
  producer.on('ready', () => debug('ready producer'));
  producer.on('error', err => error('producer error', err));
  return producer;
};

const refreshMetaData = () =>{
  client.refreshMetadata([s_topic, topic],cb =>{
    debug(`Metadata Refreshed`)
  });
}

module.exports = {
  createProducer,
  initConsumer
};
