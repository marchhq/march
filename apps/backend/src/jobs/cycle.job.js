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
        console.log("startOfWeek: ", startOfWeek);
        console.log("endOfWeek: ", endOfWeek);

        const overdueItems = await Item.find({
            cycleDate: { $gte: startOfWeek, $lte: endOfWeek },
            isCompleted: false,
            isArchived: false,
            isDeleted: false
        });

        const startOfNextWeek = new Date(endOfWeek);
        startOfNextWeek.setDate(endOfWeek.getDate() + 5);
        startOfNextWeek.setHours(0, 0, 0, 0);
        console.log(": startOfNextWeek: ", startOfNextWeek);

        for (const item of overdueItems) {
            item.cycleDate = startOfNextWeek;
            await item.save();
        }

        console.log(`Processed ${overdueItems.length} overdue items.`);
    } catch (error) {
        console.error('Error processing job:', error);
    }
}, {
    connection: redisConnection
});

// Add the job to the queue
const addCycleJob = async () => {
    await cycleQueue.add('moveOverdueItems', {}, {
        jobId: 'moveOverdueItemsJob',
        repeat: {
            cron: '59 23 * * 6' // Runs every Saturday at 11:59 PM
        },
        removeOnComplete: true
    });
};

// Schedule the job
addCycleJob().then(() => {
    console.log('Cycle job scheduled successfully!');
}).catch(err => {
    console.error('Failed to schedule cycle job:', err);
});

export {
    cycleQueue,
    cycleWorker,
    addCycleJob
}
