import { Worker } from "bullmq";
import { initQueue } from "../loaders/bullmq.loader.js";
import { redisConnection } from "../loaders/redis.loader.js";
import { createArray } from "../services/lib/array.service.js";
import { Type as TypeModel } from "../models/lib/type.model.js";

const processInitJob = async (job) => {
    const { user } = job.data;
    const arrayData = { name: "Home", icon: "home", identifier: "home" };

    const types = [
        { "slug": "todo", user },
        { "slug": "note", user },
        { "slug": "bookmark", user },
        { "slug": "meeting", user }
    ];
    // create everything at once
    try {
        await createArray(user, arrayData);
        await TypeModel.insertMany(types);

        console.log("Job completed successfully for user:", user);
    } catch (error) {
        console.error('Error processing Spaces, Blocks, and Labels:', error);
        throw error;
    }
};

const initWorker = new Worker('initQueue', async (job) => {
    await processInitJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

// Worker Event Listeners
initWorker.on('completed', async (job) => {
    console.log(`Job with ID ${job.id} has been completed`);
    await job.remove();
});

initWorker.on('failed', (job, err) => {
    console.error(`Job with ID ${job.id} has failed with error: ${err.message}`);
    if (job.attemptsMade < job.opts.attempts) {
        console.log(`Retrying job ${job.id} (${job.attemptsMade}/${job.opts.attempts})`);
    } else {
        console.log(`Job ${job.id} failed permanently after ${job.opts.attempts} attempts`);
    }
});

initWorker.on('error', (err) => {
    console.error('Redis connection error in worker:', err);
});

export {
    initWorker,
    initQueue
};
