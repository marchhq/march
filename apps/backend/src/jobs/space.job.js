import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";

const processSpaceJob = async (job) => {
    try {
        
    } catch (error) {
        console.error('Error processing issues:', error);
        throw error;
    }
};

const spaceWorker = new Worker('calendarQueue', async (job) => {
    await processSpaceJob(job);
}, {
    connection: redisConnection
});

// To start the worker
spaceWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

spaceWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export {
    spaceWorker
}
