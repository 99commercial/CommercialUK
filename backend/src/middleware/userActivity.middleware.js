import UserActivity from '../models/user_activity.model.js';
import crypto from 'crypto';

/**
 * Create user activity record by extracting all fields from request dependencies
 * @param {Object} req - Express request object (should have req.user after authentication)
 * @returns {Promise<Object>} Created user activity document
 */
export const createUserActivity = async (req,action,description) => {
  try {
    const userId = req?.user?._id;
    
    if (!userId) {
      throw new Error('User ID not found in request. Ensure authentication middleware is applied.');
    }

    // Express headers are automatically lowercased
    const sessionId = req.headers['x-session-id'] || req.headers['X-Session-Id'];
    
    if (!sessionId) {
      throw new Error('Session ID not found in request headers. Ensure X-Session-Id header is sent.');
    }

    // Set lastActiveAt to current time
    const lastActiveAt = new Date();

    // Create user activity record
    const userActivity = await UserActivity.create({
      userId,
      sessionId,
      action,
      description,
      lastActiveAt,
    });

    return userActivity;
  } catch (error) {
    throw error;
  }
};
