const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const topic = 'judger';
const consumerNumber = process.argv[2] || '1';

const logMessage = (counter, consumerName, topic, partition, message) => {
  console.log(`received a new message number: ${counter} on ${consumerName}: `, {
    topic,
    partition,
    message: {
      offset: message.offset,
      headers: message.headers,
      value: message.value.toString()
    },
  });
};

const processConsumer = async () => {
  const ordersConsumer = kafka.consumer({ groupId: 'orders' });
  const paymentsConsumer = kafka.consumer({ groupId: 'payments' });
  const notificationsConsumer = kafka.consumer({ groupId: 'notifications' });
  await Promise.all([
    ordersConsumer.connect(),
    paymentsConsumer.connect(),
    notificationsConsumer.connect()
  ]);

  await Promise.all([
    ordersConsumer.subscribe({ topic }),
    paymentsConsumer.subscribe({ topic }),
    notificationsConsumer.subscribe({ topic }),
  ]);

  let orderCounter = 1;
  let paymentCounter = 1;
  let notificationCounter = 1;

  await ordersConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(orderCounter, `ordersConsumer#${consumerNumber}`, topic, partition, message);
      orderCounter++;
    }
  });

  await paymentsConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(paymentCounter, `paymentsConsumer#${consumerNumber}`, topic, partition, message);
      paymentCounter++;
    }
  });

  await notificationsConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logMessage(notificationCounter, `notificationsConsumer#${consumerNumber}`, topic, partition, message);
      notificationCounter++;
    }
  });
};

processConsumer();
