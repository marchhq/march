import { Queue } from 'bullmq';
import { redisConnection } from './redis.loader.js';

const linearQueue = new Queue('linearQueue', {
    connection: redisConnection
});

const calendarQueue = new Queue('calendarQueue', {
    connection: redisConnection
});

const notionQueue = new Queue('notionQueue', {
    connection: redisConnection
});

console.log('Queues setup completed.');

export {
    linearQueue,
    calendarQueue,
    notionQueue
};
