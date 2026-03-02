import express from 'express';
import AgentController from '../controller/account.controller.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';
import { createUserActivity } from '../../../../middleware/userActivity.middleware.js';
import upload from '../../../../config/cloudinary.config.js';

const router = express.Router();
const agentController = new AgentController();


// ========== USER ACCOUNT MANAGEMENT ROUTES ==========

// Get user details (user ID from headers)
router.get('/users/profile', 
    authenticate,
    authorize(['agent']),
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'checking profile', 'user check his / her profile');
        next();
      } catch (error) {
        next(error);
      }
    },
    agentController.getUserDetails.bind(agentController)
  );
  
  // Update user details (user ID from headers)
  router.put('/users/profile', 
    authenticate,
    authorize(['agent']),
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'updating profile', 'user update his / her profile');
        next();
      } catch (error) {
        next(error);
      }
    },
    agentController.updateUserDetails.bind(agentController)
  );
  
  // Update user profile photo (user ID from headers)
  router.put('/users/profile/photo', 
    authenticate,
    authorize(['agent']),
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'updating profile photo', 'user update his / her profile photo');
        next();
      } catch (error) {
        next(error);
      }
    },
    upload.single('profile_photo'),
    agentController.updateUserProfilePhoto.bind(agentController)
  );
  
  // Create business details for user (user ID from headers)
  router.post('/users/business-details', 
    authenticate,
    authorize(['agent']),
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'creating business details', 'user create his / her business details');
        next();
      } catch (error) {
        next(error);
      }
    },
    agentController.createBusinessDetails.bind(agentController)
  );
  
  // Update business details by business details ID
  router.put('/business-details/:businessDetailsId', 
    authenticate,
    authorize(['agent']),
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'updating business details', 'user update his / her business details');
        next();
      } catch (error) {
        next(error);
      }
    },
    agentController.updateBusinessDetailsById.bind(agentController)
  );
  
  // ========== FAVORITES MANAGEMENT ROUTES ==========
  
  // Add property to favorites
  router.post('/favorites/:propertyId', 
    authenticate,
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'adding property to favorites', 'user add a property to his / her favorites');
        next();
      } catch (error) {
        next(error);
      }
    },
    agentController.addToFavorites.bind(agentController)
  );
  
  // Remove property from favorites
  router.delete('/favorites/:propertyId', 
    authenticate,
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'removing property from favorites', 'user remove a property from his / her favorites');
        next();
      } catch (error) {
        next(error);
      }
    },
    agentController.removeFromFavorites.bind(agentController)
  );
  
  // Get user's favorite properties
  router.get('/favorites', 
    authenticate,
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'checked my favorite properties', 'user checked his / her favorite properties');
        next();
      } catch (error) {
        next(error);
      }
    },
    agentController.getMyFavorites.bind(agentController)
  );

  // Get user's favorite properties details
  router.get('/favorites/details', 
    authenticate,
    async (req, res, next) => {
      try {
        await createUserActivity(req, 'checked my favorite property in details', 'user checked his / her favorite properties in details');
        next();
      } catch (error) {
        next(error);
      }
    },
    agentController.getMyFavoritesDetails.bind(agentController)
  );

  export default router;