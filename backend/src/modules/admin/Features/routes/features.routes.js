import express from 'express';
import { FeaturesController } from '../controller/features.controllers.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';
import { validateRequest } from '../../../../middleware/error.middleware.js';
import { updateUserStatusValidation } from '../validators/userStatus.validator.js';

const router = express.Router();
const featuresController = new FeaturesController();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize(['admin']));

// ==================== USER MANAGEMENT ROUTES ====================

// GET /api/admin/users - Get list of all users with pagination and filters
router.get('/users', featuresController.getUsersList);

// GET /api/admin/users/:id - Get specific user by ID
router.get('/users/:id', featuresController.getUserById);

// DELETE /api/admin/users/:id - Soft delete user
router.delete('/users/:id', featuresController.deleteUser);

// PATCH /api/admin/users/:id/behavior-status - Update user behavior status
router.patch('/users/:id/behavior-status', updateUserStatusValidation, validateRequest, featuresController.updateUserStatus);

// GET /api/admin/users/:id/properties - Get all properties listed by a specific user
router.get('/users/:id/properties', featuresController.getUserProperties);

// GET /api/admin/users-list - Get list of users with role "user"
router.get('/users-list', featuresController.getUsersListByRole);

// GET /api/admin/agents-list - Get list of users with role "agent"
router.get('/agents-list', featuresController.getAgentsList);

// ==================== PROPERTY MANAGEMENT ROUTES ====================

// GET /api/admin/properties - Get list of all properties with pagination and filters
router.get('/properties', featuresController.getPropertiesList);

// GET /api/admin/properties/inactive-by-users - Get properties listed by users with role "user" and status "Inactive"
// MUST be before /properties/:id to avoid route conflict
router.get('/properties/inactive-by-users', featuresController.getInactivePropertiesByUsers);

// GET /api/admin/properties/:id - Get specific property by ID
router.get('/properties/:id', featuresController.getPropertyById);

// DELETE /api/admin/properties/:id - Soft delete property
router.delete('/properties/:id', featuresController.deleteProperty);

// PATCH /api/admin/properties/:id/activate - Activate property by changing status to "Active"
router.patch('/properties/:id/activate', featuresController.activateProperty);

// ==================== ADMIN DASHBOARD ROUTES ====================

// GET /api/admin/dashboard - Get admin dashboard overview
router.get('/dashboard', featuresController.getDashboardStats);

// ==================== STATIC PAGES ROUTES ====================

// GET /api/admin/static-pages/general-page - Get general page
router.get('/static-pages/general-page', featuresController.getGeneralPage);

// PATCH /api/admin/static-pages/general-page - Update general page
router.patch('/static-pages/general-page', featuresController.updateGeneralPage);

export default router;
