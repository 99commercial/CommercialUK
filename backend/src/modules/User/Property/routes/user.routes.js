import express from 'express';
import UserController from '../controller/user.controller.js';
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
} from '../validation/user.validation.js';
import { validateRequest } from '../../../../middleware/error.middleware.js';

const router = express.Router();
const userController = new UserController();

// Property CRUD routes (Agent only)
router.post('/properties', 
  authenticate,
  createPropertyValidator,
  validateRequest,
  userController.createProperty.bind(userController)
);

// Create business details (business_rates, descriptions, sale_types)
router.put('/properties/:propertyId/business-details', 
  authenticate,
  updateBusinessDetailsValidator,
  validateRequest,
  userController.updateBusinessDetails.bind(userController)
);

// Create property details (epc, council_tax, rateable_value, planning)
router.put('/properties/:propertyId/property-details', 
  authenticate,
  updatePropertyDetailsValidator,
  validateRequest,
  userController.updatePropertyDetails.bind(userController)
);

// Create property images
router.put('/properties/:propertyId/images', 
  authenticate,
  uploadImages.array('files', 10),
  userController.updatePropertyImages.bind(userController)
);

// Create property documents
router.put('/properties/:propertyId/documents', 
  authenticate,
  uploadDocuments.array('files', 5),
  userController.updatePropertyDocuments.bind(userController)
);

// Create property location
router.put('/properties/:propertyId/location', 
  authenticate,
  updatePropertyLocationValidator,
  validateRequest,
  userController.updatePropertyLocation.bind(userController)
);

// Create property virtual tours
router.put('/properties/:propertyId/virtual-tours', 
  authenticate,
  updatePropertyVirtualToursValidator,
  validateRequest,
  userController.updatePropertyVirtualTours.bind(userController)
);

// Create property features
router.put('/properties/:propertyId/features', 
  authenticate,
  updatePropertyFeaturesValidator,
  validateRequest,
  userController.updatePropertyFeatures.bind(userController)
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get all properties (public access)
router.get('/properties/all', 
  userController.getAllProperties.bind(userController)
);

// Get properties by agent ID
router.get('/agents/:agentId/properties', 
  authenticate,
  authorize(['user']),
  userController.getPropertiesByAgentId.bind(userController)
);

// Get property by ID (public access)
router.get('/properties/:propertyId', 
  userController.getPropertyById.bind(userController)
);

// Delete property (agent only)
router.delete('/properties/:propertyId', 
  authenticate,
    authorize(['user']),
    userController.deleteProperty.bind(userController)
);

// ========== PROPERTY SECTION UPDATE ROUTES ==========

// Update property general details
router.patch('/properties/:propertyId/general-details', 
  authenticate,
  authorize(['user']),
  userController.updatePropertyGeneralDetails.bind(userController)
);

// Update property EPC details
// router.patch('/properties/:propertyId/epc', 
//   authenticate,
//   authorize(['user']),
//   updatePropertyEPCValidator,
//   validateRequest,
//   userController.updatePropertyEPC.bind(userController)
// );

// // Update property council tax details
// router.patch('/properties/:propertyId/council-tax', 
//   authenticate,
//   authorize(['user']),
//   updatePropertyCouncilTaxValidator,
//   validateRequest,
//   userController.updatePropertyCouncilTax.bind(userController)
// );

// // Update property rateable value
// router.patch('/properties/:propertyId/rateable-value', 
//   authenticate,
//   authorize(['user']),
//   updatePropertyRateableValueValidator,
//   validateRequest,
//   userController.updatePropertyRateableValue.bind(userController)
// );

// // Update property planning details
// router.patch('/properties/:propertyId/planning', 
//   authenticate,
//   authorize(['user']),
//   updatePropertyPlanningValidator,
//   validateRequest,
//   userController.updatePropertyPlanning.bind(userController)
// );

// // Update property status
// router.patch('/properties/:propertyId/status', 
//   authenticate,
//   authorize(['user']),
//   updatePropertyStatusValidator,
//   validateRequest,
//   userController.updatePropertyStatus.bind(userController)
// );

// // Update property SEO fields
// router.patch('/properties/:propertyId/seo', 
//   authenticate,
//   authorize(['user']),
//   updatePropertySEOValidator,
//   validateRequest,
//   userController.updatePropertySEO.bind(userController)
// );

// ========== REFERENCE ID UPDATE ROUTES ==========

// Update business rates by reference ID
router.patch('/business-rates/:businessRatesId', 
  authenticate,
  authorize(['user']),
  userController.updateBusinessRatesById.bind(userController)
);

// Update descriptions by reference ID
router.patch('/descriptions/:descriptionsId', 
  authenticate,
  authorize(['user']),
  userController.updateDescriptionsById.bind(userController)
);

// Update sale types by reference ID
router.patch('/sale-types/:saleTypesId', 
  authenticate,
  authorize(['user']),
  userController.updateSaleTypesById.bind(userController)
);

// // Update property images by reference ID
// router.patch('/property-images/:imagesId', 
//   authenticate,
//   authorize(['user']),
//   userController.updatePropertyImagesById.bind(userController)
// );

// // Update property documents by reference ID
// router.patch('/property-documents/:documentsId', 
//   authenticate,
//   authorize(['user']),
      //   userController.updatePropertyDocumentsById.bind(userController)
// );

// Update property location by reference ID
router.patch('/property-location/:locationId', 
  authenticate,
  authorize(['user']),
    userController.updatePropertyLocationById.bind(userController)
);

// Update property virtual tours by reference ID
router.patch('/property-virtual-tours/:virtualToursId', 
  authenticate,
  authorize(['user']),
  userController.updatePropertyVirtualToursById.bind(userController)
);

// Update property features by reference ID
router.patch('/property-features/:featuresId', 
  authenticate,
  authorize(['user']),
  userController.updatePropertyFeaturesById.bind(userController)
);

// Update property images with mixed data (existing + new images)
router.put('/properties/:propertyId/images/mixed', 
  authenticate,
  authorize(['user']),
  uploadImages.array('files', 10),
  userController.updatePropertyImagesMixed.bind(userController)
);

// Update property documents with mixed data (existing + new documents)
router.put('/properties/:propertyId/documents/mixed', 
  authenticate,
  authorize(['user']),
  uploadDocuments.array('files', 5),
  userController.updatePropertyDocumentsMixed.bind(userController)
);

// ========== PROPERTY QUERY ROUTES ==========

// Create property query
router.post('/properties/:propertyId/queries', 
  createPropertyQueryValidator,
  validateRequest,
  userController.createPropertyQuery.bind(userController)
);

// Get queries by agent ID
router.get('/agents/:agentId/queries', 
  authenticate,
  authorize(['user']),
  getQueriesByAgentIdValidator,
  validateRequest,
  userController.getQueriesByAgentId.bind(userController)
);

// Get queries by property ID
router.get('/properties/:propertyId/queries', 
  authenticate,
  authorize(['user']),
  getQueriesByPropertyIdValidator,
  validateRequest,
  userController.getQueriesByPropertyId.bind(userController)
);

// Get queries created by user (my queries)
router.get('/queries/my-queries', 
  authenticate,
  authorize(['user']),
  getQueriesByUserIdValidator,
  validateRequest,
  userController.getQueriesByUserId.bind(userController)
);

// Get single query by ID
router.get('/queries/:queryId', 
  authenticate,
  authorize(['user']),
  getQueryByIdValidator,
  validateRequest,
  userController.getQueryById.bind(userController)
);

// Update query status
router.put('/queries/:queryId/status', 
  authenticate,
  authorize(['user']),
  updateQueryStatusValidator,
  validateRequest,
  userController.updateQueryStatus.bind(userController)
);

// Delete query
router.delete('/queries/:queryId', 
  authenticate,
  authorize(['user']),
  deleteQueryValidator,
  validateRequest,
  userController.deleteQuery.bind(userController)
);

export default router;
