const cluster = require("cluster");
const os = require("os");

const submitConsumer = require("./submit-consumer");
const resultProducer = require("./result-producer");

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    resultProducer.init();

    const worker_count = os.cpus().length;
    for (let i = 0; i < worker_count; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

    errorTypes.map((type) => {
        process.on(type, (e) => {
            try {
                console.log(`process.on ${type}`);
                console.error(e);
                cluster.disconnect(() => {
                    console.log("disconnected on error");
                    process.exit(0);
                });
            } catch (_) {
                process.exit(1);
            }
        });
    });

    signalTraps.map((type) => {
        process.once(type, () => {
            return new Promise((resolve, reject) => {
                try {
                    cluster.disconnect(() => {
                        console.log("disconnected");
                        resolve();
                    });
                } catch (e) {
                    reject(new Error(type));
                }
            });
        });
    });
} else {
    console.log(`Worker ${process.pid} is running`);
    const consumer = submitConsumer.init().catch((e) =>
        console.error(`[judger-consumer] ${e.message}`, e)
    );

    errorTypes.map((type) => {
        process.on(type, async (e) => {
            try {
                console.log(`process.on ${type}`);
                console.error(e);
                await consumer.disconnect();
                process.exit(0);
            } catch (_) {
                process.exit(1);
            }
        });
    });

    signalTraps.map((type) => {
        process.once(type, async () => {
            try {
                await consumer.disconnect();
            } finally {
                process.kill(process.pid, type);
            }
        });
    });
}
