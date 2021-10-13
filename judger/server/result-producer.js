const { Kafka } = require("kafkajs");

const { KAFKA_BOOTSTRAP_SERVER, RESULT_CLIENT_ID, RESULT_GROUP_ID, RESULT_TOPIC } = require("./env");

const kafka = new Kafka({
    brokers: [KAFKA_BOOTSTRAP_SERVER],
    clientId: RESULT_CLIENT_ID,
    ssl: true,
});

const producer = kafka.producer({ groupId: RESULT_GROUP_ID });

const sendMessage = (sumbitId) => {
    return producer
        .send({
            topic: RESULT_TOPIC,
            messages: sumbitId
        })
        .then(console.log)
        .catch((e) => console.error(`[result-producer] ${e.message}`, e));
};

const init = async () => {
    await producer.connect();
};

module.exports = {
    init,
    sendMessage
};
