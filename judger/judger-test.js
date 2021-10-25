const { Kafka } = require("kafkajs");

const { KAFKA_BOOTSTRAP_SERVER, SUBMIT_GROUP_ID, SUBMIT_TOPIC } = require("./env");

const kafka = new Kafka({
  brokers: [KAFKA_BOOTSTRAP_SERVER],
  clientId: "judger",
});

const producer = kafka.producer({ groupId: SUBMIT_GROUP_ID });

const sendMessage = () => {
  return producer
    .send({
      topic: SUBMIT_TOPIC,
      messages: [
        {
          value: JSON.stringify({
            language: "go",
            codeName: "test.go",
          }),
        },
      ],
    })
    .then(console.log)
    .catch((e) => console.error(`[judger-producer] ${e.message}`, e));
};

const run = async () => {
  await producer.connect();
  setInterval(sendMessage, 500);
};

run().catch((e) => console.error(`[judger-producer] ${e.message}`, e));
