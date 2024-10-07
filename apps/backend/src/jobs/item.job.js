import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";

const processitamJob = async (job) => {

}

const iteamWorker = new Worker('iteamQueue', async (job) => {
    await processitamJob(job);
}, {
    connection: redisConnection
});

iteamWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

iteamWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export {
    iteamWorker
}
