import PaymentService from '../service/payment.service.js';

class PaymentController {
  constructor() {
    this.paymentService = new PaymentService();
  }

  /**
   * Create a payment intent
   * @route POST /api/payment/create-intent
   */
  createPaymentIntent = async (req, res, next) => {
    try {
      const { amount, paymentMethodId, customerId, metadata } = req.body;

      if (!amount) {
        return res.status(400).json({
          success: false,
          message: 'Amount is required',
        });
      }

      const result = await this.paymentService.createPaymentIntent({
        amount,
        paymentMethodId,
        customerId,
        metadata,
      });

      return res.status(201).json({
        success: true,
        message: 'Payment intent created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Confirm a payment intent
   * @route POST /api/payment/confirm-intent
   */
  confirmPaymentIntent = async (req, res, next) => {
    try {
      const { paymentIntentId, paymentMethodId } = req.body;

      const { _id } = req.user;

      if (!paymentIntentId || !paymentMethodId) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID and payment method ID are required',
        });
      }

      const result = await this.paymentService.confirmPaymentIntent(
        paymentIntentId,
        paymentMethodId,
        _id.toString()
      );

      return res.status(200).json({
        success: true,
        message: 'Payment intent confirmed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };


  /**
   * Get payment intent details
   * @route GET /api/payment/intent/:paymentIntentId
   */
  getPaymentIntent = async (req, res, next) => {
    try {
      const { paymentIntentId } = req.params;

      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID is required',
        });
      }

      const result = await this.paymentService.getPaymentIntent(paymentIntentId);

      return res.status(200).json({
        success: true,
        message: 'Payment intent retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a refund
   * @route POST /api/payment/refund
   */
  createRefund = async (req, res, next) => {
    try {
      const { paymentIntentId, amount, reason } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID is required',
        });
      }

      const result = await this.paymentService.createRefund(paymentIntentId, amount, reason);

      return res.status(201).json({
        success: true,
        message: 'Refund created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user subscription
   * @route GET /api/payment/subscription
   */
  getUserSubscription = async (req, res, next) => {
    try {
      const { _id } = req.user;

      const result = await this.paymentService.getUserSubscription(_id.toString());

      return res.status(200).json({
        success: result.success,
        message: result.message || 'Subscription retrieved successfully',
        data: result.subscription || null,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check and update expired subscriptions
   * @route POST /api/payment/check-expired
   */
  checkExpiredSubscriptions = async (req, res, next) => {
    try {
      const result = await this.paymentService.checkAndUpdateExpiredSubscriptions();

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Confirm a one time payment intent
   * @route POST /api/payment/confirm-intent-one-time
   */
  confirmPaymentIntentOneTime = async (req, res, next) => {
    try {
      const { paymentIntentId, months, propertyId } = req.body;
      const { _id } = req.user;

      const result = await this.paymentService.confirmPaymentIntentOneTime(
        paymentIntentId,
        _id.toString(),
        months,
        propertyId
      );

      return res.status(200).json({
        success: true,
        message: 'Payment intent confirmed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Apply a discount code
   * @route POST /api/payment/apply-discount-code
   */
  applyDiscountCode = async (req, res, next) => {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Discount code is required',
        });
      }

      const result = await this.paymentService.applyDiscountCode(code);

      const statusCode = result.success ? 200 : 400;

      return res.status(statusCode).json({
        success: result.success,
        message: result.message,
        expiryStatus: result.expiryStatus,
        data: result.data || null,
        usageCount: result.data?.usage_count || result.usageCount || null,
        maxUsage: result.data?.max_usage || result.maxUsage || null,
        expiryDate: result.data?.expiry_date || result.expiryDate || null,
      });
    } catch (error) {
      next(error);
    }
  };

}

export default PaymentController;
