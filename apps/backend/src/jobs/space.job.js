import { Worker } from "bullmq";
import { spaceQueue } from "../loaders/bullmq.loader.js";
import { redisConnection } from "../loaders/redis.loader.js";
import { createSpace } from "../services/lib/space.service.js";
import { createBlock } from "../services/lib/block.service.js";
import { createLabels } from '../services/lib/label.service.js';

const processSpaceJob = async (job) => {
    const { user } = job.data;

    const spaces = [
        { name: "Notes", icon: "note", identifier: "NOTES" },
        { name: "Meetings", icon: "meeting", identifier: "MEETINGS" },
        { name: "Reading List", icon: "book", identifier: "READING" }
    ];

    try {
        const spaceIds = [];
        let readingSpace;

        for (const spaceData of spaces) {
            const space = await createSpace(user, spaceData);
            spaceIds.push(space._id);
            if (space.name === "Reading List") {
                readingSpace = space;
            }
        }

        const blocks = [
            { name: "Notes", data: { type: "note" } },
            { name: "Meetings", data: { type: "meeting" } },
            { name: "Reading List", data: { type: "reading" } }
        ];

        await createBlock(user, blocks[0], spaceIds[0]);
        await createBlock(user, blocks[1], spaceIds[1]);
        await createBlock(user, blocks[2], spaceIds[2]);

        if (readingSpace) {
            const labelsData = [
                { name: "liked", color: "rgba(227, 65, 54, 0.8)" },
                { name: "archive", color: "rgba(109, 112, 119, 1)" }
            ];
            await createLabels(labelsData, readingSpace._id, user);
        }

        console.log("Job completed successfully for user:", user);
    } catch (error) {
        console.error('Error processing Spaces, Blocks, and Labels:', error);
        throw error;
    }
};

const spaceWorker = new Worker('spaceQueue', async (job) => {
    await processSpaceJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

// Worker Event Listeners
spaceWorker.on('completed', async (job) => {
    console.log(`Job with ID ${job.id} has been completed`);
    await job.remove();
});

spaceWorker.on('failed', (job, err) => {
    console.error(`Job with ID ${job.id} has failed with error: ${err.message}`);
    if (job.attemptsMade < job.opts.attempts) {
        console.log(`Retrying job ${job.id} (${job.attemptsMade}/${job.opts.attempts})`);
    } else {
        console.log(`Job ${job.id} failed permanently after ${job.opts.attempts} attempts`);
    }
});

spaceWorker.on('error', (err) => {
    console.error('Redis connection error in worker:', err);
});

export {
    spaceWorker,
    spaceQueue
};
