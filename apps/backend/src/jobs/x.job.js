import { XQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { syncXBookmarks } from "../services/integration/x.service.js";

const processXJob = async (job) => {
    const { accessToken, userId } = job.data;
    console.log(`Processing x job with  ${accessToken}`);
    try {
        await syncXBookmarks(accessToken, userId)
    } catch (error) {
        console.error('Error processing X job:', error);
        throw error;
    }
};

/**
 * Worker setup and event handling
 */
const XWorker = new Worker('XQueue', async (job) => {
    console.log(`Processing job with id ${job.id}`);
    await processXJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

XWorker.on('active', (job) => {
    console.log(`Processing job: ${job.id}`);
});

/**
 * Event listener for job completion.
 * Logs the completion and removes the job from the queue.
 *
 * @param {Object} job - The completed job object.
 */
XWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

/**
 * Event listener for job failure.
 * Logs the error message.
 *
 * @param {Object} job - The failed job object.
 * @param {Error} err - The error that caused the job to fail.
 */
XWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} failed with error: ${err.message}`);
});

/**
 * Event listener for worker errors.
 * Logs Redis connection errors.
 *
 * @param {Error} err - The error object.
 */
XWorker.on('error', (err) => {
    console.error('Redis connection error in XWorker:', err);
});

export {
    XQueue,
    XWorker
};
