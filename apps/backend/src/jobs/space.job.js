import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { createSpace } from "../services/lib/space.service.js";
import { createBlock } from "../services/lib/block.service.js";

const processSpaceJob = async (job) => {
    const { user } = job.data;
    const blocks = [
        { name: "Notes", data: { type: "notes" } },
        { name: "Meetings", data: { type: "meetings" } },
        { name: "This Week", data: { type: "board", filter: { date: ["this-week"] } } },
        { name: "Reading List", icon: "reading" }
    ];

    try {
        for (const blockData of blocks) {
            await createBlock(user, blockData);
        }
    } catch (error) {
        console.error('Error processing Spaces:', error);
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
