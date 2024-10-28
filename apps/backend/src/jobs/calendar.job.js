import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { getGoogleCalendarupComingMeetings, saveUpcomingMeetingsToDatabase } from "../services/integration/calendar.service.js";

const processCalendarJob = async (job) => {
    const { accessToken, refreshToken, userId } = job.data;
    try {
        const meetings = await getGoogleCalendarupComingMeetings(accessToken, refreshToken);
        if (meetings) {
            const meetings = await getGoogleCalendarupComingMeetings(accessToken, refreshToken);

            await saveUpcomingMeetingsToDatabase(meetings, userId);
        }
    } catch (error) {
        console.error('Error processing issues:', error);
        throw error;
    }
};

const calendaWorker = new Worker('calendarQueue', async (job) => {
    console.log("Job received by worker:", job.data);
    console.log("im sajda's checking clg");
    await processCalendarJob(job);
}, {
    connection: redisConnection
});

// To start the worker
calendaWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();
});

calendaWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

export {
    calendaWorker
}
