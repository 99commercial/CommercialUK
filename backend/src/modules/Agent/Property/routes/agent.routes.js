import express from 'express';
import AgentController from '../controller/agent.controller.js';
import { authenticate } from '../../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../../middleware/authorize.middleware.js';
import uploadImages, { uploadDocuments } from '../../../../config/cloudinary.config.js';
import { 
  createPropertyValidator,
  updatePropertyDetailsValidator,
  updateBusinessDetailsValidator,
  // updatePropertyImagesValidator,
  // updatePropertyDocumentsValidator,
  updatePropertyLocationValidator,
  updatePropertyVirtualToursValidator,
  updatePropertyFeaturesValidator,
  // updatePropertyGeneralDetailsValidator,
  // updatePropertyEPCValidator,
  // updatePropertyCouncilTaxValidator,
  // updatePropertyRateableValueValidator,
  // updatePropertyPlanningValidator,
  // updatePropertyStatusValidator,
  // updatePropertySEOValidator,
  // updateBusinessRatesByIdValidator,
  // updateDescriptionsByIdValidator,
  // updateSaleTypesByIdValidator,
  // updatePropertyImagesByIdValidator,
  // updatePropertyDocumentsByIdValidator,
  // updatePropertyLocationByIdValidator,
  // updatePropertyVirtualToursByIdValidator,
  // updatePropertyFeaturesByIdValidator,
  createPropertyQueryValidator,
  updateQueryStatusValidator,
  getQueriesByAgentIdValidator,
  getQueriesByPropertyIdValidator,
  getQueriesByUserIdValidator,
  getQueryByIdValidator,
  deleteQueryValidator
} from '../validation/agent.validation.js';
import { validateRequest } from '../../../../middleware/error.middleware.js';
import { createUserActivity } from '../../../../middleware/userActivity.middleware.js';

const router = express.Router();
const agentController = new AgentController();

// Property CRUD routes (Agent only)
router.post('/properties', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating property', 'user create a property');
      next();
    } catch (error) {
      next(error);
    }
  },
  createPropertyValidator,
  validateRequest,
  agentController.createProperty.bind(agentController)
);

// Create business details (business_rates, descriptions, sale_types)
router.put('/properties/:propertyId/business-details', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating property business details', 'user created his / her property\'s business details');
      next();
    } catch (error) {
      next(error);
    }
  },
  updateBusinessDetailsValidator,
  validateRequest,
  agentController.updateBusinessDetails.bind(agentController)
);

// Create property details (epc, council_tax, rateable_value, planning)
router.put('/properties/:propertyId/property-details', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating property details', 'user created his / her property\'s details');
      next();
    } catch (error) {
      next(error);
    }
  },
  updatePropertyDetailsValidator,
  validateRequest,
  agentController.updatePropertyDetails.bind(agentController)
);

// Create property images
router.put('/properties/:propertyId/images', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating property images', 'user created his / her property\'s images');
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadImages.array('files', 10),
  agentController.updatePropertyImages.bind(agentController)
);

// Create property documents
router.put('/properties/:propertyId/documents', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating property documents', 'user created his / her property\'s documents');
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadDocuments.array('files', 5),
  agentController.updatePropertyDocuments.bind(agentController)
);

// Create property location
router.put('/properties/:propertyId/location', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating property location', 'user created his / her property\'s location');
      next();
    } catch (error) {
      next(error);
    }
  },
  updatePropertyLocationValidator,
  validateRequest,
  agentController.updatePropertyLocation.bind(agentController)
);

// Create property virtual tours
router.put('/properties/:propertyId/virtual-tours', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating property virtual tours', 'user created his / her property\'s virtual tours');
      next();
    } catch (error) {
      next(error);
    }
  },
  updatePropertyVirtualToursValidator,
  validateRequest,
  agentController.updatePropertyVirtualTours.bind(agentController)
);

// Create property features
router.put('/properties/:propertyId/features', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating property features', 'user created his / her property\'s features');
      next();
    } catch (error) {
      next(error);
    }
  },
  updatePropertyFeaturesValidator,
  validateRequest,
  agentController.updatePropertyFeatures.bind(agentController)
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get all properties (public access)
router.get('/properties/all', 

  agentController.getAllProperties.bind(agentController)
);

// Get properties by agent ID
router.get('/agents/:agentId/properties', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'getting properties by agent ID', 'user got his / her properties by agent ID');
      next();
    } catch (error) {
      next(error);
    }
  },
  authorize(['agent']),
  agentController.getPropertiesByAgentId.bind(agentController)
);

// Get property by ID (public access)
router.get('/properties/:propertyId', 
  agentController.getPropertyById.bind(agentController)
);

// Delete property (agent only)
router.delete('/properties/:propertyId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'deleting property', 'user deleted his / her property');
      next();
    } catch (error) {
      next(error);
    }
  },
  authorize(['agent']),
  agentController.deleteProperty.bind(agentController)
);

// ========== PROPERTY SECTION UPDATE ROUTES ==========

// Update property general details
router.patch('/properties/:propertyId/general-details', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property general details', 'user updated his / her property\'s general details');
      next();
    } catch (error) {
      next(error);
    }
  },
  agentController.updatePropertyGeneralDetails.bind(agentController)
);

// Update property EPC details
// router.patch('/properties/:propertyId/epc', 
//   authenticate,
//   updatePropertyEPCValidator,
//   validateRequest,
//   agentController.updatePropertyEPC.bind(agentController)
// );

// // Update property council tax details
// router.patch('/properties/:propertyId/council-tax', 
//   authenticate,
//   updatePropertyCouncilTaxValidator,
//   validateRequest,
//   agentController.updatePropertyCouncilTax.bind(agentController)
// );

// // Update property rateable value
// router.patch('/properties/:propertyId/rateable-value', 
//   authenticate,
//   updatePropertyRateableValueValidator,
//   validateRequest,
//   agentController.updatePropertyRateableValue.bind(agentController)
// );

// // Update property planning details
// router.patch('/properties/:propertyId/planning', 
//   authenticate,
//   updatePropertyPlanningValidator,
//   validateRequest,
//   agentController.updatePropertyPlanning.bind(agentController)
// );

// // Update property status
// router.patch('/properties/:propertyId/status', 
//   authenticate,
//   updatePropertyStatusValidator,
//   validateRequest,
//   agentController.updatePropertyStatus.bind(agentController)
// );

// // Update property SEO fields
// router.patch('/properties/:propertyId/seo', 
//   authenticate,
//   updatePropertySEOValidator,
//   validateRequest,
//   agentController.updatePropertySEO.bind(agentController)
// );

// ========== REFERENCE ID UPDATE ROUTES ==========

// Update business rates by reference ID
router.patch('/business-rates/:businessRatesId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property business rates', 'user updated his / her property\'s business rates');
      next();
    } catch (error) {
      next(error);
    }
  },
  agentController.updateBusinessRatesById.bind(agentController)
);

// Update descriptions by reference ID
router.patch('/descriptions/:descriptionsId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property descriptions', 'user updated his / her property\'s descriptions');
      next();
    } catch (error) {
      next(error);
    }
  },
  agentController.updateDescriptionsById.bind(agentController)
);

// Update sale types by reference ID
router.patch('/sale-types/:saleTypesId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property sale types', 'user updated his / her property\'s sale types');
      next();
    } catch (error) {
      next(error);
    }
  },
  agentController.updateSaleTypesById.bind(agentController)
);

// // Update property images by reference ID
// router.patch('/property-images/:imagesId', 
//   authenticate,
//   agentController.updatePropertyImagesById.bind(agentController)
// );

// // Update property documents by reference ID
// router.patch('/property-documents/:documentsId', 
//   authenticate,
//   agentController.updatePropertyDocumentsById.bind(agentController)
// );

// Update property location by reference ID
router.patch('/property-location/:locationId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property location', 'user updated his / her property\'s location');
      next();
    } catch (error) {
      next(error);
    }
  },
  agentController.updatePropertyLocationById.bind(agentController)
);

// Update property virtual tours by reference ID
router.patch('/property-virtual-tours/:virtualToursId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property virtual tours', 'user updated his / her property\'s virtual tours');
      next();
    } catch (error) {
      next(error);
    }
  },
  agentController.updatePropertyVirtualToursById.bind(agentController)
);

// Update property features by reference ID
router.patch('/property-features/:featuresId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property features', 'user updated his / her property\'s features');
      next();
    } catch (error) {
      next(error);
    }
  },
  agentController.updatePropertyFeaturesById.bind(agentController)
);

// Update property images with mixed data (existing + new images)
router.put('/properties/:propertyId/images/mixed', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property images with mixed data', 'user updated his / her property\'s images with mixed data');
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadImages.array('files', 10),
  agentController.updatePropertyImagesMixed.bind(agentController)
);

// Update property documents with mixed data (existing + new documents)
router.put('/properties/:propertyId/documents/mixed', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating property documents with mixed data', 'user updated his / her property\'s documents with mixed data');
      next();
    } catch (error) {
      next(error);
    }
  },
  uploadDocuments.array('files', 5),
  agentController.updatePropertyDocumentsMixed.bind(agentController)
);

// ========== PROPERTY QUERY ROUTES ==========

// Create property query (no login required - guests can submit enquiries)
router.post('/properties/:propertyId/queries', 
  createPropertyQueryValidator,
  validateRequest,
  agentController.createPropertyQuery.bind(agentController)
);

// Get queries by agent ID
router.get('/agents/:agentId/queries', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'getting queries by agent ID', 'user got his / her queries by agent ID');
      next();
    } catch (error) {
      next(error);
    }
  },
  getQueriesByAgentIdValidator,
  validateRequest,
  agentController.getQueriesByAgentId.bind(agentController)
);

// Get queries by property ID
router.get('/properties/:propertyId/queries', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'getting queries by property ID', 'user got his / her queries by property ID');
      next();
    } catch (error) {
      next(error);
    }
  },
  getQueriesByPropertyIdValidator,
  validateRequest,
  agentController.getQueriesByPropertyId.bind(agentController)
);

// Get queries created by user (my queries)
router.get('/queries/my-queries', 
  authenticate,
  authorize(['agent']),
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'getting queries by user ID', 'user got his / her queries by user ID');
      next();
    } catch (error) {
      next(error);
    }
  },
  getQueriesByUserIdValidator,
  validateRequest,
  agentController.getQueriesByUserId.bind(agentController)
);

// Get single query by ID
router.get('/queries/:queryId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'getting query by ID', 'user got a query by ID');
      next();
    } catch (error) {
      next(error);
    }
  },
  getQueryByIdValidator,
  validateRequest,
  agentController.getQueryById.bind(agentController)
);

// Update query status
router.put('/queries/:queryId/status', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating query status', 'user updated a query status');
      next();
    } catch (error) {
      next(error);
    }
  },
  updateQueryStatusValidator,
  validateRequest,
  agentController.updateQueryStatus.bind(agentController)
);

// Delete query
router.delete('/queries/:queryId', 
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'deleting query', 'user deleted a query');
      next();
    } catch (error) {
      next(error);
    }
  },
  deleteQueryValidator,
  validateRequest,
  agentController.deleteQuery.bind(agentController)
);

export default router;
