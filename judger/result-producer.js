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
            messages: SubmitId
        })
        .then(console.log)
        .catch((e) => console.error(`[Result Producer Error]:::${e}`));
};

const init = async () => {
    await producer.connect();
    console.log("------- Producer Connected -------")
};

module.exports = {
    init,
    sendMessage
};
