import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { createSpace } from "../services/lib/space.service.js";
import { createBlock } from "../services/lib/block.service.js";
import { createLabels } from '../services/lib/label.service.js';

const processSpaceJob = async (job) => {
    const { user } = job.data;
    const blocks = [
        { name: "Notes", data: { type: "note", item: [] } },
        { name: "Meetings", data: { type: "meeting", item: [] } },
        { name: "Reading List", data: { type: "reading", item: [] } }
    ];

    try {
        const blockIds = [];

        for (const blockData of blocks) {
            const block = await createBlock(user, blockData);
            blockIds.push(block._id);
        }

        const spaces = [
            { name: "Notes", icon: "note", blocks: [blockIds[0]] },
            { name: "Meetings", icon: "meeting", blocks: [blockIds[1]] },
            { name: "Reading List", icon: "book", blocks: [blockIds[2]] }
        ];

        let readingSpace;
        for (const spaceData of spaces) {
            const space = await createSpace(user, spaceData);

            if (space.name === "Reading List") {
                readingSpace = space;
            }
        }

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
