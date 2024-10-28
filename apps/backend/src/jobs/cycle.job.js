// const { Queue, Worker } = require('bullmq');
// const redisConnection = { host: 'localhost', port: 6379 }; // Adjust your Redis connection config
// const Item = require('./models/Item'); // Assuming this is your model

// // Create the BullMQ queue for managing cycles
// const cycleQueue = new Queue('cycleQueue', {
//     connection: redisConnection
// });

// // Helper function to get start and end of the current week (Sunday to Saturday)
// const getCurrentWeekDateRange = () => {
//     const now = new Date();
//     const dayOfWeek = now.getDay(); // 0 is Sunday

//     // Get start of the week (Sunday)
//     const startOfWeek = new Date(now);
//     startOfWeek.setDate(now.getDate() - dayOfWeek); // Adjust to Sunday
//     startOfWeek.setHours(0, 0, 0, 0); // Set to start of the day

//     // Get end of the week (Saturday)
//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Saturday
//     endOfWeek.setHours(23, 59, 59, 999); // Set to end of the day

//     return { startOfWeek, endOfWeek };
// };

// // Create the job processor (Worker) that will move overdue items to the next cycle
// const cycleWorker = new Worker('cycleQueue', async job => {
//     console.log('Processing job to move overdue items to the next cycle...');

//     try {
//         // Get the current week date range (from Sunday to Saturday)
//         const { startOfWeek, endOfWeek } = getCurrentWeekDateRange();

//         // Find items with cycleDate between start and end of current week, and status not 'done'
//         const overdueItems = await Item.find({
//             cycleDate: { $gte: startOfWeek, $lte: endOfWeek }, // Current week range
//             status: { $nin: ['done'] }, // Status not 'done'
//             isArchived: false,
//             isDeleted: false
//         });

//         // Get the start of next week (Sunday)
//         const startOfNextWeek = new Date(endOfWeek);
//         startOfNextWeek.setDate(endOfWeek.getDate() + 1); // Move to next Sunday
//         startOfNextWeek.setHours(0, 0, 0, 0); // Set to start of the day

//         // Loop through items and update cycleDate for the overdue ones
//         for (let item of overdueItems) {
//             item.cycleDate = startOfNextWeek; // Update cycleDate to next week's Sunday
//             await item.save(); // Save the updated item
//         }

//         console.log(`Processed ${overdueItems.length} overdue items.`);
//     } catch (error) {
//         console.error('Error processing job:', error);
//     }
// }, {
//     connection: redisConnection
// });

// // Add the job to the queue
// const addCycleJob = async () => {
//     await cycleQueue.add('moveOverdueItems', {}, {
//         repeat: {
//             cron: '59 23 * * 6' // Runs every Saturday at 11:59 PM
//         }
//     });
// };

// // Schedule the job
// addCycleJob().then(() => {
//     console.log('Cycle job scheduled successfully!');
// }).catch(err => {
//     console.error('Failed to schedule cycle job:', err);
// });
