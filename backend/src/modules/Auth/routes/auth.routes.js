import express from 'express';
import { AuthController } from '../controller/auth.controller.js';
import { authenticate } from '../../../middleware/authenticate.middleware.js';
import { authorize } from '../../../middleware/authorize.middleware.js';
import { validateRequest } from '../../../middleware/error.middleware.js';
import { registerUserValidator , loginValidation , emailVerifyValidator , resendVerificationValidator , forgetPasswordValidation , resetPasswordValidation , updatePasswordValidator , refreshTokenValidation } from '../validation/auth.validation.js';
import { createUserActivity } from '../../../middleware/userActivity.middleware.js';

const router = express.Router();
const authController = new AuthController();

// Public Routes (No authentication required)

/**
 * @route   POST /api/auth/register
 * @desc    Register a new agent
 * @access  Public
 */
router.post(
  '/register',
  registerUserValidator,
  validateRequest,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login agent
 * @access  Public
 */
router.post(
  '/login',
  loginValidation,
  validateRequest,
  authController.login
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  forgetPasswordValidation,
  validateRequest,
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  resetPasswordValidation,
  validateRequest,
  authController.resetPassword
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 */
router.post(
  '/verify-email',
  emailVerifyValidator,
  validateRequest,
  authController.verifyEmail
);

/**
 * @route   POST /api/auth/agent/resend-verification
 * @desc    Resend email verification
 * @access  Public
 */
router.post(
  '/resend-verification',
  resendVerificationValidator,
  validateRequest,
  authController.resendVerification
);

// Protected Routes (Authentication required)

/**
 * @route   POST /api/auth/update-password
 * @desc    Update password (requires current password)
 */
router.post(
  '/update-password',
  updatePasswordValidator,
  validateRequest,
  authenticate,
  async (req, res, next) => {
    try {
      await createUserActivity(req, 'updating password', 'user updated his / her password');
      next();
    } catch (error) {
      next(error);
    }
  },
  authController.updatePassword
);


/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 */
router.post(
  '/logout',
  authController.logout
);

router.post(
  '/refresh-token',
  refreshTokenValidation,
  validateRequest,
  authController.refreshToken
);


export default router;
