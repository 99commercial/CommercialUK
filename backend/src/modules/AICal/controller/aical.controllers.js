import AICalService from '../services/aical.services.js';

class AICalController {
  constructor() {
    this.aicalService = new AICalService();
  }

  /**
   * Create a new commercial property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createCommercialProperty = async (req, res, next) => {
    try {
      const result = await this.aicalService.createCommercialProperty(req.body);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create multiple commercial properties from an array
   * @param {Object} req - Express request object (expects req.body.properties to be an array)
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  createMultipleCommercialProperties = async (req, res, next) => {
    let properties = req.body;

    console.log(req.body, "all properties");

    try {
      // Helper function to parse SQFT value
      const parseSQFT = (sqftValue) => {
        if (!sqftValue) {
          return { minimum: 0, maximum: 0 };
        }

        // Convert to string if it's a number
        const sqftString = String(sqftValue).trim();

        // Check if it contains a dash (range)
        if (sqftString.includes('-')) {
          const parts = sqftString.split('-').map(part => part.trim());
          if (parts.length === 2) {
            // Remove commas and convert to numbers
            const min = parseInt(parts[0].replace(/,/g, ''), 10) || 0;
            const max = parseInt(parts[1].replace(/,/g, ''), 10) || 0;
            return { minimum: min, maximum: max };
          }
        }

        // Single value - remove commas and convert to number
        const maxValue = parseInt(sqftString.replace(/,/g, ''), 10) || 0;
        return { minimum: 0, maximum: maxValue };
      };

      // Helper function to convert value to number (handles strings with currency symbols, commas, etc.)
      const parseNumber = (value) => {
        if (value === null || value === undefined || value === '') {
          return 0;
        }
        // If already a number, return it
        if (typeof value === 'number') {
          return isNaN(value) ? 0 : value;
        }
        // Convert to string, remove all non-numeric characters except decimal point and minus sign
        // This handles: £217, $217, "217", "£2,000.50", etc.
        const numString = String(value)
          .replace(/[^\d.-]/g, '') // Remove all non-numeric chars except digits, decimal point, and minus
          .replace(/,/g, '') // Remove commas
          .trim();
        
        const parsed = parseFloat(numString);
        return isNaN(parsed) ? 0 : parsed;
      };

      // Valid property types enum
      const validPropertyTypes = ['Office', 'Retail', 'Industrial', 'Warehouse', 'Land', 'Leisure', 'Healthcare', 'Education', 'Hotel', 'Restaurant', 'Student Accommodation', 'Car Park', 'Data Centre', 'Other'];

      // Helper function to validate and normalize property type
      const validatePropertyType = (propertyType) => {
        if (!propertyType) {
          return 'Other';
        }
        const propertyTypeString = String(propertyType).trim();
        // Case-insensitive match - find exact match from enum array
        const matchedType = validPropertyTypes.find(
          type => type.toLowerCase() === propertyTypeString.toLowerCase()
        );
        return matchedType || 'Other';
      };

      // Transform each property object to match the exact model field names
      const transformedProperties = properties.map((property) => {
        const sqftParsed = parseSQFT(property.SQFT);

        return {
          property_type: validatePropertyType(property.PropertyType),
          property_link: property.PropertyLink || undefined,
          postcode: property.PostCode,
          pricingPCM: parseNumber(property.PricingPCM),
          pricingPA: parseNumber(property.PricingPA),
          sizeSQFT: {
            minimum: sqftParsed.minimum,
            maximum: sqftParsed.maximum,
          },
          latitude: property.latitude,
          longitude: property.longitude,
          pricePerSqftPA: parseNumber(property.PricePerSqftPA),
          pricePerSqftPCM: parseNumber(property.PricePerSqftPCM),
          comments: property.Comments || '',
        };
      });

      console.log(transformedProperties, "transformed properties");

      const result = await this.aicalService.createMultipleCommercialProperties(transformedProperties);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all commercial properties with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getAllCommercialProperties = async (req, res, next) => {
    try {
      const { page, limit, search } = req.query;
      const result = await this.aicalService.getAllCommercialProperties({ page, limit, search });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a specific commercial property by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getCommercialPropertyById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.aicalService.getCommercialPropertyById(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a commercial property by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  updateCommercialProperty = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.aicalService.updateCommercialProperty(id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a commercial property by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  deleteCommercialProperty = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.aicalService.deleteCommercialProperty(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Generate a report of commercial properties
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  generateReport = async (req, res, next) => {
    try {

      const { formData } = req.body;
      const userId = req.user._id;

      const result = await this.aicalService.generateReport(formData,userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all reports by userId
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getReportsByUserId = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { page, limit } = req.query;
      const result = await this.aicalService.getReportsByUserId(userId, { page, limit });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a single report by _id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  getReportById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.aicalService.getReportById(id);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

}

export default AICalController;
