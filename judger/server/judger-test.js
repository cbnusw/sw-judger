const { Kafka } = require("kafkajs");

const { KAFKA_BOOTSTRAP_SERVER, GROUP_ID, SUMBIT_TOPIC } = require("./env");

const kafka = new Kafka({
  brokers: [KAFKA_BOOTSTRAP_SERVER],
  clientId: "judger",
});

const producer = kafka.producer({ groupId: GROUP_ID });

const sendMessage = () => {
  return producer
    .send({
      topic: SUMBIT_TOPIC,
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
