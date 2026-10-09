// redisClient.ts
import Redis from 'ioredis';

// Đảm bảo rằng bạn đã định nghĩa REDIS_URL trong file .env của bạn
const redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err: Error) => {
    console.error('Error connecting to Redis:', err);
});

export default redis;
