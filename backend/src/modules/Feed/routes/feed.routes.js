import express from 'express';
import FeedController from '../controllers/feed.controllers.js';
import { authenticate } from '../../../middleware/authenticate.middleware.js';

const router = express.Router();
const feedController = new FeedController();

// Import properties from external URL
router.get('/import-properties', 
    authenticate,
    feedController.importProperties.bind(feedController));

export default router;

