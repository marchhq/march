import { Queue } from 'bullmq';
import { redisConnection } from './redis.loader.js';

const linearQueue = new Queue('linearQueue', {
    connection: redisConnection
});

const notionQueue = new Queue('notionQueue', {
    connection: redisConnection
});

const cycleQueue = new Queue('cycleQueue', {
    connection: redisConnection
});

const initQueue = new Queue('initQueue', {
    connection: redisConnection
});

const XQueue = new Queue('XQueue', {
    connection: redisConnection
});

console.log('Queues setup completed.');

export {
    linearQueue,
    notionQueue,
    cycleQueue,
    initQueue,
    XQueue
};
