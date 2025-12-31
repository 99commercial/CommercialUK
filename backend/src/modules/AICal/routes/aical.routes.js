import express from 'express';
import AICalController from '../controller/aical.controllers.js';
import { authenticate } from '../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../middleware/authorize.middleware.js';

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
 * @route   GET /api/aical/generate-report
 * @desc    Get EPC data by address
 * @access  Public
 */
router.post(
  '/generate-report',
  authenticate,
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

export default router;
