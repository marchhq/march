import { Worker } from "bullmq";
import { calendarQueue } from "../loaders/bullmq.loader.js";
import { redisConnection } from "../loaders/redis.loader.js";
import { getGoogleCalendarupComingMeetings, saveUpcomingMeetingsToDatabase } from "../services/integration/calendar.service.js";

const processCalendarJob = async (job) => {
    const { accessToken, refreshToken, userId } = job.data;
    try {
        console.log(`Processing Google Calendar job for user: ${userId}`);

        const meetings = await getGoogleCalendarupComingMeetings(accessToken, refreshToken);
        if (meetings) {
            await saveUpcomingMeetingsToDatabase(meetings, userId);
        }
    } catch (error) {
        console.error('Error processing Google Calendar job:', error);
        throw error;
    }
};

const calendarWorker = new Worker('calendarQueue', async (job) => {
    await processCalendarJob(job);
}, {
    connection: redisConnection,
    concurrency: 5
});

// Handle job completion and removal
calendarWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

// Handle job failures and retries
calendarWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} failed with error: ${err.message}`);
});

// Handle Redis connection errors
calendarWorker.on('error', (err) => {
    console.error('Redis connection error in calendarWorker:', err);
});

export {
    calendarWorker,
    calendarQueue
};
