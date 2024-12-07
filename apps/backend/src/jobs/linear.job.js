import { linearQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { fetchAssignedIssues, saveIssuesToDatabase } from '../services/integration/linear.service.js';

/**
 * Processes a job from the Linear queue to fetch and save assigned issues.
 *
 * @param {Object} job - The job object containing data for processing.
 * @returns {Promise<void>}
 * @throws Will throw an error if processing the job fails.
 */
const processLinearJob = async (job) => {
    const { accessToken, linearUserId, userId } = job.data;
    try {
        const issues = await fetchAssignedIssues(accessToken, linearUserId);
        await saveIssuesToDatabase(issues, userId);
    } catch (error) {
        console.error('Error processing Linear job:', error);
        throw error;
    }
};

/**
 * Worker setup and event handling
 */
const linearWorker = new Worker('linearQueue', async (job) => {
    await processLinearJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

/**
 * Event listener for job completion.
 * Logs the completion and removes the job from the queue.
 *
 * @param {Object} job - The completed job object.
 */
linearWorker.on('completed', async (job) => {
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
linearWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} failed with error: ${err.message}`);
});

/**
 * Event listener for worker errors.
 * Logs Redis connection errors.
 *
 * @param {Error} err - The error object.
 */
linearWorker.on('error', (err) => {
    console.error('Redis connection error in linearWorker:', err);
});

export {
    linearQueue,
    linearWorker
};
