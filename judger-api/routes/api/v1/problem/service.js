const { KAFKA_SUBMIT_TOPIC: topic } = require('../../../../env');


exports.producingSubmit = (producer, submitId) => {

  const payloads = [{
    topic,
    messages: submitId
  }];

  return new Promise((resolve, reject) => {
    producer.send(payloads, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
