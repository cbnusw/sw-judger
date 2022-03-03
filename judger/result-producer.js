const { Kafka } = require("kafkajs");

const { KAFKA_BOOTSTRAP_SERVER, RESULT_CLIENT_ID, RESULT_GROUP_ID, RESULT_TOPIC } = require("./env");

const kafka = new Kafka({
    brokers: [KAFKA_BOOTSTRAP_SERVER],
    clientId: RESULT_CLIENT_ID,
});

const producer = kafka.producer({ groupId: RESULT_GROUP_ID });

const sendMessage = (SubmitId) => {
  return producer
    .send({
      topic: RESULT_TOPIC,
      messages: [
        { value: SubmitId }
      ]
    })
    .then(console.log("------- Producer Submitted -------"))
    .catch((e) => console.error(`[result-producer] ${e.message}`, e));
};

const init = async () => {
    await producer.connect()
      .then(console.log("------- Producer Connected -------"))
};

module.exports = {
    init,
    sendMessage
};
