import express from 'express';
import AICalController from '../controller/aical.controllers.js';
import { authenticate } from '../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../middleware/authorize.middleware.js';
import { createUserActivity } from '../../../middleware/userActivity.middleware.js';

const router = express.Router();
const aicalController = new AICalController();

/**
 * @route   POST /api/aical/commercial-properties
 * @desc    Create a new commercial property
 * @access  Public
 */
router.post(
  '/commercial-properties',
  authenticate,
  authorize(['admin']),
  aicalController.createCommercialProperty.bind(aicalController)
);

/**
 * @route   POST /api/aical/commercial-properties/bulk
 * @desc    Create multiple commercial properties from an array of objects
 * @access  Public
 */
router.post(
  '/commercial-properties/bulk',
  authenticate,
  authorize(['admin']),
  aicalController.createMultipleCommercialProperties.bind(aicalController)
);

/**
 * @route   GET /api/aical/commercial-properties
 * @desc    Get all commercial properties with pagination
 * @access  Public
 */
router.get(
  '/commercial-properties',
  authenticate,
  authorize(['admin']),
  aicalController.getAllCommercialProperties.bind(aicalController)
);

/**
 * @route   GET /api/aical/commercial-properties/:id
 * @desc    Get a specific commercial property by ID
 * @access  Public
 */
router.get(
  '/commercial-properties/:id',
  authenticate,
  authorize(['admin']),
  aicalController.getCommercialPropertyById.bind(aicalController)
);

/**
 * @route   PUT /api/aical/commercial-properties/:id
 * @desc    Update a commercial property by ID
 * @access  Public
 */
router.put(
  '/commercial-properties/:id',
  authenticate,
  authorize(['admin']),
  aicalController.updateCommercialProperty.bind(aicalController)
);

/**
 * @route   DELETE /api/aical/commercial-properties/:id
 * @desc    Delete a commercial property by ID
 * @access  Public
 */
router.delete(
  '/commercial-properties/:id',
  authenticate,
  authorize(['admin']),
  aicalController.deleteCommercialProperty.bind(aicalController)
);

/**
 * @route   POST /api/aical/commercial-properties/delete-bulk
 * @desc    Delete multiple commercial properties from an array of objects containing _id
 * @access  Public
 */
router.post(
  '/commercial-properties/delete-bulk',
  authenticate,
  authorize(['admin']),
  aicalController.deleteMultipleCommercialProperties.bind(aicalController)
);

/**
 * @route   GET /api/aical/commercial-places
 * @desc    Get commercial places by postcode
 * @access  Public
 */
router.get(
  '/commercial-places',
  authenticate,
  authorize(['user','agent','admin']),
  aicalController.getCommercialPlaces.bind(aicalController)
);

/**
 * @route   GET /api/aical/generate-report
 * @desc    Get EPC data by address
 * @access  Public
 */
router.post(
  '/generate-report',
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'generating property evaluation report', 'user generated a property evaluation report');
      next();
    } catch (error) {
      next(error);
    }
  },
  authorize(['user','agent','admin']),
  aicalController.generateReport.bind(aicalController)
);

/**
 * @route   GET /api/aical/reports/user/:userId
 * @desc    Get all reports by userId
 * @access  Public
 */
router.get(
  '/reports/user/:userId',
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'getting reports by user ID', 'user got his / her reports by user ID');
      next();
    } catch (error) {
      next(error);
    }
  },
  authorize(['user','agent','admin']),
  aicalController.getReportsByUserId.bind(aicalController)
);

/**
 * @route   GET /api/aical/reports/:id
 * @desc    Get a single report by _id
 * @access  Public
 */
router.get(
  '/reports/:id',
  aicalController.getReportById.bind(aicalController)
);

/**
 * @route   GET /api/aical/business-rates
 * @desc    Get HMRC Business Rates data (proxied through backend to avoid CORS)
 * @access  Public
 */
router.get(
  '/business-rates',
  aicalController.getBusinessRates.bind(aicalController)
);

/**
 * @route   POST /api/aical/chat
 * @desc    Lightweight AI chat endpoint for the Live page chatbot
 * @access  Public
 */
router.post(
  '/chat',
  aicalController.chatAssistant.bind(aicalController)
);

export default router;
