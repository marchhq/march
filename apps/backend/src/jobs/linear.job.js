import { linearQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { fetchAssignedIssues, saveIssuesToDatabase } from '../services/integration/linear.service.js';

const processLinearJob = async (job) => {
    console.log("i am starting");
    const { accessToken, linearUserId, userId } = job.data;
    console.log("accessToken: ", accessToken);
    console.log("linearUserId: ", linearUserId);
    console.log("userId: ", userId);
    try {
        const issues = await fetchAssignedIssues(accessToken, linearUserId);
        await saveIssuesToDatabase(issues, userId);
        console.log('Issues processed and saved to database.');
    } catch (error) {
        console.error('Error processing issues:', error);
        throw error;
    }
};

const linearWorker = new Worker('linearQueue', async (job) => {
    console.log("Worker processing job...");
    await processLinearJob(job);
}, {
    connection: redisConnection
});

// To start the worker
linearWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

linearWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export {
    linearQueue,
    linearWorker
}
