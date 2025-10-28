import { body, param } from 'express-validator';
import { USER_STATUS } from '../../../../config/constant.config.js';

/**
 * Validation rules for updating user behavior status
 */
export const updateUserStatusValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format'),

  body('user_status')
    .isIn(Object.values(USER_STATUS))
    .withMessage('Invalid user status. Must be one of: excellent, good, average, poor, bad, banned'),

  body('status_reason')
    .optional()
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage('Status reason must be between 1 and 500 characters')
    .custom((value, { req }) => {
      // Require reason for status changes (except for 'good' status)
      if (req.body.user_status !== USER_STATUS.GOOD && (!value || value.trim().length === 0)) {
        throw new Error('Status reason is required for status changes');
      }
      return true;
    })
];

/**
 * Validation rules for getting users list with status filter
 */
export const getUserListValidation = [
  param('user_status')
    .optional()
    .isIn(Object.values(USER_STATUS))
    .withMessage('Invalid user status filter')
];
