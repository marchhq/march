import { Queue } from 'bullmq';
import { redisConnection } from './redis.loader.js';

const linearQueue = new Queue('linearQueue', {
    connection: redisConnection
});

const notionQueue = new Queue('notionQueue', {
    connection: redisConnection
});

const arrayQueue = new Queue('arrayQueue', {
    connection: redisConnection
});

const cycleQueue = new Queue('cycleQueue', {
    connection: redisConnection
});

const typeQueue = new Queue('typeQueue', {
    connection: redisConnection
});

console.log('Queues setup completed.');

export {
    linearQueue,
    notionQueue,
    arrayQueue,
    cycleQueue,
    typeQueue
};
