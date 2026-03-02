import express from 'express';
import PaymentController from '../controller/payment.controller.js';
import { authenticate } from '../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../middleware/authorize.middleware.js';
import { createUserActivity } from '../../../middleware/userActivity.middleware.js';

const router = express.Router();
const paymentController = new PaymentController();

// Protected Routes (Authentication required)

////////////////////////////////////////////
////////////////////////////////////////////
/// Subscription based payment system routes
////////////////////////////////////////////
////////////////////////////////////////////

/**
 * @route   POST /api/payment/create-intent
 * @desc    Create a payment intent
 * @access  Private
 */
router.post(
  '/create-intent',
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'creating payment intent', 'user created a payment intent');
      next();
    } catch (error) {
      next(error);
    }
  },
  paymentController.createPaymentIntent
);

/**
 * @route   POST /api/payment/apply-discount-code
 * @desc    Apply a discount code to a payment
 * @access  Private
 */
router.post(
  '/apply-discount-code',
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'applying discount code', 'user applied a discount code');
      next();
    } catch (error) {
      next(error);
    }
  },
  paymentController.applyDiscountCode
);  

/**
 * @route   POST /api/payment/confirm-intent
 * @desc    Confirm a payment intent
 * @access  Private
 */
router.post(
  '/confirm-intent',
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'agent confirming payment intent', 'agent confirmed a payment intent');
      next();
    } catch (error) {
      next(error);
    }
  },
  paymentController.confirmPaymentIntent
);

/**
 * @route   GET /api/payment/intent/:paymentIntentId
 * @desc    Get payment intent details
 * @access  Private
 */
router.get(
  '/intent/:paymentIntentId',
  authenticate,
  paymentController.getPaymentIntent
);

/**
 * @route   POST /api/payment/refund
 * @desc    Create a refund for a payment
 * @access  Private
 */
router.post(
  '/refund',
  authenticate,
  authorize(['admin']),
  paymentController.createRefund
);

/**
 * @route   GET /api/payment/subscription
 * @desc    Get user subscription
 * @access  Private
 */
router.get(
  '/subscription',
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'getting user subscription', 'user got his / her subscription');
      next();
    } catch (error) {
      next(error);
    }
  },
  paymentController.getUserSubscription
);

/**
 * @route   POST /api/payment/check-expired
 * @desc    Check and update expired subscriptions (for daily cron job)
 * @access  Private (Admin only or can be called by cron job with secret key)
 */
router.post(
  '/check-expired',
  paymentController.checkExpiredSubscriptions
);

////////////////////////////////////////////
////////////////////////////////////////////
/// One time based payment system routes
////////////////////////////////////////////
////////////////////////////////////////////

/**
 * @route   POST /api/payment/confirm-intent-one-time
 * @desc    Confirm a one time payment intent
 * @access  Private
 */
router.post(
  '/confirm-intent-one-time',
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'agent confirming one time payment intent', 'agent confirmed a one time payment intent');
      next();
    } catch (error) {
      next(error);
    }
  },
  paymentController.confirmPaymentIntentOneTime
);


export default router;
