import {createClient} from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URI,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};


export default redisClient;