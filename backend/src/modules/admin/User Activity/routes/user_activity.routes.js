import express from 'express';
import { UserActivityController } from '../controllers/user_activity.controllers.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';

const router = express.Router();
const userActivityController = new UserActivityController();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize(['admin']));

// GET /api/admin/user-activity/:userId - Get user activity by userId with sessionId lookup
router.get('/:userId', userActivityController.getUserActivityByUserId);

export default router;
