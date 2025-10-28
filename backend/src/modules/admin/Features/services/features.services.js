import { MESSAGES, USER_STATUS } from '../../../../config/constant.config.js';
import User from '../../../../models/user.model.js';
import Property from '../../../../models/property.model.js';
import mongoose from 'mongoose';

export class FeaturesService {
  constructor() {
  }

  // ==================== USER MANAGEMENT SERVICES ====================

  /**
   * Get list of all users with pagination and filters
   */
  async getUsersList({ page, limit, filters, sortOptions }) {
    try {
      const query = { deleted_at: null };

      // Apply filters
      if (filters.role) {
        query.role = filters.role;
      }

      if (filters.is_active !== undefined) {
        query.is_active = filters.is_active;
      }

      if (filters.user_status) {
        query.user_status = filters.user_status;
      }

      if (filters.search) {
        query.$or = [
          { firstName: { $regex: filters.search, $options: 'i' } },
          { lastName: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { phone: { $regex: filters.search, $options: 'i' } }
        ];
      }

      const options = {
        page,
        limit,
        sort: sortOptions,
        populate: [
          { path: 'business_details', select: 'business_name business_type' },
          { path: 'status_updated_by', select: 'firstName lastName email' }
        ],
        select: '-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -emailChangeToken -emailChangeExpires'
      };

      const result = await User.paginate(query, options);
      
      return {
        users: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalUsers: result.totalDocs,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          limit: result.limit
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Get specific user by ID
   */
  async getUserById(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const user = await User.findOne({ 
        _id: userId, 
        deleted_at: null 
      })
      .populate('business_details', 'business_name business_type business_address business_phone business_email')
      .select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -emailChangeToken -emailChangeExpires');

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Soft delete user
   */
  async deleteUser(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const user = await User.findOneAndUpdate(
        { _id: userId, deleted_at: null },
        { 
          $set: { 
            deleted_at: new Date(),
            is_active: false 
          } 
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      // Also soft delete all properties listed by this user
      await Property.updateMany(
        { listed_by: userId, deleted_at: null },
        { 
          $set: { 
            deleted_at: new Date(),
            is_active: false 
          } 
        }
      );

      return { message: 'User and associated properties deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  /**
   * Update user behavior status
   */
  async updateUserStatus(userId, statusData, adminId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const { user_status, status_reason } = statusData;

      // Validate status
      if (!Object.values(USER_STATUS).includes(user_status)) {
        throw new Error('Invalid user status provided');
      }

      // Require reason for status changes (except for 'good' and 'excellent' status)
      if (!['excellent', 'good'].includes(user_status) && (!status_reason || status_reason.trim().length === 0)) {
        throw new Error('Status reason is required for status changes');
      }

      const user = await User.findOne({ _id: userId, deleted_at: null });
      
      if (!user) {
        throw new Error('User not found');
      }

      // Update user status
      user.user_status = user_status;
      user.status_updated_by = adminId;
      user.status_updated_at = new Date();
      
      // Update status reason if provided
      if (status_reason) {
        user.status_reason = status_reason;
      }

      // If status is 'banned', also deactivate the user
      if (user_status === USER_STATUS.BANNED) {
        user.is_active = false;
      }

      await user.save();

      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        user_status: user.user_status,
        status_reason: user.status_reason,
        status_updated_at: user.status_updated_at,
        is_active: user.is_active
      };
    } catch (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }
  }

  /**
   * Get all properties listed by a specific user
   */
  async getUserProperties(userId, { page, limit, filters }) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const query = { 
        listed_by: userId, 
        deleted_at: null 
      };

      // Apply filters
      if (filters.status) {
        query['general_details.sale_status'] = filters.status;
      }

      if (filters.property_type) {
        query['general_details.property_type'] = filters.property_type;
      }

      const options = {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'listed_by', select: 'firstName lastName email' },
          { path: 'images_id', select: 'images' },
          { path: 'sale_types_id', select: 'sale_types' }
        ]
      };

      const result = await Property.paginate(query, options);
      
      return {
        properties: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalProperties: result.totalDocs,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          limit: result.limit
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch user properties: ${error.message}`);
    }
  }

  // ==================== PROPERTY MANAGEMENT SERVICES ====================

  /**
   * Get list of all properties with pagination and filters
   */
  async getPropertiesList({ page, limit, filters, sortOptions }) {
    try {
      const query = { deleted_at: null };

      // Apply filters
      if (filters.property_type) {
        query['general_details.property_type'] = filters.property_type;
      }

      if (filters.sale_status) {
        query['general_details.sale_status'] = filters.sale_status;
      }

      if (filters.town_city) {
        query['general_details.town_city'] = { $regex: filters.town_city, $options: 'i' };
      }

      if (filters.postcode) {
        query['general_details.postcode'] = { $regex: filters.postcode, $options: 'i' };
      }

      if (filters.is_active !== undefined) {
        query.is_active = filters.is_active;
      }

      if (filters.is_featured !== undefined) {
        query.is_featured = filters.is_featured;
      }

      if (filters.is_verified !== undefined) {
        query.is_verified = filters.is_verified;
      }

      if (filters.search) {
        query.$or = [
          { 'general_details.building_name': { $regex: filters.search, $options: 'i' } },
          { 'general_details.address': { $regex: filters.search, $options: 'i' } },
          { 'general_details.town_city': { $regex: filters.search, $options: 'i' } },
          { 'general_details.postcode': { $regex: filters.search, $options: 'i' } }
        ];
      }

      const options = {
        page,
        limit,
        sort: sortOptions,
        populate: [
          { path: 'listed_by', select: 'firstName lastName email phone' },
          { path: 'images_id', select: 'images' },
          { path: 'sale_types_id', select: 'sale_types' },
          { path: 'descriptions_id', select: 'descriptions' },
          { path: 'features_id', select: 'features' }
        ]
      };

      const result = await Property.paginate(query, options);
      
      return {
        properties: result.docs,
        pagination: {
          currentPage: result.page,
          totalPages: result.totalPages,
          totalProperties: result.totalDocs,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
          limit: result.limit
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }
  }

  /**
   * Get specific property by ID
   */
  async getPropertyById(propertyId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        throw new Error('Invalid property ID format');
      }

      const property = await Property.findOne({ 
        _id: propertyId, 
        deleted_at: null 
      })
      .populate('listed_by', 'firstName lastName email phone')
      .populate('images_id')
      .populate('documents_id')
      .populate('location_id')
      .populate('virtual_tours_id')
      .populate('features_id')
      .populate('business_rates_id')
      .populate('descriptions_id')
      .populate('sale_types_id')
      .populate('joint_agents_id');

      if (!property) {
        throw new Error('Property not found');
      }

      return property;
    } catch (error) {
      throw new Error(`Failed to fetch property: ${error.message}`);
    }
  }
  /**
   * Soft delete property
   */
  async deleteProperty(propertyId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        throw new Error('Invalid property ID format');
      }

      const property = await Property.findOneAndUpdate(
        { _id: propertyId, deleted_at: null },
        { 
          $set: { 
            deleted_at: new Date(),
            is_active: false 
          } 
        },
        { new: true }
      );

      if (!property) {
        throw new Error('Property not found');
      }

      return { message: 'Property deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete property: ${error.message}`);
    }
  }

  /**
   * Get properties listed by users with role "user" and property_status "Inactive"
   */
  async getInactivePropertiesByUsers({ page, limit, sortOptions }) {
    try {
      const query = { 
        deleted_at: null,
        property_status: 'Inactive'
      };

      const properties = await Property.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Property.countDocuments(query);
      
      return {
        properties: properties,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProperties: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
          limit: limit
        }
      };
    } catch (error) {
      console.error('Error in getInactivePropertiesByUsers:', error);
      throw new Error(`Failed to fetch inactive properties by users: ${error.message}`);
    }
  }

  /**
   * Activate property by changing property_status to "Active"
   */
  async activateProperty(propertyId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        throw new Error('Invalid property ID format');
      }

      const property = await Property.findOneAndUpdate(
        { 
          _id: propertyId, 
          deleted_at: null,
          property_status: 'Inactive' // Only allow activation of inactive properties
        },
        { 
          $set: { 
            property_status: 'Active',
            is_active: true // Also set is_active to true when activating
          } 
        },
        { new: true }
      )
      .populate('listed_by', 'firstName lastName email phone role')
      .populate('images_id', 'images')
      .populate('sale_types_id', 'sale_types')
      .populate('descriptions_id', 'descriptions')
      .populate('features_id', 'features');

      if (!property) {
        throw new Error('Property not found or already active');
      }

      return {
        _id: property._id,
        property_status: property.property_status,
        is_active: property.is_active,
        general_details: property.general_details,
        listed_by: property.listed_by,
        images_id: property.images_id,
        sale_types_id: property.sale_types_id,
        descriptions_id: property.descriptions_id,
        features_id: property.features_id,
        updatedAt: property.updatedAt
      };
    } catch (error) {
      throw new Error(`Failed to activate property: ${error.message}`);
    }
  }

  // ==================== ADMIN DASHBOARD SERVICES ====================

  /**
   * Get admin dashboard overview
   */
  async getDashboardStats() {
    try {
      // User statistics
      const totalUsers = await User.countDocuments({ deleted_at: null });
      const activeUsers = await User.countDocuments({ deleted_at: null, is_active: true });
      const userRoles = await User.aggregate([
        { $match: { deleted_at: null } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Property statistics
      const totalProperties = await Property.countDocuments({ deleted_at: null });
      const activeProperties = await Property.countDocuments({ deleted_at: null, is_active: true });
      const featuredProperties = await Property.countDocuments({ deleted_at: null, is_featured: true });
      const verifiedProperties = await Property.countDocuments({ deleted_at: null, is_verified: true });

      // Recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentUsers = await User.countDocuments({
        deleted_at: null,
        createdAt: { $gte: sevenDaysAgo }
      });

      const recentProperties = await Property.countDocuments({
        deleted_at: null,
        createdAt: { $gte: sevenDaysAgo }
      });

      // Top cities by property count
      const topCities = await Property.aggregate([
        { $match: { deleted_at: null } },
        { $group: { _id: '$general_details.town_city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          roles: userRoles,
          recent: recentUsers
        },
        properties: {
          total: totalProperties,
          active: activeProperties,
          featured: featuredProperties,
          verified: verifiedProperties,
          recent: recentProperties
        },
        topCities
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard statistics: ${error.message}`);
    }
  }
}
