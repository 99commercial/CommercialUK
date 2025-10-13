import Property from '../../../../models/property.model.js';
import BusinessRates from '../../../../models/business.rates.model.js';
import Descriptions from '../../../../models/descriptions.model.js';
import SaleTypes from '../../../../models/sale.types.model.js';
import PropertyImages from '../../../../models/property.images.model.js';
import PropertyDocuments from '../../../../models/property.documents.model.js';
import PropertyLocation from '../../../../models/property.location.model.js';
import PropertyVirtualTours from '../../../../models/property.virtual.tours.model.js';
import PropertyFeatures from '../../../../models/property.features.model.js';
import PropertyQuery from '../../../../models/propertry_query.model.js';
import User from '../../../../models/user.model.js';
import BusinessDetails from '../../../../models/business_details.model.js';
import { uploadMultipleToCloudinary } from '../../../../config/cloudinary.config.js';
import mongoose from 'mongoose';

class UserService {
  constructor() {
    this.Property = Property;
    this.BusinessRates = BusinessRates;
    this.Descriptions = Descriptions;
    this.SaleTypes = SaleTypes;
    this.PropertyImages = PropertyImages;
    this.PropertyDocuments = PropertyDocuments;
    this.PropertyLocation = PropertyLocation;
    this.PropertyVirtualTours = PropertyVirtualTours;
    this.PropertyFeatures = PropertyFeatures;
    this.PropertyQuery = PropertyQuery;
    this.User = User;
    this.BusinessDetails = BusinessDetails;   
  }

  // Helper method to update object fields directly
  updateObjectFields(existingObject, updateData) {
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        existingObject[key] = updateData[key];
      }
    });
    return existingObject;
  }

  /**
   * Create a new property
   * @param {Object} propertyData - Property data object
    * @param {string} userId - ID of the user creating the property
   * @returns {Promise<Object>} Created property object
   */
  async createProperty(propertyData, userId) {
    try {
      // Prepare property data with user ID
      const propertyPayload = {
        ...propertyData,
          listed_by: userId,
        is_active: true,
        is_featured: false,
        is_verified: false,
      };

      // Create the property
      const property = new this.Property(propertyPayload);
      const savedProperty = await property.save();

      return {
        success: true,
        data: savedProperty,
        message: 'Property created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  /**
   * Update business details (business_rates, descriptions, sale_types)
   * @param {string} propertyId - Property ID
   * @param {Object} updateData - Update data object
   * @returns {Promise<Object>} Updated property object
   */
  async updateBusinessDetails(propertyId, updateData) {
    try {
      console.log('Service updateBusinessDetails called with:', { propertyId, updateData });
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Create business rates if provided and not empty
      if (updateData.business_rates && Object.keys(updateData.business_rates).length > 0) {
        // Always create new business rates document
        const businessRates = new this.BusinessRates({
          property_id: propertyId,
          ...updateData.business_rates
        });
        const savedBusinessRates = await businessRates.save();
        // Update property with business rates reference
        property.business_rates_id = savedBusinessRates._id;
      }

      // Create descriptions if provided and not empty
      if (updateData.descriptions && Object.keys(updateData.descriptions).length > 0) {
        // Always create new descriptions document
        const descriptions = new this.Descriptions({
          property_id: propertyId,
          ...updateData.descriptions
        });
        const savedDescriptions = await descriptions.save();
        // Update property with descriptions reference
        property.descriptions_id = savedDescriptions._id;
      }

      // Create sale types if provided and not empty
      if (updateData.sale_types && Array.isArray(updateData.sale_types) && updateData.sale_types.length > 0) {
        // Always create new sale types document
        const saleTypes = new this.SaleTypes({
          property_id: propertyId,
          sale_types: updateData.sale_types
        });
        const savedSaleTypes = await saleTypes.save();
        // Update property with sale types reference
        property.sale_types_id = savedSaleTypes._id;
      }

      // Save the property with updated references
      await property.save();

      // Get the property with populated business details for response
      const propertyWithDetails = await this.Property.findById(propertyId)
        .populate('business_rates_id')
        .populate('descriptions_id')
        .populate('sale_types_id');

      return {
        success: true,
        data: propertyWithDetails,
        message: 'Business details updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update business details: ${error.message}`);
    }
  }

  /**
   * Update property details (epc, council_tax, rateable_value, planning)
   * @param {string} propertyId - Property ID
   * @param {Object} updateData - Update data object
   * @returns {Promise<Object>} Updated property object
   */
  async updatePropertyDetails(propertyId, updateData) {
    try {
      const updatedProperty = await this.Property.findByIdAndUpdate(
        propertyId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedProperty) {
        throw new Error('Property not found');
      }

      return {
        success: true,
        data: updatedProperty,
        message: 'Property details updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property details: ${error.message}`);
    }
  }

  // /**
  //  * Update property images
  //  * @param {string} propertyId - Property ID
  //  * @param {Object} imagesData - Images data object with files
  //  * @returns {Promise<Object>} Updated property object
  //  */
  async updatePropertyImages(propertyId, imagesData) {
    try {
      console.log('Service updatePropertyImages called with:', { propertyId, imagesData });
      
      const { files, captions, image_types } = imagesData;
      let uploadedImages = [];

      // Validate that captions are provided for all files
      if (files && files.length > 0) {
        if (!captions || captions.length === 0) {
          throw new Error('Captions are required when uploading images');
        }
        
        if (captions.length !== files.length) {
          throw new Error('Number of captions must match number of files');
        }
        
        // Validate each caption is not empty
        const emptyCaptions = captions.filter(caption => !caption || caption.trim().length === 0);
        if (emptyCaptions.length > 0) {
          throw new Error('All images must have non-empty captions');
        }
      }

      // Process files from CloudinaryStorage (files are already uploaded)
      if (files && files.length > 0) {
        console.log('Processing files from CloudinaryStorage:', files.length);
        
        uploadedImages = files.map((file, index) => ({
          secure_url: file.path, // CloudinaryStorage provides path as the URL
          original_filename: file.originalname,
          bytes: file.size,
          format: file.mimetype.split('/')[1] || 'jpg',
          public_id: file.filename
        }));
        
        console.log('Processed images:', uploadedImages.length);
      }

      // Prepare image data with Cloudinary URLs matching the schema
      const imageDocumentData = {
        property_id: propertyId,
        images: uploadedImages.map((upload, index) => ({
          url: upload.secure_url,
          caption: captions?.[index] || '',
          image_type: image_types?.[index] || 'Photo',
          file_name: upload.original_filename || `image_${index + 1}`,
          file_size: upload.bytes,
          mime_type: `image/${upload.format}`,
          order: index,
          is_thumbnail: index === 0,
          upload_status: 'Completed'
        }))
      };

      console.log('Creating image document with data:', imageDocumentData);

      // Always create new image document
      const imageDocument = new this.PropertyImages(imageDocumentData);
      const savedImage = await imageDocument.save();
      console.log('Created image document:', savedImage._id);

      // Validate that property has at least one image after creation
      if (!savedImage.images || savedImage.images.length === 0) {
        throw new Error('Property must have at least one image');
      }

      // Update the property with the reference
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      property.images_id = savedImage._id;
      await property.save();

      // Get the property with populated images
      const propertyWithImages = await this.Property.findById(propertyId)
        .populate('images_id');

      return {
        success: true,
        data: propertyWithImages,
        message: 'Property images updated successfully'
      };
    } catch (error) {
      console.error('Error in updatePropertyImages:', error);
      throw new Error(`Failed to update property images: ${error.message}`);
    }
  }

  /**
   * Update property images with mixed data (existing + new images)
   * @param {string} propertyId - Property ID
   * @param {Object} imagesData - Images data object with existing images and new files
   * @returns {Promise<Object>} Updated property object
   */
  async updatePropertyImagesMixed(propertyId, imagesData) {
    try {
      console.log('Service updatePropertyImagesMixed called with:', { propertyId, imagesData });
      
      const { existing_images, files, captions, image_types } = imagesData;
      let allImages = [];

      // Validate existing images data
      if (existing_images && Array.isArray(existing_images)) {
        // Validate each existing image has required fields
        for (let i = 0; i < existing_images.length; i++) {
          const img = existing_images[i];
          if (!img.url || !img.caption || !img.image_type) {
            throw new Error(`Existing image at index ${i} is missing required fields (url, caption, image_type)`);
          }
        }
        
        // Add existing images to the array
        allImages = existing_images.map((img, index) => ({
          url: img.url,
          caption: img.caption,
          image_type: img.image_type,
          file_name: img.file_name || `existing_image_${index + 1}`,
          file_size: img.file_size || 0,
          mime_type: img.mime_type || 'image/jpeg',
          order: img.order !== undefined ? img.order : index,
          is_thumbnail: img.is_thumbnail || false,
          upload_status: 'Completed'
        }));
      }

      // Validate that captions are provided for all new files
      if (files && files.length > 0) {
        if (!captions || captions.length === 0) {
          throw new Error('Captions are required when uploading new images');
        }
        
        if (captions.length !== files.length) {
          throw new Error('Number of captions must match number of new files');
        }
        
        // Validate each caption is not empty
        const emptyCaptions = captions.filter(caption => !caption || caption.trim().length === 0);
        if (emptyCaptions.length > 0) {
          throw new Error('All new images must have non-empty captions');
        }
      }

      // Process new files from CloudinaryStorage (files are already uploaded)
      if (files && files.length > 0) {
        console.log('Processing new files from CloudinaryStorage:', files.length);
        
        const newUploadedImages = files.map((file, index) => ({
          secure_url: file.path, // CloudinaryStorage provides path as the URL
          original_filename: file.originalname,
          bytes: file.size,
          format: file.mimetype.split('/')[1] || 'jpg',
          public_id: file.filename
        }));
        
        // Add new images to the array
        const newImages = newUploadedImages.map((upload, index) => ({
          url: upload.secure_url,
          caption: captions[index],
          image_type: image_types?.[index] || 'Photo',
          file_name: upload.original_filename || `new_image_${index + 1}`,
          file_size: upload.bytes,
          mime_type: `image/${upload.format}`,
          order: allImages.length + index,
          is_thumbnail: allImages.length === 0 && index === 0, // First image is thumbnail if no existing images
          upload_status: 'Completed'
        }));

        allImages = [...allImages, ...newImages];
        console.log('Processed new images:', newImages.length);
      }

      // Ensure at least one image exists
      if (allImages.length === 0) {
        throw new Error('At least one image is required');
      }

      // Ensure only one thumbnail
      const thumbnailCount = allImages.filter(img => img.is_thumbnail).length;
      if (thumbnailCount === 0) {
        // Set first image as thumbnail if none is set
        allImages[0].is_thumbnail = true;
      } else if (thumbnailCount > 1) {
        // Keep only the first thumbnail, remove others
        let foundFirst = false;
        allImages.forEach(img => {
          if (img.is_thumbnail && foundFirst) {
            img.is_thumbnail = false;
          } else if (img.is_thumbnail && !foundFirst) {
            foundFirst = true;
          }
        });
      }

      // Prepare image document data
      const imageDocumentData = {
        property_id: propertyId,
        images: allImages
      };

      console.log('Creating image document with mixed data:', {
        total_images: allImages.length,
        existing_images: existing_images?.length || 0,
        new_images: files?.length || 0
      });

      // Always create new image document
      const imageDocument = new this.PropertyImages(imageDocumentData);
      const savedImage = await imageDocument.save();
      console.log('Created image document:', savedImage._id);

      // Update the property with the reference
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      property.images_id = savedImage._id;
      await property.save();

      // Get the property with populated images
      const propertyWithImages = await this.Property.findById(propertyId)
        .populate('images_id');

      return {
        success: true,
        data: propertyWithImages,
        message: 'Property images updated successfully with mixed data'
      };
    } catch (error) {
      console.error('Error in updatePropertyImagesMixed:', error);
      throw new Error(`Failed to update property images with mixed data: ${error.message}`);
    }
  }

  /**
   * Update property documents
   * @param {string} propertyId - Property ID
   * @param {Object} documentsData - Documents data object with files
   * @returns {Promise<Object>} Updated property object
   */
  async updatePropertyDocuments(propertyId, documentsData) {
    try {
      console.log('Service updatePropertyDocuments called with:', { propertyId, documentsData });
      
      const { document_types , files } = documentsData;
      let uploadedDocuments = [];


        
        uploadedDocuments = files.map((file, index) => ({
          secure_url: file.path, // CloudinaryStorage provides path as the URL
          original_filename: file.originalname,
          bytes: file.size,
          format: file.mimetype.split('/')[1] || 'pdf',
          public_id: file.filename
        }));

        console.log('Document types:', document_types);

      // Prepare document data with Cloudinary URLs matching the schema
      const documentData = {
        property_id: propertyId,
        documents: uploadedDocuments.map((upload, index) => {
          const docType = document_types[index] || 'Other';
          return {
            document_name: upload.original_filename || `document_${index + 1}`,
            file_url: upload.secure_url,
            file_name: upload.original_filename || `document_${index + 1}`,
            file_size: upload.bytes,
            mime_type: upload.format === 'pdf' ? 'application/pdf' : `application/${upload.format}`,
            document_type: docType,
            upload_status: 'Completed',
            uploaded_at: new Date(),
            download_count: 0
          };
        })
      };

      console.log('Creating document document with data:', documentData);
      console.log('Document data:', documentData);

      // Create the document
      const documentRecord = new this.PropertyDocuments(documentData);
      const savedDocument = await documentRecord.save();
      console.log('Created document document:', savedDocument._id);

      // Then update the property with the reference and set is_active to true
      const updatedProperty = await this.Property.findByIdAndUpdate(
        propertyId,
        { $set: { documents_id: savedDocument._id, property_status: 'Active' } },
        { new: true, runValidators: true }
      );

      if (!updatedProperty) {
        throw new Error('Property not found');
      }

      return {
        success: true,
        data: updatedProperty,
        message: 'Property documents updated successfully'
      };
    } catch (error) {
      console.error('Error in updatePropertyDocuments:', error);
      throw new Error(`Failed to update property documents: ${error.message}`);
    }
  }

  /**
   * Update property documents with mixed data (existing + new documents)
   * @param {string} propertyId - Property ID
   * @param {Object} documentsData - Documents data object with existing documents and new files
   * @returns {Promise<Object>} Updated property object
   */
  async updatePropertyDocumentsMixed(propertyId, documentsData) {
          try {
            console.log('Service updatePropertyDocumentsMixed called with:', { propertyId, documentsData });
            
            const { existing_documents, files, file_types } = documentsData;
      let allDocuments = [];

      // Validate existing documents data
      if (existing_documents && Array.isArray(existing_documents)) {
        // Validate each existing document has required fields
        for (let i = 0; i < existing_documents.length; i++) {
          const doc = existing_documents[i];
          if (!doc.document_name || !doc.document_type || !doc.file_url) {
            throw new Error(`Existing document at index ${i} is missing required fields (document_name, document_type, file_url)`);
          }
        }
        
        // Add existing documents to the array
        allDocuments = existing_documents.map((doc, index) => ({
          document_name: doc.document_name,
          document_type: doc.document_type,
          download_count: doc.download_count || 0,
          file_name: doc.file_name || doc.document_name,
          file_size: doc.file_size || 0,
          file_url: doc.file_url,
          mime_type: doc.mime_type || 'application/pdf',
          upload_status: doc.upload_status || 'Completed',
          uploaded_at: doc.uploaded_at || new Date(),
          _id: doc._id
        }));
      }

      // Validate that document types are provided for all new files
      if (files && files.length > 0) {
        if (!file_types || file_types.length === 0) {
          throw new Error('File types are required when uploading new documents');
        }
        
        if (file_types.length !== files.length) {
          throw new Error('Number of file types must match number of new files');
        }
      }

      // Process new files from CloudinaryStorage (files are already uploaded)
      if (files && files.length > 0) {
        console.log('Processing new files from CloudinaryStorage:', files.length);
        
        const newUploadedDocuments = files.map((file, index) => ({
          secure_url: file.path, // CloudinaryStorage provides path as the URL
          original_filename: file.originalname,
          bytes: file.size,
          format: file.mimetype.split('/')[1] || 'pdf',
          public_id: file.filename
        }));
        
        // Add new documents to the array
        const newDocuments = newUploadedDocuments.map((upload, index) => ({
          document_name: upload.original_filename || `new_document_${index + 1}`,
          document_type: file_types[index] || 'Other',
          download_count: 0,
          file_name: upload.original_filename || `new_document_${index + 1}`,
          file_size: upload.bytes,
          file_url: upload.secure_url,
          mime_type: upload.format === 'pdf' ? 'application/pdf' : `application/${upload.format}`,
          upload_status: 'Completed',
          uploaded_at: new Date()
        }));

        allDocuments = [...allDocuments, ...newDocuments];
        console.log('Processed new documents:', newDocuments.length);
      }

      // Ensure at least one document exists
      if (allDocuments.length === 0) {
        throw new Error('At least one document is required');
      }

      // Prepare document data
      const documentData = {
        property_id: propertyId,
        documents: allDocuments
      };

      console.log('Creating document document with mixed data:', {
        total_documents: allDocuments.length,
        existing_documents: existing_documents?.length || 0,
        new_documents: files?.length || 0
      });

      // Always create new document document
      const documentRecord = new this.PropertyDocuments(documentData);
      const savedDocument = await documentRecord.save();
      console.log('Created document document:', savedDocument._id);

      // Update the property with the reference and set is_active to true
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      property.documents_id = savedDocument._id;
      property.is_active = true;
      await property.save();

      // Get the property with populated documents
      const propertyWithDocuments = await this.Property.findById(propertyId)
        .populate('documents_id');

      return {
        success: true,
        data: propertyWithDocuments,
        message: 'Property documents updated successfully with mixed data'
      };
    } catch (error) {
      console.error('Error in updatePropertyDocumentsMixed:', error);
      throw new Error(`Failed to update property documents with mixed data: ${error.message}`);
    }
  }

  /**
   * Update property location
   * @param {string} propertyId - Property ID
   * @param {Object} locationData - Location data object
   * @returns {Promise<Object>} Updated property object
   */
  async updatePropertyLocation(propertyId, locationData) {
    try {
      console.log('Service updatePropertyLocation called with:', { propertyId, locationData });
      
      // Check if property exists
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Always create new location document with property_id
      const locationDocument = new this.PropertyLocation({
        property_id: propertyId,
        ...locationData
      });
      const savedLocation = await locationDocument.save();
      console.log('Created location document:', savedLocation._id);

      // Update the property with the reference
      property.location_id = savedLocation._id;
      await property.save();

      // Get the property with populated location
      const propertyWithLocation = await this.Property.findById(propertyId)
        .populate('location_id');

      return {
        success: true,
        data: propertyWithLocation,
        message: 'Property location updated successfully'
      };
    } catch (error) {
      console.error('Error in updatePropertyLocation:', error);
      throw new Error(`Failed to update property location: ${error.message}`);
    }
  }

  /**
   * Update property virtual tours
   * @param {string} propertyId - Property ID
   * @param {Object} virtualToursData - Virtual tours data object
   * @returns {Promise<Object>} Updated property object
   */
  async updatePropertyVirtualTours(propertyId, virtualToursData) {
    try {
      // Check if property exists
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Create the virtual tour document with property_id
      const virtualTourDocument = new this.PropertyVirtualTours({
        property_id: propertyId,
        ...virtualToursData
      });
      const savedVirtualTour = await virtualTourDocument.save();

      // Update the property with the reference
      property.virtual_tours_id = savedVirtualTour._id;
      await property.save();

      // Get the property with populated virtual tours
      const propertyWithVirtualTours = await this.Property.findById(propertyId)
        .populate('virtual_tours_id');

      return {
        success: true,
        data: propertyWithVirtualTours,
        message: 'Property virtual tours updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property virtual tours: ${error.message}`);
    }
  }

  /**
   * Update property features
   * @param {string} propertyId - Property ID
   * @param {Object} featuresData - Features data object
   * @returns {Promise<Object>} Updated property object
   */
  async updatePropertyFeatures(propertyId, featuresData) {
    try {
      // Check if property exists
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Create the features document with property_id
      const featuresDocument = new this.PropertyFeatures({
        property_id: propertyId,
        ...featuresData
      });
      const savedFeatures = await featuresDocument.save();

      // Update the property with the reference
      property.features_id = savedFeatures._id;
      await property.save();

      // Get the property with populated features
      const propertyWithFeatures = await this.Property.findById(propertyId)
        .populate('features_id');

      return {
        success: true,
        data: propertyWithFeatures,
        message: 'Property features updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property features: ${error.message}`);
    }
  }

  /**
   * Get all properties with pagination and filtering
   * @param {Object} queryParams - Query parameters for filtering and pagination
   * @returns {Promise<Object>} Paginated properties list
   */
  async getAllProperties(queryParams = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        property_type,
        sale_status,
        town_city,
        postcode,
        min_size,
        max_size,
        is_active = true,
        is_featured,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = queryParams;

      // Build filter object
      const filter = { 
        is_active,
        deleted_at: null  // Exclude soft-deleted properties
      };
      
      if (property_type) {
        filter['general_details.property_type'] = property_type;
      }
      
      if (sale_status) {
        filter['general_details.sale_status'] = sale_status;
      }
      
      if (town_city) {
        filter['general_details.town_city'] = new RegExp(town_city, 'i');
      }
      
      if (postcode) {
        filter['general_details.postcode'] = new RegExp(postcode, 'i');
      }
      
      if (min_size) {
        filter['general_details.size_minimum'] = { $gte: parseInt(min_size) };
      }
      
      if (max_size) {
        filter['general_details.size_maximum'] = { $lte: parseInt(max_size) };
      }
      
      if (is_featured !== undefined) {
        filter.is_featured = is_featured === 'true';
      }

      // Build sort object
      const sort = {};
      sort[sort_by] = sort_order === 'desc' ? -1 : 1;

      // Execute paginated query with population
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: [
          { path: 'listed_by', select: 'first_name last_name email phone' },
          { path: 'business_rates_id' },
          { path: 'descriptions_id' },
          { path: 'sale_types_id' },
          { path: 'images_id' },
          { path: 'documents_id' },
          { path: 'location_id' },
          { path: 'virtual_tours_id' },
          { path: 'features_id' }
        ]
      };

      const result = await this.Property.paginate(filter, options);

      return {
        success: true,
        data: {
          properties: result.docs,
          pagination: {
            current_page: result.page,
            total_pages: result.totalPages,
            total_documents: result.totalDocs,
            has_next_page: result.hasNextPage,
            has_prev_page: result.hasPrevPage,
            limit: result.limit
          }
        },
        message: 'Properties retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get properties: ${error.message}`);
    }
  }

  /**
   * Get properties by agent ID
   * @param {string} agentId - Agent ID
   * @param {Object} queryParams - Query parameters for filtering and pagination
   * @returns {Promise<Object>} Agent's properties list
   */
  async getPropertiesByAgentId(agentId, queryParams = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        property_type,
        sale_status,
        is_active = true,
        is_featured,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = queryParams;

      // Build filter object
      const filter = { 
        listed_by: agentId,
        is_active,
        deleted_at: null  // Exclude soft-deleted properties
      };
      
      if (property_type) {
        filter['general_details.property_type'] = property_type;
      }
      
      if (sale_status) {
        filter['general_details.sale_status'] = sale_status;
      }
      
      if (is_featured !== undefined) {
        filter.is_featured = is_featured === 'true';
      }

      // Build sort object
      const sort = {};
      sort[sort_by] = sort_order === 'desc' ? -1 : 1;

      // Execute paginated query with population
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: [
          { path: 'business_rates_id' },
          { path: 'descriptions_id' },
          { path: 'sale_types_id' },
          { path: 'images_id' },
          { path: 'documents_id' },
          { path: 'location_id' },
          { path: 'virtual_tours_id' },
          { path: 'features_id' }
        ]
      };

      const result = await this.Property.paginate(filter, options);

      return {
        success: true,
        data: {
          properties: result.docs,
          pagination: {
            current_page: result.page,
            total_pages: result.totalPages,
            total_documents: result.totalDocs,
            has_next_page: result.hasNextPage,
            has_prev_page: result.hasPrevPage,
            limit: result.limit
          }
        },
        message: 'Agent properties retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get agent properties: ${error.message}`);
    }
  }

  /**
   * Get property by ID
   * @param {string} propertyId - Property ID
   * @returns {Promise<Object>} Property details
   */
  async getPropertyById(propertyId) {
    try {
      const property = await this.Property.findById(propertyId)
        .populate('listed_by', 'first_name last_name email phone company_name')
        .populate('business_rates_id')
        .populate('descriptions_id')
        .populate('sale_types_id')
        .populate('images_id')
        .populate('documents_id')
        .populate('location_id')
        .populate('virtual_tours_id')
        .populate('features_id');

      if (!property) {
        throw new Error('Property not found');
      }

      // Check if property is soft-deleted
      if (property.deleted_at) {
        throw new Error('Property not found');
      }

      return {
        success: true,
        data: property,
        message: 'Property retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get property: ${error.message}`);
    }
  }

  /**
   * Update property general details
   * @param {string} propertyId - Property ID
   * @param {Object} generalDetails - General details to update
   * @returns {Promise<Object>} Updated property object
   */
  async updatePropertyGeneralDetails(propertyId, generalDetails) {
    try {
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Update only the provided fields in general_details
      this.updateObjectFields(property, generalDetails);
      
      const updatedProperty = await property.save();

      return {
        success: true,
        data: updatedProperty,
        message: 'Property general details updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property general details: ${error.message}`);
    }
  }

  // /**
  //  * Update property EPC details
  //  * @param {string} propertyId - Property ID
  //  * @param {Object} epcData - EPC data to update
  //  * @returns {Promise<Object>} Updated property object
  //  */
  // async updatePropertyEPC(propertyId, epcData) {
  //   try {
  //     const updatedProperty = await this.Property.findByIdAndUpdate(
  //       propertyId,
  //       { $set: { epc: epcData } },
  //       { new: true, runValidators: true }
  //     );

  //     if (!updatedProperty) {
  //       throw new Error('Property not found');
  //     }

  //     return {
  //       success: true,
  //       data: updatedProperty,
  //       message: 'Property EPC updated successfully'
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to update property EPC: ${error.message}`);
  //   }
  // }

  // /**
  //  * Update property council tax details
  //  * @param {string} propertyId - Property ID
  //  * @param {Object} councilTaxData - Council tax data to update
  //  * @returns {Promise<Object>} Updated property object
  //  */
  // async updatePropertyCouncilTax(propertyId, councilTaxData) {
  //   try {
  //     const updatedProperty = await this.Property.findByIdAndUpdate(
  //       propertyId,
  //       { $set: { council_tax: councilTaxData } },
  //       { new: true, runValidators: true }
  //     );

  //     if (!updatedProperty) {
  //       throw new Error('Property not found');
  //     }

  //     return {
  //       success: true,
  //       data: updatedProperty,
  //       message: 'Property council tax updated successfully'
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to update property council tax: ${error.message}`);
  //   }
  // }

  // /**
  //  * Update property rateable value
  //  * @param {string} propertyId - Property ID
  //  * @param {number} rateableValue - Rateable value to update
  //  * @returns {Promise<Object>} Updated property object
  //  */
  // async updatePropertyRateableValue(propertyId, rateableValue) {
  //   try {
  //     const updatedProperty = await this.Property.findByIdAndUpdate(
  //       propertyId,
  //       { $set: { rateable_value: rateableValue } },
  //       { new: true, runValidators: true }
  //     );

  //     if (!updatedProperty) {
  //       throw new Error('Property not found');
  //     }

  //     return {
  //       success: true,
  //       data: updatedProperty,
  //       message: 'Property rateable value updated successfully'
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to update property rateable value: ${error.message}`);
  //   }
  // }

  // /**
  //  * Update property planning details
  //  * @param {string} propertyId - Property ID
  //  * @param {Object} planningData - Planning data to update
  //  * @returns {Promise<Object>} Updated property object
  //  */
  // async updatePropertyPlanning(propertyId, planningData) {
  //   try {
  //     const updatedProperty = await this.Property.findByIdAndUpdate(
  //       propertyId,
  //       { $set: { planning: planningData } },
  //       { new: true, runValidators: true }
  //     );

  //     if (!updatedProperty) {
  //       throw new Error('Property not found');
  //     }

  //     return {
  //       success: true,
  //       data: updatedProperty,
  //       message: 'Property planning details updated successfully'
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to update property planning: ${error.message}`);
  //   }
  // }

  // /**
  //  * Update property status (is_active, is_featured, is_verified)
  //  * @param {string} propertyId - Property ID
  //  * @param {Object} statusData - Status data to update
  //  * @returns {Promise<Object>} Updated property object
  //  */
  // async updatePropertyStatus(propertyId, statusData) {
  //   try {
  //     const updatedProperty = await this.Property.findByIdAndUpdate(
  //       propertyId,
  //       { $set: statusData },
  //       { new: true, runValidators: true }
  //     );

  //     if (!updatedProperty) {
  //       throw new Error('Property not found');
  //     }

  //     return {
  //       success: true,
  //       data: updatedProperty,
  //       message: 'Property status updated successfully'
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to update property status: ${error.message}`);
  //   }
  // }

  // /**
  //  * Update property SEO fields
  //  * @param {string} propertyId - Property ID
  //  * @param {Object} seoData - SEO data to update
  //  * @returns {Promise<Object>} Updated property object
  //  */
  // async updatePropertySEO(propertyId, seoData) {
  //   try {
  //     const updatedProperty = await this.Property.findByIdAndUpdate(
  //       propertyId,
  //       { $set: seoData },
  //       { new: true, runValidators: true }
  //     );

  //     if (!updatedProperty) {
  //       throw new Error('Property not found');
  //     }

  //     return {
  //       success: true,
  //       data: updatedProperty,
  //       message: 'Property SEO updated successfully'
  //     };
  //   } catch (error) {
  //     throw new Error(`Failed to update property SEO: ${error.message}`);
  //   }
  // }

  /**
   * Update business rates by reference ID
   * @param {string} businessRatesId - Business rates ID
   * @param {Object} businessRatesData - Business rates data to update
   * @returns {Promise<Object>} Updated business rates object
   */
  async updateBusinessRatesById(businessRatesId, businessRatesData) {
    try {
      const businessRates = await this.BusinessRates.findById(businessRatesId);
      if (!businessRates) {
        throw new Error('Business rates not found');
      }

      // Update only the provided fields
      this.updateObjectFields(businessRates, businessRatesData);
      
      const updatedBusinessRates = await businessRates.save();

      return {
        success: true,
        data: updatedBusinessRates,
        message: 'Business rates updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update business rates: ${error.message}`);
    }
  }

  /**
   * Update descriptions by reference ID
   * @param {string} descriptionsId - Descriptions ID
   * @param {Object} descriptionsData - Descriptions data to update
   * @returns {Promise<Object>} Updated descriptions object
   */
  async updateDescriptionsById(descriptionsId, descriptionsData) {
    try {
      const descriptions = await this.Descriptions.findById(descriptionsId);
      if (!descriptions) {
        throw new Error('Descriptions not found');
      }

      // Update only the provided fields
      this.updateObjectFields(descriptions, descriptionsData);
      
      const updatedDescriptions = await descriptions.save();

      return {
        success: true,
        data: updatedDescriptions,
        message: 'Descriptions updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update descriptions: ${error.message}`);
    }
  }

  /**
   * Update sale types by reference ID
   * @param {string} saleTypesId - Sale types ID
   * @param {Object} saleTypesData - Sale types data to update
   * @returns {Promise<Object>} Updated sale types object
   */
  async updateSaleTypesById(saleTypesId, saleTypesData) {
    try {
      const saleTypes = await this.SaleTypes.findById(saleTypesId);
      if (!saleTypes) {
        throw new Error('Sale types not found');
      }

      // Update only the provided fields
      this.updateObjectFields(saleTypes, saleTypesData);
      
      const updatedSaleTypes = await saleTypes.save();

      return {
        success: true,
        data: updatedSaleTypes,
        message: 'Sale types updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update sale types: ${error.message}`);
    }
  }

  // /**
  //  * Update property images by reference ID
  //  * @param {string} imagesId - Images ID
  //  * @param {Object} imagesData - Images data to update
  //  * @returns {Promise<Object>} Updated images object
  //  */
  async updatePropertyImagesById(imagesId, imagesData) {
    try {
      const updatedImages = await this.PropertyImages.findByIdAndUpdate(
        imagesId,
        { $set: imagesData },
        { new: true, runValidators: true }
      );

      if (!updatedImages) {
        throw new Error('Property images not found');
      }

      return {
        success: true,
        data: updatedImages,
        message: 'Property images updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property images: ${error.message}`);
    }
  }

  // /**
  //  * Update property documents by reference ID
  //  * @param {string} documentsId - Documents ID
  //  * @param {Object} documentsData - Documents data to update
  //  * @returns {Promise<Object>} Updated documents object
  //  */
  async updatePropertyDocumentsById(documentsId, documentsData) {
    try {
      const updatedDocuments = await this.PropertyDocuments.findByIdAndUpdate(
        documentsId,
        { $set: documentsData },
        { new: true, runValidators: true }
      );

      if (!updatedDocuments) {
        throw new Error('Property documents not found');
      }

      return {
        success: true,
        data: updatedDocuments,
        message: 'Property documents updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property documents: ${error.message}`);
    }
  }

  /**
   * Update property location by reference ID
   * @param {string} locationId - Location ID
   * @param {Object} locationData - Location data to update
   * @returns {Promise<Object>} Updated location object
   */
  async updatePropertyLocationById(locationId, locationData) {
    try {
      const location = await this.PropertyLocation.findById(locationId);
      if (!location) {
        throw new Error('Property location not found');
      }

      // Update only the provided fields
      this.updateObjectFields(location, locationData);
      
      const updatedLocation = await location.save();

      return {
        success: true,
        data: updatedLocation,
        message: 'Property location updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property location: ${error.message}`);
    }
  }

  /**
   * Update property virtual tours by reference ID
   * @param {string} virtualToursId - Virtual tours ID
   * @param {Object} virtualToursData - Virtual tours data to update
   * @returns {Promise<Object>} Updated virtual tours object
   */
  async updatePropertyVirtualToursById(virtualToursId, virtualToursData) {
    try {
      const virtualTours = await this.PropertyVirtualTours.findById(virtualToursId);
      if (!virtualTours) {
        throw new Error('Property virtual tours not found');
      }

      // Update only the provided fields
      this.updateObjectFields(virtualTours, virtualToursData);
      
      const updatedVirtualTours = await virtualTours.save();

      return {
        success: true,
        data: updatedVirtualTours,
        message: 'Property virtual tours updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property virtual tours: ${error.message}`);
    }
  }

  /**
   * Update property features by reference ID
   * @param {string} featuresId - Features ID
   * @param {Object} featuresData - Features data to update
   * @returns {Promise<Object>} Updated features object
   */
  async updatePropertyFeaturesById(featuresId, featuresData) {
    try {
      const features = await this.PropertyFeatures.findById(featuresId);
      if (!features) {
        throw new Error('Property features not found');
      }

      // Update only the provided fields
      this.updateObjectFields(features, featuresData);
      
      const updatedFeatures = await features.save();

      return {
        success: true,
        data: updatedFeatures,
        message: 'Property features updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update property features: ${error.message}`);
    }
  }

  // ========== PROPERTY QUERY METHODS ==========

  /**
   * Create a property query
   * @param {Object} queryData - Query data object
   * @param {string} propertyId - Property ID
   * @param {string} agentId - Agent ID from property or property itself
   * @param {string} userId - User ID from headers
   * @returns {Promise<Object>} Created query object
   */
  async createPropertyQuery(queryData, propertyId, agentId, userId) {
    try {
      // Verify property exists
      const property = await this.Property.findById(propertyId);
      if (!property) {
        throw new Error('Property not found');
      }

      // Use agent ID from property if not provided or property itself if no agent ID is provided
      const finalAgentId = agentId || property.listed_by;

      const queryPayload = {
        ...queryData,
        property_id: propertyId,
        agent_id: finalAgentId,
        user_id: userId
      };

      const propertyQuery = new this.PropertyQuery(queryPayload);
      const savedQuery = await propertyQuery.save();

      // Populate the query with property and user details
      const populatedQuery = await this.PropertyQuery.findById(savedQuery._id)
        .populate('property_id', 'general_details.building_name general_details.address general_details.town_city')
        .populate('agent_id', 'first_name last_name email phone company_name')
        .populate('user_id', 'first_name last_name email');

      return {
        success: true,
        data: populatedQuery,
        message: 'Property query created successfully'
      };
    } catch (error) {
      throw new Error(`Failed to create property query: ${error.message}`);
    }
  }

  /**
   * Get queries by agent ID
    * @param {string} agentId - Agent ID
   * @param {Object} queryParams - Query parameters for pagination
   * @returns {Promise<Object>} Agent's queries list
   */
  async getQueriesByAgentId(agentId, queryParams = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = queryParams;

      // Build filter object
      const filter = { 
        agent_id: agentId,
        deleted_at: null
      };

      // Build sort object
      const sort = {};
      sort[sort_by] = sort_order === 'desc' ? -1 : 1;

      // Execute paginated query with population
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: [
          { path: 'property_id', select: 'general_details.building_name general_details.address general_details.town_city general_details.property_type' },
          { path: 'user_id', select: 'first_name last_name email phone' }
        ]
      };

      const result = await this.PropertyQuery.paginate(filter, options);

      return {
        success: true,
        data: {
          queries: result.docs,
          pagination: {
            current_page: result.page,
            total_pages: result.totalPages,
            total_documents: result.totalDocs,
            has_next_page: result.hasNextPage,
            has_prev_page: result.hasPrevPage,
            limit: result.limit
          }
        },
        message: 'User queries retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get user queries: ${error.message}`);
    }
  }

  /**
   * Get queries by property ID
   * @param {string} propertyId - Property ID
   * @param {Object} queryParams - Query parameters for pagination
   * @returns {Promise<Object>} Property's queries list
   */
  async getQueriesByPropertyId(propertyId, queryParams = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = queryParams;

      // Build filter object
      const filter = { 
        property_id: propertyId,
        deleted_at: null
      };

      // Build sort object
      const sort = {};
      sort[sort_by] = sort_order === 'desc' ? -1 : 1;

      // Execute paginated query with population
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: [
          { path: 'agent_id', select: 'first_name last_name email phone company_name' }, // TODO: Change to user_id if needed
          { path: 'user_id', select: 'first_name last_name email phone' } // TODO: Change to user_id if needed
        ]
      };

      const result = await this.PropertyQuery.paginate(filter, options);

      return {
        success: true,
        data: {
          queries: result.docs,
          pagination: {
            current_page: result.page,
            total_pages: result.totalPages,
            total_documents: result.totalDocs,
            has_next_page: result.hasNextPage,
            has_prev_page: result.hasPrevPage,
            limit: result.limit
          }
        },
        message: 'Property queries retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get property queries: ${error.message}`);
    }
  }

  /**
   * Get queries created by user
   * @param {string} userId - User ID
   * @param {Object} queryParams - Query parameters for pagination
   * @returns {Promise<Object>} User's queries list
   */
  async getQueriesByUserId(userId, queryParams = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = queryParams;

      // Build filter object
      const filter = { 
        user_id: userId,
        deleted_at: null
      };

      // Build sort object
      const sort = {};
      sort[sort_by] = sort_order === 'desc' ? -1 : 1;

      // Execute paginated query with population
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: [
          { path: 'property_id', select: 'general_details.building_name general_details.address general_details.town_city general_details.property_type' },
          { path: 'agent_id', select: 'first_name last_name email phone company_name' }
        ]
      };

      const result = await this.PropertyQuery.paginate(filter, options);

      return {
        success: true,
        data: {
          queries: result.docs,
          pagination: {
            current_page: result.page,
            total_pages: result.totalPages,
            total_documents: result.totalDocs,
            has_next_page: result.hasNextPage,
            has_prev_page: result.hasPrevPage,
            limit: result.limit
          }
        },
        message: 'User queries retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get user queries: ${error.message}`);
    }
  }

  /**
   * Get single query by ID
   * @param {string} queryId - Query ID
   * @returns {Promise<Object>} Query details
   */
  async getQueryById(queryId) {
    try {
      const query = await this.PropertyQuery.findById(queryId)
        .populate('property_id', 'general_details.building_name general_details.address general_details.town_city general_details.property_type')
        .populate('agent_id', 'first_name last_name email phone company_name') // TODO: Change to user_id if needed
        .populate('user_id', 'first_name last_name email phone'); // TODO: Change to user_id if needed
      
      if (!query) {
        throw new Error('Query not found');
      }

      return {
        success: true,
        data: query,
        message: 'Query retrieved successfully'
      };
    } catch (error) {
      throw new Error(`Failed to get query: ${error.message}`);
    }
  }

  /**
   * Update query status (for agents to mark as read/responded)
   * @param {string} queryId - Query ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated query object
   */
  async updateQueryStatus(queryId, updateData) {
    try {
      const updatedQuery = await this.PropertyQuery.findByIdAndUpdate(
        queryId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedQuery) {
        throw new Error('Query not found');
      }

      return {
        success: true,
        data: updatedQuery,
        message: 'Query status updated successfully'
      };
    } catch (error) {
      throw new Error(`Failed to update query status: ${error.message}`);
    }
  }

  /**
   * Delete query (soft delete)
   * @param {string} queryId - Query ID
   * @returns {Promise<Object>} Success message
   */
  async deleteQuery(queryId) {
    try {
      const updatedQuery = await this.PropertyQuery.findByIdAndUpdate(
        queryId,
        { $set: { deleted_at: new Date() } },
        { new: true }
      );

      if (!updatedQuery) {
        throw new Error('Query not found');
      }

      return {
        success: true,
        message: 'Query deleted successfully'
      };
    } catch (error) {
      throw new Error(`Failed to delete query: ${error.message}`);
    }
  }

  /**
   * Delete a property and all related data from database
   * @param {string} propertyId - Property ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deletion result
   */
    async deleteProperty(propertyId, userId) {
    try {
      // Check if property exists and belongs to the user
      const property = await Property.findOne({
        _id: propertyId,
        listed_by: userId,
        deleted_at: null
      });

      if (!property) {
        throw new Error('Property not found or you do not have permission to delete it');
      }
      
      if(property){

              // Soft delete business rates
              if (property.business_rates_id) {
                  await BusinessRates.findByIdAndUpdate(property.business_rates_id, { deleted_at: new Date() })
              }

              // Soft delete descriptions
              if (property.descriptions_id) {
                  await Descriptions.findByIdAndUpdate(property.descriptions_id, { deleted_at: new Date() })
              }

              // Soft delete sale types
              if (property.sale_types_id) {
                  await SaleTypes.findByIdAndUpdate(property.sale_types_id, { deleted_at: new Date() })
              }

              // Soft delete property images (photos)
              if (property.images_id) {
                  await PropertyImages.findByIdAndUpdate(property.images_id, { deleted_at: new Date() })
              }

              // Soft delete property documents
              if (property.documents_id) {
                  await PropertyDocuments.findByIdAndUpdate(property.documents_id, { deleted_at: new Date() })
              }

              // Soft delete property location
              if (property.location_id) {
                  await PropertyLocation.findByIdAndUpdate(property.location_id, { deleted_at: new Date() })
              }

              // Soft delete property virtual tours
              if (property.virtual_tours_id) {
                  await PropertyVirtualTours.findByIdAndUpdate(property.virtual_tours_id, { deleted_at: new Date() })
              }

              // Soft delete property features
              if (property.features_id) {
                  await PropertyFeatures.findByIdAndUpdate(property.features_id, { deleted_at: new Date() })
              }

              // Finally soft delete the main property
        await Property.findByIdAndUpdate(propertyId, { deleted_at: new Date() });

        return {
          success: true,
          message: 'Property and all related data deleted successfully'
        };
      } else {
        throw new Error('Property not found');
       }

    } catch (error) {
      throw new Error(`Failed to delete property: ${error.message}`);
    }
  }
}

export default UserService;
