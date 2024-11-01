import { cycleQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { Item } from '../models/lib/item.model.js';

const getCurrentWeekDateRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
};

const cycleWorker = new Worker('cycleQueue', async job => {
    console.log('Processing job to move overdue items to the next cycle...');

    try {
        const { startOfWeek, endOfWeek } = getCurrentWeekDateRange();
        console.log("Start of Week: ", startOfWeek);
        console.log("End of Week: ", endOfWeek);

        const overdueItems = await Item.find({
            cycleDate: { $gte: startOfWeek, $lte: endOfWeek },
            isCompleted: false,
            isArchived: false,
            isDeleted: false
        });

        if (overdueItems.length === 0) {
            console.log("No overdue items found for this week.");
            return;
        }

        const startOfNextWeek = new Date(endOfWeek);
        startOfNextWeek.setDate(endOfWeek.getDate() + 5);
        startOfNextWeek.setHours(0, 0, 0, 0);
        console.log("Start of Next Week: ", startOfNextWeek);

        await Item.updateMany(
            { _id: { $in: overdueItems.map(item => item._id) } },
            { $set: { cycleDate: startOfNextWeek } }
        );

        console.log(`Processed ${overdueItems.length} overdue items.`);
    } catch (error) {
        console.error('Error processing job:', error);
        throw error;
    }
}, {
    connection: redisConnection,
    concurrency: 5
});

const addCycleJob = async () => {
    await cycleQueue.add('moveOverdueItems', {}, {
        jobId: 'moveOverdueItemsJob',
        repeat: {
            cron: '59 23 * * 6' // Runs every Saturday at 11:59 PM
        },
        removeOnComplete: true,
        attempts: 3,
        backoff: 1000
    });
};

addCycleJob().then(() => {
    console.log('Cycle job scheduled successfully!');
}).catch(err => {
    console.error('Failed to schedule cycle job:', err);
});

export {
    cycleQueue,
    cycleWorker,
    addCycleJob
};
