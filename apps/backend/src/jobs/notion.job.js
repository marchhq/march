import { notionQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";

const processNotionJob = async (job) => {
    try {
        console.log("hey");
    } catch (error) {
        console.error('Error processing issues:', error);
        throw error;
    }
};

const notionWorker = new Worker('notionQueue', async (job) => {
    await processNotionJob(job);
}, {
    connection: redisConnection
});

// To start the worker
notionWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

notionWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export {
    notionQueue,
    notionWorker
}
