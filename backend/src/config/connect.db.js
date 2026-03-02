import mongoose from 'mongoose';
import { MONGO_URI } from './env.config.js';

const connectDB = async () => {
  try {

    await mongoose.connect(MONGO_URI, {
      // 🔥 MOST IMPORTANT for load stability
      maxPoolSize: 50,          // Max DB connections
      minPoolSize: 10,          // Keep warm connections (reduces cold latency)
      
      // ⏱ Prevent long hanging requests (fixes 5-10s spikes)
      serverSelectionTimeoutMS: 5000, // Fail fast if DB not reachable
      socketTimeoutMS: 45000,         // Close slow sockets
      connectTimeoutMS: 10000,        // Faster connection timeout
      
      // ♻️ Auto-recovery (reduces random failures)
      retryWrites: true,
      retryReads: true,

      // 🌍 Better performance on VPS / cloud
      family: 4, // Forces IPv4 (avoids DNS delays on VPS)

      // 🧠 Prevents memory leaks in high traffic
      maxIdleTimeMS: 30000,
    });

  } catch (err) {
    console.error('MongoDB connection error:', err.message);

    // Retry instead of killing server (reduces downtime errors)
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Reconnecting...');
});

mongoose.connection.on('reconnected', () => {
  // Intentionally quiet to reduce terminal noise.
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

export default connectDB;
