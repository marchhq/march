// linear-worker.js
import { linearQueue } from '../loaders/bullmq.loader.js';
import { fetchAssignedIssues, saveIssuesToDatabase } from '../services/integration/linear.service.js';

linearQueue.process(async (job) => {
    const { accessToken, linearUserId, userId } = job.data;

    try {
        const issues = await fetchAssignedIssues(accessToken, linearUserId);
        await saveIssuesToDatabase(issues, userId);
        console.log('Issues processed and saved to database.');
    } catch (error) {
        console.error('Error processing issues:', error);
        throw error;
    }
});

// To start the worker
linearQueue.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

linearQueue.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export {
    linearQueue
}
