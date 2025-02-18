import { linearQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { fetchAssignedIssues, saveIssuesToDatabase, createLinearIssue } from '../services/integration/linear.service.js';
import { updateInboxObject } from '../services/lib/object.service.js';

/**
 * Processes a job from the Linear queue to fetch and save assigned issues.
 *
 * @param {Object} job - The job object containing data for processing.
 * @returns {Promise<void>}
 * @throws Will throw an error if processing the job fails.
 */
// const processLinearJob = async (job) => {
//     const { accessToken, linearUserId, userId } = job.data;
//     try {
//         const issues = await fetchAssignedIssues(accessToken, linearUserId);
//         await saveIssuesToDatabase(issues, userId);
//     } catch (error) {
//         console.error('Error processing Linear job:', error);
//         throw error;
//     }
// };

const processLinearJob = async (job) => {
    const { type, accessToken, linearUserId, user, teamId, title, description, objectId } = job.data;
    console.log(`Processing Linear job with type ${job.data}`);
    try {
        if (type === "fetchIssues") {
            const issues = await fetchAssignedIssues(accessToken, linearUserId);
            await saveIssuesToDatabase(issues, user);
        } else if (type === "createIssue") {
            console.log(`Creating issue in Linear for object ${objectId}`);
            const linearIssue = await createLinearIssue(accessToken, teamId, title, description);

            if (!linearIssue || !linearIssue.id) {
                throw new Error("Failed to create issue in Linear.");
            }
            await updateInboxObject(objectId, user, {
                id: linearIssue.id,
                "metadata.url": linearIssue.url
            });

            console.log(`Updated issue ${objectId} with Linear ID: ${linearIssue.id}`);
        }
    } catch (error) {
        console.error('Error processing Linear job:', error);
        throw error;
    }
};

/**
 * Worker setup and event handling
 */
const linearWorker = new Worker('linearQueue', async (job) => {
    console.log(`Processing job with id ${job.id}`);
    await processLinearJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

linearWorker.on('active', (job) => {
    console.log(`Processing job: ${job.id}, Type: ${job.data.type}`);
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
