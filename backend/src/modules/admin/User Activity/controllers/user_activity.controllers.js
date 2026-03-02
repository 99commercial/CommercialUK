import { UserActivityService } from '../services/user_activity.services.js';
import { MESSAGES } from '../../../../config/constant.config.js';

export class UserActivityController {
  constructor() {
    this.userActivityService = new UserActivityService();
  }

  /**
   * Get user activity by userId with sessionId lookup
   */
  getUserActivityByUserId = async (req, res, next) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          status: false,
          message: 'User ID is required',
        });
      }

      const result = await this.userActivityService.getUserActivityByUserId(userId);

      res.status(200).json({
        status: true,
        message: MESSAGES.USER_ACTIVITY_FETCHED_SUCCESSFULLY || 'User activity fetched successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
