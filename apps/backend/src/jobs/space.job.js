// import { Worker } from "bullmq";
// import { redisConnection } from "../loaders/redis.loader.js";
// import { createPage } from "../services/lib/page.service.js"

// const processSpaceJob = async (job) => {
//     const { user } = job.data;
//     const noteSpaceData = {
//         "name": "Notes",
//         "icon": "note"
//     }
//     const meetingSpaceData = {
//         "name": "Meetings",
//         "icon": "meeting"
//     }
//     const thisWeekSpaceData = {
//         "name": "This Week",
//         "icon": ""
//     }
//     const readingListSpaceData = {
//         "name": "Reading List",
//         "icon": "book"
//     }
//     try {
//         await createPage(user, thisWeekSpaceData)
//         await createPage(user, meetingSpaceData)
//         await createPage(user, noteSpaceData)
//         await createPage(user, readingListSpaceData)
//     } catch (error) {
//         console.error('Error processing issues:', error);
//         throw error;
//     }
// };

// const spaceWorker = new Worker('calendarQueue', async (job) => {
//     await processSpaceJob(job);
// }, {
//     connection: redisConnection
// });

// // To start the worker
// spaceWorker.on('completed', async (job) => {
//     console.log(`Job with id ${job.id} has been completed`);
//     await job.remove();
// });

// spaceWorker.on('failed', (job, err) => {
//     console.error(`Job with id ${job.id} has failed with error ${err.message}`);
// });

// export {
//     spaceWorker
// }


import { Worker } from "bullmq";
import { redisConnection } from "../loaders/redis.loader.js";
import { createPage } from "../services/lib/page.service.js"

// Function to process a single job of creating the pages
const processSpaceJob = async (job) => {
    const { user } = job.data;  // Extract user from job data

    // Define space data objects for each page to be created
    const spaces = [
        { name: "Notes", icon: "note" },
        { name: "Meetings", icon: "meeting" },
        { name: "This Week", icon: "" },
        { name: "Reading List", icon: "book" }
    ];

    // Try creating each page sequentially
    try {
        for (const spaceData of spaces) {
            await createPage(user, spaceData);  // Create each page
        }
    } catch (error) {
        console.error('Error processing pages:', error);
        throw error;
    }
};

// Worker to listen on the 'calendarQueue'
const spaceWorker = new Worker('calendarQueue', async (job) => {
    await processSpaceJob(job);  // Process the job when triggered
}, {
    connection: redisConnection  // Redis connection passed for BullMQ
});

// Event listeners for job completion and failure
spaceWorker.on('completed', async (job) => {
    console.log(`Job with id ${job.id} has been completed`);
    await job.remove();  // Optionally remove the job from the queue once done
});

spaceWorker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with error ${err.message}`);
});

// Export the worker
export {
    spaceWorker
}
