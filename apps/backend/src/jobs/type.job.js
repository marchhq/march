import { Worker } from "bullmq";
import { typeQueue } from "../loaders/bullmq.loader.js";
import { redisConnection } from "../loaders/redis.loader.js";
import { createType } from "../services/lib/type.service.js";

const processTypeJob = async (job) => {
    const { user } = job.data;

    const types = [
        "todo",
        "note",
        "bookmark",
        "meeting"
    ];

    try {
        for (const type of types) {
            await createType(user, type);
        }

        console.log("Job completed successfully for user:", user);
    } catch (error) {
        console.error('Error processing Spaces, Blocks, and Labels:', error);
        throw error;
    }
};

const typeWorker = new Worker('typeQueue', async (job) => {
    await processTypeJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

// Worker Event Listeners
typeWorker.on('completed', async (job) => {
    console.log(`Job with ID ${job.id} has been completed`);
    await job.remove();
});

typeWorker.on('failed', (job, err) => {
    console.error(`Job with ID ${job.id} has failed with error: ${err.message}`);
    if (job.attemptsMade < job.opts.attempts) {
        console.log(`Retrying job ${job.id} (${job.attemptsMade}/${job.opts.attempts})`);
    } else {
        console.log(`Job ${job.id} failed permanently after ${job.opts.attempts} attempts`);
    }
});

typeWorker.on('error', (err) => {
    console.error('Redis connection error in worker:', err);
});

export {
    typeWorker,
    typeQueue
};
