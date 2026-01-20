import { FeaturesService } from '../services/features.services.js';
import { MESSAGES } from '../../../../config/constant.config.js';

export class FeaturesController {
  constructor() {
    this.featuresService = new FeaturesService();
  }

  // ==================== USER MANAGEMENT CONTROLLERS ====================

  /**
   * Get list of all users with pagination and filters
   */
  getUsersList = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, role, search, is_active, user_status, sort_by = 'createdAt', sort_order = 'desc' } = req.query;
      
      const filters = {
        role,
        search,
        is_active: is_active !== undefined ? is_active === 'true' : undefined,
        user_status,
      };

      const sortOptions = {
        [sort_by]: sort_order === 'desc' ? -1 : 1
      };

      const result = await this.featuresService.getUsersList({
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        sortOptions
      });

      res.status(200).json({
        status: true,
        message: MESSAGES.USERS_FETCHED_SUCCESSFULLY || 'Users fetched successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get list of users with role "user"
   */
  getUsersListByRole = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search, is_active, sort_by = 'createdAt', sort_order = 'desc' } = req.query;
      
      const filters = {
        role: 'user',
        search,
        is_active: is_active !== undefined ? is_active === 'true' : undefined,
      };

      const sortOptions = {
        [sort_by]: sort_order === 'desc' ? -1 : 1
      };

      const result = await this.featuresService.getUsersList({
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        sortOptions
      });

      res.status(200).json({
        status: true,
        message: MESSAGES.USERS_FETCHED_SUCCESSFULLY || 'Users fetched successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get list of users with role "agent"
   */
  getAgentsList = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search, is_active, sort_by = 'createdAt', sort_order = 'desc' } = req.query;
      
      const filters = {
        role: 'agent',
        search,
        is_active: is_active !== undefined ? is_active === 'true' : undefined,
      };

      const sortOptions = {
        [sort_by]: sort_order === 'desc' ? -1 : 1
      };

      const result = await this.featuresService.getUsersList({
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        sortOptions
      });

      res.status(200).json({
        status: true,
        message: MESSAGES.AGENTS_FETCHED_SUCCESSFULLY || 'Agents fetched successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get specific user by ID
   */
  getUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const user = await this.featuresService.getUserById(id);
      
      res.status(200).json({
        status: true,
        message: MESSAGES.USER_FETCHED_SUCCESSFULLY || 'User fetched successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Soft delete user
   */
  deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      await this.featuresService.deleteUser(id);
      
      res.status(200).json({
        status: true,
        message: MESSAGES.USER_DELETED_SUCCESSFULLY || 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user behavior status
   */
  updateUserStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { user_status, status_reason } = req.body;
      const adminId = req.user.id;
      
      const statusData = { user_status, status_reason };
      const updatedUser = await this.featuresService.updateUserStatus(id, statusData, adminId);
      
      res.status(200).json({
        status: true,
        message: MESSAGES.USER_STATUS_UPDATED_SUCCESSFULLY || 'User status updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all properties listed by a specific user
   */
  getUserProperties = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 10, status, property_type } = req.query;
      
      const filters = {
        status,
        property_type
      };

      const result = await this.featuresService.getUserProperties(id, {
        page: parseInt(page),
        limit: parseInt(limit),
        filters
      });
      
      res.status(200).json({
        status: true,
        message: MESSAGES.USER_PROPERTIES_FETCHED_SUCCESSFULLY || 'User properties fetched successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // ==================== PROPERTY MANAGEMENT CONTROLLERS ====================

  /**
   * Get list of all properties with pagination and filters
   */
  getPropertiesList = async (req, res, next) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        property_type, 
        sale_status, 
        town_city, 
        postcode,
        is_active,
        is_featured,
        is_verified,
        search,
        sort_by = 'createdAt', 
        sort_order = 'desc' 
      } = req.query;
      
      const filters = {
        property_type,
        sale_status,
        town_city,
        postcode,
        is_active: is_active !== undefined ? is_active === 'true' : undefined,
        is_featured: is_featured !== undefined ? is_featured === 'true' : undefined,
        is_verified: is_verified !== undefined ? is_verified === 'true' : undefined,
        search
      };

      const sortOptions = {
        [sort_by]: sort_order === 'desc' ? -1 : 1
      };

      const result = await this.featuresService.getPropertiesList({
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        sortOptions
      });

      res.status(200).json({
        status: true,
        message: MESSAGES.PROPERTIES_FETCHED_SUCCESSFULLY || 'Properties fetched successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get specific property by ID
   */
  getPropertyById = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const property = await this.featuresService.getPropertyById(id);
      
      res.status(200).json({
        status: true,
        message: MESSAGES.PROPERTY_FETCHED_SUCCESSFULLY || 'Property fetched successfully',
        data: property
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Soft delete property
   */
  deleteProperty = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      await this.featuresService.deleteProperty(id);
      
      res.status(200).json({
        status: true,
        message: MESSAGES.PROPERTY_DELETED_SUCCESSFULLY || 'Property deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get properties listed by users with role "user" and property_status "Inactive"
   */
  getInactivePropertiesByUsers = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, sort_by = 'createdAt', sort_order = 'desc' } = req.query;

      console.log(page, limit, sort_by, sort_order);
      
      const sortOptions = {
        [sort_by]: sort_order === 'desc' ? -1 : 1
      };

      const result = await this.featuresService.getInactivePropertiesByUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        sortOptions
      });

      res.status(200).json({
        status: true,
        message: MESSAGES.PROPERTIES_FETCHED_SUCCESSFULLY || 'Inactive properties by users fetched successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Activate property by changing property_status to "Active"
   */
  activateProperty = async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const updatedProperty = await this.featuresService.activateProperty(id);
      
      res.status(200).json({
        status: true,
        message: MESSAGES.PROPERTY_ACTIVATED_SUCCESSFULLY || 'Property activated successfully',
        data: updatedProperty
      });
    } catch (error) {
      next(error);
    }
  };

  // ==================== ADMIN DASHBOARD CONTROLLERS ====================

  /**
   * Get admin dashboard overview
   */
  getDashboardStats = async (req, res, next) => {
    try {
      const stats = await this.featuresService.getDashboardStats();
      
      res.status(200).json({
        status: true,
        message: MESSAGES.DASHBOARD_STATS_FETCHED_SUCCESSFULLY || 'Dashboard statistics fetched successfully',
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  // ==================== STATIC PAGES CONTROLLERS ====================

  /**
   * Get general page
   */
  getGeneralPage = async (req, res, next) => {
    try {
      // Get ID from query params or body
      const { id } = req.query || req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID is required in request body or query parameters',
        });
      }
      
      const generalPage = await this.featuresService.getGeneralPageById(id);
      res.status(200).json({
        success: true,
        message: 'General page fetched successfully',
        data: generalPage,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update general page
   */
  updateGeneralPage = async (req, res, next) => {
    try {
      const { id, LegalContent } = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID is required in request body',
        });
      }
      
      const generalPageData = { LegalContent };
      const updatedGeneralPage = await this.featuresService.updateGeneralPage(id, generalPageData);
      
      res.status(200).json({
        success: true,
        message: 'General page updated successfully',
        data: updatedGeneralPage,
      });
    } catch (error) {
      next(error);
    }
  };


}
