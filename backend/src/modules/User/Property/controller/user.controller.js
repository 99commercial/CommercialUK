import UserService from '../service/user.service.js';

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new property
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createProperty(req, res) {
    try {
      const userId = req.user._id; // Assuming user ID is available from auth middleware
      const propertyData = req.body;

      const result = await this.userService.createProperty(propertyData, userId);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update business details (business_rates, descriptions, sale_types)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateBusinessDetails(req, res) {
    try {
      console.log('Controller updateBusinessDetails called');
      const { propertyId } = req.params;
      const { business_rates, descriptions, sale_types } = req.body;

      const result = await this.userService.updateBusinessDetails(propertyId, {
        business_rates,
        descriptions,
        sale_types
      });

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property details (epc, council_tax, rateable_value, planning)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyDetails(req, res) {
      try {
        const { propertyId } = req.params;
        const { epc, council_tax, rateable_value, planning } = req.body;
  
        const result = await this.userService.updatePropertyDetails(propertyId, {
          epc,
          council_tax,
          rateable_value,
          planning
        });
  
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      }
  }

  /**
   * Update property images
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyImages(req, res) {
    try {
      console.log('Controller updatePropertyImages called');
      const { propertyId } = req.params;
      
      // Parse form data arrays
      const captions = req.body.captions ? 
        (Array.isArray(req.body.captions) ? req.body.captions : [req.body.captions]) : [];
      const image_types = req.body.image_types ? 
        (Array.isArray(req.body.image_types) ? req.body.image_types : [req.body.image_types]) : [];

      const imagesData = {
        files: req.files || [],
        captions,
        image_types
      };

      console.log('Request data:', {
        propertyId,
        files: req.files ? req.files.length : 0,
        captions,
        image_types,
        body: req.body
      });

      const result = await this.userService.updatePropertyImages(propertyId, imagesData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      console.error('Error in updatePropertyImages controller:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property documents
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyDocuments(req, res) {
    try {
      const { propertyId } = req.params;
      let { document_types } = req.body;

      // Parse document_types if it's a JSON string
      if (typeof document_types === 'string') {
        try {
          document_types = JSON.parse(document_types);
        } catch (error) {
          console.error('Error parsing document_types:', error);
          document_types = [];
        }
      }

      console.log('Document types:', document_types);

      const documentsData = {
        document_types,
        files: req.files || []
      };

      const result = await this.userService.updatePropertyDocuments(propertyId, documentsData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property documents with mixed data (existing + new documents)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyDocumentsMixed(req, res) {
    try {
      console.log('Controller updatePropertyDocumentsMixed called');
      const { propertyId } = req.params;
      
      // Parse existing documents data
      let existingDocuments = [];
      if (req.body.existing_documents) {
        try {
          existingDocuments = typeof req.body.existing_documents === 'string' 
            ? JSON.parse(req.body.existing_documents) 
            : req.body.existing_documents;
        } catch (error) {
          console.error('Error parsing existing_documents:', error);
          existingDocuments = [];
        }
      }

      // Parse form data arrays for new documents
            const file_types = req.body.file_types ? 
              (Array.isArray(req.body.file_types) ? req.body.file_types : [req.body.file_types]) : [];
        
            const documentsData = {
              existing_documents: existingDocuments,
              files: req.files || [],
              file_types
            };

      console.log('Request data:', {
        propertyId,
        existing_documents: existingDocuments.length,
        files: req.files ? req.files.length : 0,
        file_types,
        body: req.body
      });

      const result = await this.userService.updatePropertyDocumentsMixed(propertyId, documentsData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      console.error('Error in updatePropertyDocumentsMixed controller:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property location
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyLocation(req, res) {
    try {
      const { propertyId } = req.params;
      const locationData = req.body;

      const result = await this.userService.updatePropertyLocation(propertyId, locationData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property virtual tours
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyVirtualTours(req, res) {
    try {
      const { propertyId } = req.params;
      const virtualToursData = req.body;

      const result = await this.userService.updatePropertyVirtualTours(propertyId, virtualToursData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property features
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyFeatures(req, res) {
    try {
      const { propertyId } = req.params;
      const featuresData = req.body;

      const result = await this.userService.updatePropertyFeatures(propertyId, featuresData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get all properties with pagination and filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllProperties(req, res) {
    try {
      const queryParams = req.query;
      const result = await this.userService.getAllProperties(queryParams);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get properties by agent ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertiesByAgentId(req, res) {
    try {
      const { agentId } = req.params;
      const queryParams = req.query;
      
      const result = await this.userService.getPropertiesByAgentId(agentId, queryParams);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get property by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getPropertyById(req, res) {
    try {
      const { propertyId } = req.params;
      
      const result = await this.userService.getPropertyById(propertyId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ========== PROPERTY SECTION UPDATE CONTROLLERS ==========

  /**
   * Update property general details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyGeneralDetails(req, res) {
    try {
      const { propertyId } = req.params;
      const generalDetails = req.body;

      const result = await this.userService.updatePropertyGeneralDetails(propertyId, generalDetails);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // /**
  //  * Update property EPC details
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async updatePropertyEPC(req, res) {
  //   try {
  //     const { propertyId } = req.params;
  //     const epcData = req.body;

  //     const result = await this.userService.updatePropertyEPC(propertyId, epcData);

  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //       data: result.data
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

  // /**
  //  * Update property council tax details
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async updatePropertyCouncilTax(req, res) {
  //   try {
  //     const { propertyId } = req.params;
  //     const councilTaxData = req.body;

  //     const result = await this.userService.updatePropertyCouncilTax(propertyId, councilTaxData);

  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //       data: result.data
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

  // /**
  //  * Update property rateable value
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async updatePropertyRateableValue(req, res) {
  //   try {
  //     const { propertyId } = req.params;
  //     const { rateable_value } = req.body;

  //     const result = await this.userService.updatePropertyRateableValue(propertyId, rateable_value);

  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //       data: result.data
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

  // /**
  //  * Update property planning details
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async updatePropertyPlanning(req, res) {
  //   try {
  //     const { propertyId } = req.params;
  //     const planningData = req.body;

  //     const result = await this.userService.updatePropertyPlanning(propertyId, planningData);

  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //       data: result.data
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

  // /**
  //  * Update property status
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async updatePropertyStatus(req, res) {
  //   try {
  //     const { propertyId } = req.params;
  //     const statusData = req.body;

  //     const result = await this.userService.updatePropertyStatus(propertyId, statusData);

  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //       data: result.data
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

  // /**
  //  * Update property SEO fields
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async updatePropertySEO(req, res) {
  //   try {
  //     const { propertyId } = req.params;
  //     const seoData = req.body;

  //     const result = await this.userService.updatePropertySEO(propertyId, seoData);

  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //       data: result.data
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

  // ========== REFERENCE ID UPDATE CONTROLLERS ==========

  /**
   * Update business rates by reference ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateBusinessRatesById(req, res) {
    try {
      const { businessRatesId } = req.params;
      const businessRatesData = req.body;

      const result = await this.userService.updateBusinessRatesById(businessRatesId, businessRatesData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update descriptions by reference ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateDescriptionsById(req, res) {
    try {
      const { descriptionsId } = req.params;
      const descriptionsData = req.body;

      const result = await this.userService.updateDescriptionsById(descriptionsId, descriptionsData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update sale types by reference ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateSaleTypesById(req, res) {
    try {
      const { saleTypesId } = req.params;
      const saleTypesData = req.body;

      const result = await this.userService.updateSaleTypesById(saleTypesId, saleTypesData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // /**
  //  * Update property images by reference ID
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async updatePropertyImagesById(req, res) {
  //   try {
  //     const { imagesId } = req.params;
  //     const imagesData = req.body;

  //     const result = await this.userService.updatePropertyImagesById(imagesId, imagesData);

  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //       data: result.data
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }

  // /**
  //  * Update property documents by reference ID
  //  * @param {Object} req - Express request object
  //  * @param {Object} res - Express response object
  //  */
  // async updatePropertyDocumentsById(req, res) {
  //   try {
  //     const { documentsId } = req.params;
  //     const documentsData = req.body;

  //     const result = await this.userService.updatePropertyDocumentsById(documentsId, documentsData);

  //     res.status(200).json({
  //       success: true,
  //       message: result.message,
  //       data: result.data
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       message: error.message
  //     });
  //   }
  // }


  /**
   * Update property images with mixed data (existing + new images)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyImagesMixed(req, res) {
    try {
      console.log('Controller updatePropertyImagesMixed called');
      const { propertyId } = req.params;
      
      // Parse existing images data
      let existingImages = [];
      if (req.body.existing_images) {
        try {
          existingImages = typeof req.body.existing_images === 'string' 
            ? JSON.parse(req.body.existing_images) 
            : req.body.existing_images;
        } catch (error) {
          console.error('Error parsing existing_images:', error);
          existingImages = [];
        }
      }

      // Parse form data arrays for new images
      const captions = req.body.captions ? 
        (Array.isArray(req.body.captions) ? req.body.captions : [req.body.captions]) : [];
      const image_types = req.body.image_types ? 
        (Array.isArray(req.body.image_types) ? req.body.image_types : [req.body.image_types]) : [];

      const imagesData = {
        existing_images: existingImages,
        files: req.files || [],
        captions,
        image_types
      };

      console.log('Request data:', {
        propertyId,
        existing_images: existingImages.length,
        files: req.files ? req.files.length : 0,
        captions,
        image_types,
        body: req.body
      });

      const result = await this.userService.updatePropertyImagesMixed(propertyId, imagesData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      console.error('Error in updatePropertyImagesMixed controller:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property location by reference ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyLocationById(req, res) {
    try {
      const { locationId } = req.params;
      const locationData = req.body;

      const result = await this.userService.updatePropertyLocationById(locationId, locationData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property virtual tours by reference ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyVirtualToursById(req, res) {
    try {
      const { virtualToursId } = req.params;
      const virtualToursData = req.body;

      const result = await this.userService.updatePropertyVirtualToursById(virtualToursId, virtualToursData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update property features by reference ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updatePropertyFeaturesById(req, res) {
    try {
      const { featuresId } = req.params;
      const featuresData = req.body;

      const result = await this.userService.updatePropertyFeaturesById(featuresId, featuresData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ========== PROPERTY QUERY CONTROLLERS ==========

  /**
   * Create a property query
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createPropertyQuery(req, res) {
    try {
      const { propertyId } = req.params;
      const queryData = req.body;
      const userId = req.user._id; // User ID from authentication middleware

      const result = await this.userService.createPropertyQuery(queryData, propertyId, null, userId);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get queries by agent ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getQueriesByAgentId(req, res) {
    try {
      const { agentId } = req.params;
      const queryParams = req.query;

      const result = await this.userService.getQueriesByUserId(agentId, queryParams);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get queries by property ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getQueriesByPropertyId(req, res) {
    try {
      const { propertyId } = req.params;
      const queryParams = req.query;

      const result = await this.userService.getQueriesByPropertyId(propertyId, queryParams);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get queries created by user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getQueriesByUserId(req, res) {
    try {
      const userId = req.user._id; // User ID from authentication middleware
      const queryParams = req.query;

      const result = await this.userService.getQueriesByUserId(userId, queryParams);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Get single query by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getQueryById(req, res) {
    try {
      const { queryId } = req.params;

      const result = await this.userService.getQueryById(queryId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Update query status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateQueryStatus(req, res) {
    try {
      const { queryId } = req.params;
      const updateData = req.body;

      const result = await this.userService.updateQueryStatus(queryId, updateData);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete query
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteQuery(req, res) {
    try {
      const { queryId } = req.params;

      const result = await this.userService.deleteQuery(queryId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Delete a property and all related data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteProperty(req, res) {
    try {
      const { propertyId } = req.params;
      const agentId = req.user._id;

      const result = await this.userService.deleteProperty(propertyId, agentId);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default UserController;
