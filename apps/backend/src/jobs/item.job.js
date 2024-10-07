import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { linkPreviewGenerator } from "../services/lib/linkPreview.service.js";
import { Item } from "../models/lib/item.model.js";

const processitamJob = async (job) => {
    const { url, itemId } = job.data;
    const { title, favicon } = await linkPreviewGenerator(url);
    console.log("title: ", title);
    console.log("favicon: ", favicon);
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

const itemWorker = new Worker('itemQueue', async (job) => {
    await processitamJob(job);
}, {
    connection: redisConnection
});

itemWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

itemWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export {
    itemWorker
}
