import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { linkPreviewGenerator } from "../services/lib/linkPreview.service.js";
import { Item } from "../models/lib/item.model.js";

const processitamJob = async (job) => {
    const { url, itemId } = job;
    const { title, favicon } = await linkPreviewGenerator(url);
    const updateData = {
        title: title,
        metadata: {
            url: url,
            favicon: favicon
        }

    }
    await Item.findOneAndUpdate({
        _id: itemId
    },
    { $set: updateData },
    { new: true }
    )
}

const iteamWorker = new Worker('iteamQueue', async (job) => {
    await processitamJob(job);
}, {
    connection: redisConnection
});

iteamWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

iteamWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export {
    iteamWorker
}
