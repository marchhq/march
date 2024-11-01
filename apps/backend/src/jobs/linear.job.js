import { linearQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { fetchAssignedIssues, saveIssuesToDatabase } from '../services/integration/linear.service.js';

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

const linearWorker = new Worker('linearQueue', async (job) => {
    await processLinearJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

// Handle job completion and removal
linearWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

linearWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} failed with error: ${err.message}`);
});

linearWorker.on('error', (err) => {
    console.error('Redis connection error in linearWorker:', err);
});

export {
    linearQueue,
    linearWorker
};
