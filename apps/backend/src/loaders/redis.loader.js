import Redis from "ioredis";
import { environment } from "./environment.loader.js"

const redisConnection = new Redis(`redis://${environment.REDIS_DB_USER}:${environment.REDIS_DB_PASS}@${environment.REDIS_HOST}:${environment.REDIS_PORT}`, {
    maxRetriesPerRequest: null
});

redisConnection.on('connect', () => {
    console.log('Connected to Redis');
});

redisConnection.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// for test purpose need to remove later
redisConnection.on('reconnecting', (time) => {
    console.log('Reconnecting to Redis server. Next attempt in', time, 'ms.');
});

export { redisConnection }
