import { createServer } from 'http';
import app from './app.js';
import { PORT } from './src/config/env.config.js';
import { startSubscriptionExpiryCheck } from './src/cron/subscription.cron.js';
import { startPropertyExpiryCheck } from './src/cron/property.cron.js';
import { connectRedis } from './src/config/redis.client.js';

// Create HTTP server
const server = createServer(app);

server.listen(PORT, async () => {
  await connectRedis();
  console.log(`Server running on port ${PORT}`);
  
  // Start cron jobs
  startSubscriptionExpiryCheck();
  startPropertyExpiryCheck();
});