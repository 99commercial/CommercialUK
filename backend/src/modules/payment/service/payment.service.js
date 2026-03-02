import Stripe from 'stripe';
import mongoose from 'mongoose';
import { STRIPE_SECRET_KEY } from '../../../config/env.config.js';
import Subscription from '../../../models/subscription.model.js';
import Property from '../../../models/property.model.js';
import User from '../../../models/user.model.js';
import DiscountCode from '../../../models/discount.code.model.js';
import { emailService } from '../../../emails/auth.email.js';

class PaymentService {
  constructor() {
    this.stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
    this.emailService = new emailService();
  }

  /**
   * Calculate subscription dates and expiration status
   * @returns {Object} Subscription date information
   */
  calculateSubscriptionDates() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Set to start of day
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30); // Add 30 days
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // isExpired is true if today's date equals end date, else false
    const isExpired = today.getTime() === endDate.getTime();
    
    return {
      startDate,
      endDate,
      isExpired,
      reportCount: 3,
    };
  }

  /**
   * Create or update subscription for a user
   * @param {string} userId - User ID
   * @param {string} paymentIntentId - Payment Intent ID
   * @returns {Promise<Object>} Subscription object
   */
  async createOrUpdateSubscription(userId, paymentIntentId) {
    try {
      // Check if subscription already exists for this payment intent
      let subscription = await Subscription.findOne({ paymentIntentId });
      
      if (subscription) {
        // Update existing subscription - only update isExpired based on current date
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(subscription.endDate);
        endDate.setHours(0, 0, 0, 0);
        
        // isExpired is true if today's date equals end date, else false
        subscription.isExpired = today.getTime() === endDate.getTime();
        subscription.status = subscription.isExpired ? 'expired' : 'active';
        await subscription.save();
      } else {
        // Create new subscription
        const { startDate, endDate, isExpired, reportCount } = this.calculateSubscriptionDates();
        
        subscription = await Subscription.create({
          userId,
          paymentIntentId,
          startDate,
          endDate,
          reportCount,
          isExpired,
          listingCount:100,
          status: isExpired ? 'expired' : 'active',
        });
      }
      
      return subscription;
    } catch (error) {
      throw new Error(`Failed to create/update subscription: ${error.message}`);
    }
  }

  /**
   * Create a payment intent
   * @param {Object} data - Payment intent data
   * @param {number} data.amount - Amount in pounds
   * @param {string} data.paymentMethodId - Payment method ID
   * @param {string} data.customerId - Customer ID (optional)
   * @param {Object} data.metadata - Additional metadata
   * @returns {Promise<Object>} Payment intent object
   */
  async createPaymentIntent(data) {
    try {
      const { amount, paymentMethodId, customerId, metadata = {} } = data;

      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const paymentIntentData = {
        amount: Math.round(amount * 100), // Convert to pence
        currency: 'gbp', // Strictly GBP (British Pounds)
        metadata,
        payment_method_types: ['card'], // Only card payments allowed
      };

      if (customerId) {
        paymentIntentData.customer = customerId;
      }

      if (paymentMethodId) {
        paymentIntentData.payment_method = paymentMethodId;
        paymentIntentData.confirmation_method = 'manual';
        paymentIntentData.confirm = true;
      }

      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentData);

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Confirm a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Confirmed payment intent
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethodId, userId) {
    try {
      // First, retrieve the payment intent to check its current status
      const existingPaymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      // Calculate subscription dates
      const { startDate, endDate, isExpired, reportCount } = this.calculateSubscriptionDates();

      // If payment intent is already succeeded, return it without trying to confirm again
      if (existingPaymentIntent.status === 'succeeded') {
        // Create or update subscription for succeeded payment
        let subscription = null;
        if (userId) {
          subscription = await this.createOrUpdateSubscription(userId, paymentIntentId);
        }

        // Update all property with new expiry_date (only if userId is provided)
        if (userId) {
          try {
            const expiryDate = subscription?.endDate || endDate;
            // Use bulk update instead of individual saves for better performance
            await Property.updateMany(
              {
                listed_by: new mongoose.Types.ObjectId(userId),
                deleted_at: null,
              },
              {
                $set: {
                  expiry_date: expiryDate,
                  isExpired: false,
                },
              }
            );
          } catch (propertyError) {
            // Log error but don't fail the payment confirmation
            console.error('Failed to update property expiry date:', propertyError.message);
          }
        }

        return {
          success: true,
          paymentIntent: {
            id: existingPaymentIntent.id,
            status: existingPaymentIntent.status,
            amount: existingPaymentIntent.amount / 100,
            currency: existingPaymentIntent.currency,
            userId: userId || null,
            startDate: subscription?.startDate || startDate,
            endDate: subscription?.endDate || endDate,
            reportCount: subscription?.reportCount || reportCount,
            isExpired: subscription?.isExpired ?? isExpired,
            listingCount: subscription?.listingCount,
          },
        };
      }

      // If payment intent is already processing or requires action, return current status
      if (existingPaymentIntent.status === 'processing' || existingPaymentIntent.status === 'requires_action') {
        return {
          success: true,
          paymentIntent: {
            id: existingPaymentIntent.id,
            status: existingPaymentIntent.status,
            amount: existingPaymentIntent.amount / 100,
            currency: existingPaymentIntent.currency,
            userId: userId || null,
            startDate,
            endDate,
            reportCount,
            isExpired,
          },
        };
      }

      // Only confirm if the payment intent is in a state that can be confirmed
      if (existingPaymentIntent.status === 'requires_payment_method' || existingPaymentIntent.status === 'requires_confirmation') {
        const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
          payment_method: paymentMethodId,
        });

        // If payment succeeded, create or update subscription
        let subscription = null;
        if (paymentIntent.status === 'succeeded' && userId) {
          subscription = await this.createOrUpdateSubscription(userId, paymentIntentId);

          // Update all property with new expiry_date
          try {
            const expiryDate = subscription?.endDate || endDate;
            // Use bulk update instead of individual saves for better performance
            await Property.updateMany(
              {
                listed_by: new mongoose.Types.ObjectId(userId),
                deleted_at: null,
              },
              {
                $set: {
                  expiry_date: expiryDate,
                  isExpired: false,
                },
              }
            );
          } catch (propertyError) {
            // Log error but don't fail the payment confirmation
            console.error('Failed to update property expiry date:', propertyError.message);
          }
        }

        return {
          success: true,
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            userId: userId || null,
            startDate: subscription?.startDate || startDate,
            endDate: subscription?.endDate || endDate,
            reportCount: subscription?.reportCount || reportCount,
            isExpired: subscription?.isExpired ?? isExpired,
            listingCount: subscription?.listingCount,
          },
        };
      }

      // For any other status, return the current state
      return {
        success: true,
        paymentIntent: {
          id: existingPaymentIntent.id,
          status: existingPaymentIntent.status,
          amount: existingPaymentIntent.amount / 100,
          currency: existingPaymentIntent.currency,
          userId: userId || null,
          startDate,
          endDate,
          reportCount,
          isExpired,
        },
      };
    } catch (error) {
      throw new Error(`Failed to confirm payment intent: ${error.message}`);
    }
  }


  /**
   * Retrieve a payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @returns {Promise<Object>} Payment intent object
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          clientSecret: paymentIntent.client_secret,
          metadata: paymentIntent.metadata,
          created: new Date(paymentIntent.created * 1000),
        },
      };
    } catch (error) {
      throw new Error(`Failed to retrieve payment intent: ${error.message}`);
    }
  }

  /**
   * Create a refund
   * @param {string} paymentIntentId - Payment intent ID
   * @param {number} amount - Refund amount (optional, full refund if not provided)
   * @param {string} reason - Refund reason (optional)
   * @returns {Promise<Object>} Refund object
   */
  async createRefund(paymentIntentId, amount = null, reason = null) {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to pence
      }

      if (reason) {
        refundData.reason = reason; // 'duplicate', 'fraudulent', 'requested_by_customer'
      }

      const refund = await this.stripe.refunds.create(refundData);

      return {
        success: true,
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          currency: refund.currency,
          status: refund.status,
          reason: refund.reason,
        },
      };
    } catch (error) {
      throw new Error(`Failed to create refund: ${error.message}`);
    }
  }

  /**
   * Check and update expired subscriptions
   * This should be called daily to update isExpired status
   * @returns {Promise<Object>} Update result
   */
  async checkAndUpdateExpiredSubscriptions() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find all active subscriptions that should be expired
      const subscriptions = await Subscription.find({
        status: 'active',
        isExpired: false,
      });

      let updatedCount = 0;

      for (const subscription of subscriptions) {
        const endDate = new Date(subscription.endDate);
        endDate.setHours(0, 0, 0, 0);

        // If today's date equals end date, mark as expired
        if (today.getTime() === endDate.getTime()) {
          subscription.isExpired = true;
          subscription.status = 'expired';
          await subscription.save();
          updatedCount++;
        }
      }

      return {
        success: true,
        message: `Updated ${updatedCount} expired subscriptions`,
        updatedCount,
      };
    } catch (error) {
      throw new Error(`Failed to check expired subscriptions: ${error.message}`);
    }
  }

  /**
   * Get user subscription
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Subscription object
   */
  async getUserSubscription(userId) {
    try {
      const subscription = await Subscription.findOne({
        userId,
        status: 'active',
      }).sort({ createdAt: -1 });

      if (!subscription) {
        return {
          success: false,
          message: 'No active subscription found',
        };
      }

      // Check and update expiration status
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(subscription.endDate);
      endDate.setHours(0, 0, 0, 0);

      if (today.getTime() === endDate.getTime() && !subscription.isExpired) {
        subscription.isExpired = true;
        subscription.status = 'expired';
        await subscription.save();
      }

      return {
        success: true,
        subscription: {
          userId: subscription.userId,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          reportCount: subscription.reportCount,
          isExpired: subscription.isExpired,
          status: subscription.status,
        },
      };
    } catch (error) {
      throw new Error(`Failed to get user subscription: ${error.message}`);
    }
  }

  /**
   * Confirm a one time payment intent
   * @param {string} paymentIntentId - Payment intent ID
   * @param {string} userId - User ID
   * @param {number} months - Number of months for property expiry
   * @param {string} propertyId - Property ID (optional)
   * @returns {Promise<Object>} Confirmed payment intent
   */
  async confirmPaymentIntentOneTime(paymentIntentId, userId, months, propertyId = null) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        return {
          success: false,
          message: 'Payment intent is not succeeded',
        };
      }

      // Create a new subscription for one-time payment (no endDate)
      if (userId && paymentIntentId) {
        try {
          await Subscription.create({
            userId,
            paymentIntentId,
            status: 'not-applicable',
          });
        } catch (subscriptionError) {
          console.error('Failed to create subscription for one-time payment:', subscriptionError.message);
        }
      }

      // Update property with expiry_date based on months from input
      if (userId && months) {
        try {
          const monthsValue = parseInt(months, 10);
          
          if (monthsValue && monthsValue > 0) {
            let propertyToUpdate = null;
            
            // If propertyId is provided, use that specific property
            if (propertyId) {
              propertyToUpdate = await Property.findOne({
                _id: new mongoose.Types.ObjectId(propertyId),
                listed_by: new mongoose.Types.ObjectId(userId),
                deleted_at: null,
              });
            }
            if (propertyToUpdate) {
              // Calculate expiry date: months * 30 days from today
              const expiryDate = new Date();
              expiryDate.setDate(expiryDate.getDate() + (monthsValue * 30));
              
              // Update property with expiry_date
              propertyToUpdate.expiry_date = expiryDate;
              propertyToUpdate.isExpired = false;
              await propertyToUpdate.save();
            }
          }
        } catch (propertyError) {
          // Log error but don't fail the payment confirmation
          console.error('Failed to update property expiry date:', propertyError.message);
        }
      }



      // Update user report_count if role is 'user'
      if (userId) {
        try {
          const user = await User.findById(new mongoose.Types.ObjectId(userId));
          
          if (user && user.role === 'user') {
            // Get current report_count or default to 0, then add 3
            const currentCount = user.report_count || 0;
            user.report_count = currentCount + 3;
            await user.save();
          }
        } catch (userError) {
          // Log error but don't fail the payment confirmation
          console.error('Failed to update user report count:', userError.message);
        }
      }

      let user = await User.findById(new mongoose.Types.ObjectId(userId));

      // Notify all admin users that a new property has come for approval (when propertyId is provided and property_status is Inactive)
      if (propertyId) {
        try {
          const property = await Property.findOne({
            _id: new mongoose.Types.ObjectId(propertyId),
            deleted_at: null,
            property_status: 'Inactive',
          });
          if (property) {
            const propertyName = property.general_details?.building_name || 'New Property';
            const propertyAddress = property.general_details?.address || '';
            const propertyType = property.general_details?.property_type || null;
            const propertySize = property.general_details?.size_minimum
              ? `${property.general_details.size_minimum}${property.general_details.size_maximum ? ` - ${property.general_details.size_maximum}` : ''} sq ft`
              : null;

            const adminUsers = await User.find({ role: 'admin', deleted_at: null }).select('email firstName lastName');
            for (const admin of adminUsers) {
              if (admin.email) {
                await this.emailService.sendNewPropertyForApprovalEmail(
                  admin.email,
                  admin.firstName,
                  admin.lastName,
                  propertyId,
                  propertyName,
                  propertyAddress,
                  propertyType,
                  propertySize
                );
              }
            }
          }
        } catch (emailError) {
          console.error('Failed to send new property for approval emails to admins:', emailError.message);
        }
      }

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          report_count: user.report_count
        },
        message: 'Payment intent confirmed successfully',
      };

    } catch (error) {
      throw new Error(`Failed to confirm one time payment intent: ${error.message}`);
    }
  };

  /**
   * Apply a discount code and validate it
   * @param {string} code - Discount code to validate
   * @returns {Promise<Object>} Validation result with discount details
   */
  async applyDiscountCode(code) {
    try {
      if (!code || typeof code !== 'string') {
        throw new Error('Discount code is required');
      }

      // Convert code to uppercase for consistency
      const codeUpper = code.toUpperCase().trim();

      // Find the discount code
      const discountCode = await DiscountCode.findOne({
        code: codeUpper,
        deleted_at: null,
      });

      if (!discountCode) {
        return {
          success: false,
          isValid: false,
          message: 'Discount code not found',
          expiryStatus: false,
        };
      }

      // Check if code is active
      if (!discountCode.is_active) {
        return {
          success: false,
          isValid: false,
          message: 'Discount code is not active',
          expiryStatus: false,
        };
      }

      // Check expiry date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let expiryStatus = true; // Default to true (not expired)
      
      if (discountCode.expiry_date) {
        const expiryDate = new Date(discountCode.expiry_date);
        expiryDate.setHours(0, 0, 0, 0);
        
        // If today's date is after or equal to expiry date, code is expired
        if (today.getTime() >= expiryDate.getTime()) {
          expiryStatus = false;
          return {
            success: false,
            isValid: false,
            message: 'Discount code has expired',
            expiryStatus: false,
            expiryDate: discountCode.expiry_date,
          };
        }
      }

      // Check max usage count
      if (discountCode.max_usage !== null && discountCode.max_usage !== undefined) {
        if (discountCode.usage_count >= discountCode.max_usage) {
          return {
            success: false,
            isValid: false,
            message: 'Discount code has reached maximum usage limit',
            expiryStatus: expiryStatus,
            maxUsage: discountCode.max_usage,
          };
        }
      }

      // Code is valid
      return {
        success: true,
        isValid: true,
        message: 'Discount code is valid',
        expiryStatus: expiryStatus,
        data: {
          code: discountCode.code,
          discount_percentage: discountCode.discount_percentage,
          expiry_date: discountCode.expiry_date,
          usage_count: discountCode.usage_count,
          max_usage: discountCode.max_usage,
          is_active: discountCode.is_active,
        },
      };
    } catch (error) {
      throw new Error(`Failed to apply discount code: ${error.message}`);
    }
  }
}

export default PaymentService;
