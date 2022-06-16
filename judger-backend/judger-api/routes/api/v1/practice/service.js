const { SUBMIT_TOPIC: topic } = require('../../../../env');
const { refreshMetaData } = require("../../../../kafka");

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
