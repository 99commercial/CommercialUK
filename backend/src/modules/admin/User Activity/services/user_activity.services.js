import UserActivity from '../../../../models/user_activity.model.js';
import Session from '../../../../models/session.model.js';
import User from '../../../../models/user.model.js';

export class UserActivityService {
  /**
   * Get user activity by userId with sessionId lookup
   */
  async getUserActivityByUserId(userId) {
    try {
      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      // Get user activities
      const activities = await UserActivity.find({ userId })
        .populate({
          path: 'userId',
          select: 'firstName lastName email role',
        })
        .sort({ lastActiveAt: -1 })
        .lean();

      // Get all unique sessionIds from activities
      const sessionIds = [...new Set(activities.map(activity => activity.sessionId))];

      // Fetch all sessions at once for better performance
      const sessions = await Session.find({
        sessionId: { $in: sessionIds },
        userId: userId,
      }).lean();

      // Create a map of sessionId to session for quick lookup
      const sessionMap = new Map();
      sessions.forEach(session => {
        sessionMap.set(session.sessionId, session);
      });

      // Group activities by sessionId
      const activitiesBySession = new Map();
      
      activities.forEach((activity) => {
        const sessionId = activity.sessionId;
        
        if (!activitiesBySession.has(sessionId)) {
          activitiesBySession.set(sessionId, []);
        }
        
        activitiesBySession.get(sessionId).push({
          _id: activity._id,
          userId: activity.userId,
          sessionId: activity.sessionId,
          action: activity.action,
          description: activity.description,
          lastActiveAt: activity.lastActiveAt,
        });
      });

      // Sort activities within each session by lastActiveAt descending (latest first)
      activitiesBySession.forEach((sessionActivities) => {
        sessionActivities.sort((a, b) => {
          return new Date(b.lastActiveAt) - new Date(a.lastActiveAt);
        });
      });

      // Create sessions array with grouped activities
      const sessionsWithActivities = Array.from(activitiesBySession.entries()).map(([sessionId, sessionActivities]) => {
        const session = sessionMap.get(sessionId) || null;
        
        // Find the latest activity timestamp for this session to sort sessions
        const latestActivityTime = sessionActivities.length > 0 
          ? new Date(sessionActivities[0].lastActiveAt)
          : new Date(0);

        return {
          sessionId: sessionId,
          ipAddress: session?.ipAddress || null,
          loginTime: session?.loginTime || null,
          logoutTime: session?.logoutTime || null,
          timeSpent: session?.timeSpent || null,
          latestActivityAt: latestActivityTime,
          activities: sessionActivities,
          totalActivitiesInSession: sessionActivities.length,
        };
      });

      // Sort sessions by latest activity timestamp descending (sessions with latest activities first)
      sessionsWithActivities.sort((a, b) => {
        return b.latestActivityAt - a.latestActivityAt;
      });

      return {
        userId: user._id,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        sessions: sessionsWithActivities,
        totalActivities: activities.length,
        totalSessions: sessionsWithActivities.length,
      };
    } catch (error) {
      throw error;
    }
  }
}
