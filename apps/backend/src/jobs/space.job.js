import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { createSpace } from "../services/lib/space.service.js";
import { createBlock } from "../services/lib/block.service.js";
import { createLabels } from '../services/lib/label.service.js';

const processSpaceJob = async (job) => {
    const { user } = job.data;
    const spaces = [
        { name: "Meetings", icon: "meeting" },
        { name: "Notes", icon: "note" },
        { name: "Reading List", icon: "book" }
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
            { name: "Meetings", data: { type: "meeting" } },
            { name: "Notes", data: { type: "note" } },
            { name: "Reading List", data: { type: "reading" } }
        ];

        await createBlock(user, blocks[0], spaceIds[0]);
        await createBlock(user, blocks[1], spaceIds[1]);
        await createBlock(user, blocks[2], spaceIds[2]);

        if (readingSpace) {
            const labelsData = [
                { "name": "liked", "color": "rgba(227, 65, 54, 0.8)" },
                { "name": "archive", "color": "rgba(109, 112, 119, 1)" }
            ];

            await createLabels(labelsData, readingSpace._id, user);
        }
    } catch (error) {
        console.error('Error processing Spaces, Blocks, and Labels:', error);
        throw error;
    }
};

const spaceWorker = new Worker('spaceQueue', async (job) => {
    await processSpaceJob(job);
}, {
    connection: redisConnection
});

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
