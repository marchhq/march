import { cycleQueue } from '../loaders/bullmq.loader.js';
import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { Object } from '../models/lib/object.model.js';

const getPreviousWeekDateRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfPreviousWeek = new Date(now);
    startOfPreviousWeek.setDate(now.getDate() - dayOfWeek - 7);
    startOfPreviousWeek.setHours(0, 0, 0, 0);
    const endOfPreviousWeek = new Date(startOfPreviousWeek);
    endOfPreviousWeek.setDate(startOfPreviousWeek.getDate() + 6);
    endOfPreviousWeek.setHours(23, 59, 59, 999);

    return { startOfPreviousWeek, endOfPreviousWeek };
};

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
        const { startOfPreviousWeek, endOfPreviousWeek } = getPreviousWeekDateRange();
        const { startOfWeek, endOfWeek } = getCurrentWeekDateRange();

        const overdueItems = await Object.find({
            "cycle.startsAt": { $gte: startOfPreviousWeek, $lte: endOfPreviousWeek },
            isCompleted: false,
            isArchived: false,
            isDeleted: false
        });

        if (overdueItems.length === 0) {
            console.log("No overdue items found for the previous week.");
            return;
        }

        await Object.updateMany(
            { _id: { $in: overdueItems.map(item => item._id) } },
            { $set: { "cycle.startsAt": startOfWeek, "cycle.endsAt": endOfWeek } }
        );

        console.log(`Processed ${overdueItems.length} overdue items and moved them to the current week's cycle.`);
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
            cron: '0 0 * * 0' // Runs every Sunday at 12:00 AM
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
