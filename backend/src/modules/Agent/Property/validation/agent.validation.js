import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';

// Helper function to validate ObjectId
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Create Property Validator
export const createPropertyValidator = [
  // General Details
  body('general_details.building_name')
    .trim()
    .notEmpty()
    .withMessage('Building name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Building name must be between 2 and 200 characters'),
  
  body('general_details.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Address must be between 5 and 500 characters'),
  
  body('general_details.country_region')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country/region must not exceed 100 characters'),
  
  body('general_details.town_city')
    .trim()
    .notEmpty()
    .withMessage('Town/City is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Town/City must be between 2 and 100 characters'),
  
  body('general_details.postcode')
    .trim()
    .notEmpty()
    .withMessage('Postcode is required')
    .matches(/^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}$/i)
    .withMessage('Please enter a valid UK postcode'),
  
  body('general_details.sale_status')
    .optional()
    .isIn(['Available', 'Under Offer', 'Sold', 'Let', 'Withdrawn'])
    .withMessage('Invalid sale status'),
  
  body('general_details.property_type')
    .notEmpty()
    .withMessage('Property type is required')
    .isIn([
      'Office', 'Retail', 'Industrial', 'Warehouse', 'Land', 'Leisure',
      'Healthcare', 'Education', 'Hotel', 'Restaurant', 'Student Accommodation',
      'Car Park', 'Data Centre', 'Other'
    ])
    .withMessage('Invalid property type'),
  
  body('general_details.property_sub_type')
    .trim()
    .notEmpty()
    .withMessage('Property sub-type is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Property sub-type must be between 2 and 100 characters'),
  
  body('general_details.size_minimum')
    .isNumeric()
    .withMessage('Minimum size must be a number')
    .isFloat({ min: 0 })
    .withMessage('Minimum size must be greater than 0'),
  
  body('general_details.size_maximum')
    .isNumeric()
    .withMessage('Maximum size must be a number')
    .isFloat({ min: 0 })
    .withMessage('Maximum size must be greater than 0')
    .custom((value, { req }) => {
      const minSize = req.body.general_details?.size_minimum;
      if (minSize && value < minSize) {
        throw new Error('Maximum size must be greater than or equal to minimum size');
      }
      return true;
    }),
  
  body('general_details.approximate_year_of_construction')
    .isInt({ min: 1800, max: new Date().getFullYear() + 5 })
    .withMessage('Year of construction must be between 1800 and current year + 5'),
  
];

// Update Property Details Validator (EPC, Council Tax, Rateable Value, Planning)
export const updatePropertyDetailsValidator = [
  // Property ID validation
  param('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid property ID format');
      }
      return true;
    })
    .withMessage('Property ID must be a valid MongoDB ObjectId'),

  // EPC validation
  body('epc.rating')
    .optional()
    .isIn(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Exempt', 'Not Required','Unknown'])
    .withMessage('Invalid EPC rating'),

  // Council Tax validation
  body('council_tax.band')
    .optional()
    .isIn(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'Exempt', 'Not Applicable','Unknown'])
    .withMessage('Invalid council tax band'),

  // Rateable Value validation
  body('rateable_value')
    .optional()
    .isNumeric()
    .withMessage('Rateable value must be a number')
    .isFloat({ min: 0 })
    .withMessage('Rateable value must be greater than or equal to 0'),

  // Planning validation
  body('planning.status')
    .optional()
    .isIn(['Full Planning', 'Outline Planning', 'No Planning Required', 'Unknown'])
    .withMessage('Invalid planning status'),
];

// Update Business Details Validator
export const updateBusinessDetailsValidator = [
  // Property ID validation
  param('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid property ID format');
      }
      return true;
    })
    .withMessage('Property ID must be a valid MongoDB ObjectId'),

  // Business Rates validation
  body('business_rates.rateable_value_gbp')
    .optional()
    .isNumeric()
    .withMessage('Rateable value must be a number')
    .isFloat({ min: 0 })
    .withMessage('Rateable value must be greater than or equal to 0'),
  
  body('business_rates.rates_payable_gbp')
    .optional()
    .isNumeric()
    .withMessage('Rates payable must be a number')
    .isFloat({ min: 0 })
    .withMessage('Rates payable must be greater than or equal to 0'),

  // Descriptions validation
  body('descriptions.general')
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('General description must be between 50 and 2000 characters'),
  
  body('descriptions.location')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Location description must be between 20 and 1000 characters'),
  
  body('descriptions.accommodation')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Accommodation description must be between 20 and 1000 characters'),
  
  body('descriptions.terms')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Terms description must be between 20 and 1000 characters'),
  
  body('descriptions.specifications')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Specifications description must be between 20 and 1000 characters'),

  // Sale Types validation
  body('sale_types')
    .optional()
    .isArray()
    .withMessage('Sale types must be an array')
    .custom((value) => {
      if (value && value.length !== 1) {
        throw new Error('Exactly one sale type is required');
      }
      return true;
    })
    .withMessage('Exactly one sale type is required'),
  
  body('sale_types.*.sale_type')
    .optional()
    .isIn(['Freehold', 'Leasehold', 'To Let', 'For Sale', 'Under Offer', 'Sold', 'Let'])
    .withMessage('Invalid sale type'),
  
  body('sale_types.*.price_currency')
    .optional()
    .isIn(['GBP'])
    .withMessage('Price currency must be GBP'),
  
  body('sale_types.*.price_value')
    .optional()
    .isNumeric()
    .withMessage('Price value must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price value must be greater than or equal to 0'),
  
  body('sale_types.*.price_unit')
    .optional()
    .isIn(['per sq ft', 'per annum', 'per month', 'per unit', 'total'])
    .withMessage('Invalid price unit'),
];

// Update Property Images Validator
export const updatePropertyImagesValidator = [
  // Property ID validation
  param('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid property ID format');
      }
      return true;
    })
    .withMessage('Property ID must be a valid MongoDB ObjectId'),

  // Files validation - at least one file required
  body('files')
    .custom((value, { req }) => {
      // Check if files are being uploaded
      if (req.files && req.files.length > 0) {
        return true;
      }
      // If no files in request, check if property already has images
      // This will be handled in the service layer
      return true;
    })
    .withMessage('At least one image file is required'),

  // Image captions validation (can be string or array)
  body('captions')
    .custom((value, { req }) => {
      // If files are being uploaded, captions are required
      if (req.files && req.files.length > 0) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          throw new Error('Captions are required when uploading images');
        }
        return true;
      }
      return true;
    }),
  
  body('captions.*')
    .custom((value, { req }) => {
      // If files are being uploaded, each caption must not be empty
      if (req.files && req.files.length > 0) {
        if (!value || value.trim().length === 0) {
          throw new Error('Each image must have a caption');
        }
      }
      return true;
    })
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Each caption must be between 1 and 500 characters'),
  
  // Image types validation (can be string or array)
  body('image_types')
    .custom((value, { req }) => {
      // If files are being uploaded, image types are required
      if (req.files && req.files.length > 0) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          throw new Error('Image types are required when uploading images');
        }
        return true;
      }
      return true;
    }),
  
  body('image_types.*')
    .isIn(['Photo', 'Floor Plan', 'EPC', 'Site Plan', 'Exterior', 'Interior', 'Aerial', 'Other'])
    .withMessage('Invalid image type'),
];

// Update Property Documents Validator
export const updatePropertyDocumentsValidator = [
  // Property ID validation
  param('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid property ID format');
      }
      return true;
    })
    .withMessage('Property ID must be a valid MongoDB ObjectId'),

  // Document names validation
  body('document_names')
    .optional()
    .isArray()
    .withMessage('Document names must be an array'),
  
  body('document_names.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Each document name must be between 2 and 200 characters'),
  
  // Document types validation
  body('document_types')
    .optional()
    .isArray()
    .withMessage('Document types must be an array'),
  
  body('document_types.*')
    .optional()
    .isIn(['Floor Plan', 'EPC Certificate', 'Planning Permission', 'Title Deeds', 'Lease Agreement', 'Survey Report', 'Insurance Certificate', 'Health & Safety Certificate', 'Fire Safety Certificate', 'Other'])
    .withMessage('Invalid document type'),
];

// Update Property Location Validator
export const updatePropertyLocationValidator = [
  // Property ID validation
  param('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid property ID format');
      }
      return true;
    })
    .withMessage('Property ID must be a valid MongoDB ObjectId'),

  // Coordinates validation
  body('coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),

  // Address details validation
  body('address_details.formatted_address')
    .trim()
    .notEmpty()
    .withMessage('Formatted address is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Formatted address must be between 10 and 500 characters'),
  
  body('address_details.street_number')
    .trim()
    .notEmpty()
    .withMessage('Street number is required')
    .isLength({ max: 20 })
    .withMessage('Street number must not exceed 20 characters'),
  
  body('address_details.route')
    .notEmpty()
    .withMessage('Route is required')
    .trim()
    .isLength({ max: 200 })
    .withMessage('Route must not exceed 200 characters'),
  
  body('address_details.locality')
    .notEmpty()
    .withMessage('Locality is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Locality must not exceed 100 characters'),
  
  body('address_details.administrative_area_level_1')
    .notEmpty()
    .withMessage('Administrative area level 1 is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Administrative area level 1 must not exceed 100 characters'),
  
  body('address_details.administrative_area_level_2')
    .notEmpty()
    .withMessage('Administrative area level 2 is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Administrative area level 2 must not exceed 100 characters'),
  
  body('address_details.country')
    .notEmpty()
    .withMessage('Country is required')
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  
  body('address_details.postal_code')
    .optional()
    .matches(/^[A-Z]{1,2}[0-9][A-Z0-9]? [0-9][A-Z]{2}$/i)
    .withMessage('Please enter a valid UK postcode'),
];

// Update Property Virtual Tours Validator
export const updatePropertyVirtualToursValidator = [
  // Property ID validation
  param('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid property ID format');
      }
      return true;
    })
    .withMessage('Property ID must be a valid MongoDB ObjectId'),
];

// Update Property Features Validator
export const updatePropertyFeaturesValidator = [
  // Property ID validation
  param('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('Invalid property ID format');
      }
      return true;
    })
    .withMessage('Property ID must be a valid MongoDB ObjectId'),

  // Main features validation
  body('features.air_conditioning')
    .optional()
    .isIn(['Yes', 'No', 'Unknown'])
    .withMessage('Air conditioning must be Yes, No, or Unknown'),
  
  body('features.clean_room')
    .optional()
    .isIn(['Yes', 'No', 'Unknown'])
    .withMessage('Clean room must be Yes, No, or Unknown'),
  
  body('features.craneage')
    .optional()
    .isIn(['Yes', 'No', 'Unknown'])
    .withMessage('Craneage must be Yes, No, or Unknown'),
  
  body('features.laboratory')
    .optional()
    .isIn(['Yes', 'No', 'Unknown'])
    .withMessage('Laboratory must be Yes, No, or Unknown'),
  
  body('features.loading_bay')
    .optional()
    .isIn(['Yes', 'No', 'Unknown'])
    .withMessage('Loading bay must be Yes, No, or Unknown'),
  
  body('features.secure_yard')
    .optional()
    .isIn(['Yes', 'No', 'Unknown'])
    .withMessage('Secure yard must be Yes, No, or Unknown'),
  
  body('features.yard')
    .optional()
    .isIn(['Yes', 'No', 'Unknown'])
    .withMessage('Yard must be Yes, No, or Unknown'),

  // Additional features validation
  body('additional_features')
    .optional()
    .isArray()
    .withMessage('Additional features must be an array'),
  
  body('additional_features.*.feature_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Feature name must be between 2 and 100 characters'),
  
  body('additional_features.*.feature_value')
    .optional()
    .isIn(['Yes', 'No', 'Unknown'])
    .withMessage('Feature value must be Yes, No, or Unknown'),
  
  body('additional_features.*.description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Feature description must not exceed 500 characters'),
  
  body('feature_notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Feature notes must not exceed 1000 characters'),
];

// ========== PROPERTY QUERY VALIDATORS ==========

// Create Property Query Validator
export const createPropertyQueryValidator = [
  param('propertyId')
    .custom(isValidObjectId)
    .withMessage('Invalid property ID'),

  body('title')
    .isIn(['MR', 'MRS', 'MS', 'MISS'])
    .withMessage('Title must be one of: MR, MRS, MS, MISS'),
  
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),
  
  body('no_of_people')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Number of people must be between 1 and 1000'),
  
  body('start_date')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  
  body('length_of_term')
    .trim()
    .notEmpty()
    .withMessage('Length of term is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Length of term must be between 2 and 100 characters'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
];

// Update Query Status Validator
export const updateQueryStatusValidator = [
  param('queryId')
    .custom(isValidObjectId)
    .withMessage('Invalid query ID'),

  body('status')
    .optional()
    .isIn(['pending', 'read', 'responded', 'closed'])
    .withMessage('Status must be one of: pending, read, responded, closed'),
  
  body('agent_notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Agent notes must not exceed 500 characters'),
  
  body('response_message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Response message must not exceed 1000 characters'),
];

// Get Queries by Agent ID Validator
export const getQueriesByAgentIdValidator = [
  param('agentId')
    .custom(isValidObjectId)
    .withMessage('Invalid agent ID'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['pending', 'read', 'responded', 'closed'])
    .withMessage('Invalid status filter'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'updated_at', 'first_name', 'last_name', 'company'])
    .withMessage('Invalid sort field'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

// Get Queries by Property ID Validator
export const getQueriesByPropertyIdValidator = [
  param('propertyId')
    .custom(isValidObjectId)
    .withMessage('Invalid property ID'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'updated_at', 'first_name', 'last_name', 'company'])
    .withMessage('Invalid sort field'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

// Get Queries by User ID Validator
export const getQueriesByUserIdValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'updated_at', 'property_id'])
    .withMessage('Invalid sort field'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

// Get Query by ID Validator
export const getQueryByIdValidator = [
  param('queryId')
    .custom(isValidObjectId)
    .withMessage('Invalid query ID'),
];

// Delete Query Validator
export const deleteQueryValidator = [
  param('queryId')
    .custom(isValidObjectId)
    .withMessage('Invalid query ID'),
];
