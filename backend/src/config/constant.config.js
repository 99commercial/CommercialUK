export const MESSAGES = {
    AUTH_TOKEN_REQUIRED: 'Authorization token is required.',
    INVALID_TOKEN: 'Invalid or expired token.',
    USER_NOT_FOUND: 'User not found.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    
    // Auth Messages
    REGISTER_SUCCESS: 'User registered successfully. Please check your email for verification.',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    FORGOT_PASSWORD_SUCCESS: 'Password reset email sent successfully',
    RESET_PASSWORD_SUCCESS: 'Password reset successfully',
    VERIFY_EMAIL_SUCCESS: 'Email verified successfully',
    RESEND_VERIFICATION_SUCCESS: 'Verification email sent successfully',
    UPDATE_PASSWORD_SUCCESS: 'Password updated successfully',
    REFRESH_TOKEN_SUCCESS: 'Token refreshed successfully',
    
    // Favorites Messages
    LOGIN_REQUIRED_FOR_FAVORITES: 'Please login to add properties to your favorites',
    
    // User Status Messages
    USER_STATUS_UPDATED_SUCCESSFULLY: 'User status updated successfully',
    USER_STATUS_UPDATE_FAILED: 'Failed to update user status',
    INVALID_USER_STATUS: 'Invalid user status provided',
    USER_STATUS_REASON_REQUIRED: 'Status reason is required for status changes',
    
    // Admin Messages
    USERS_FETCHED_SUCCESSFULLY: 'Users fetched successfully',
    AGENTS_FETCHED_SUCCESSFULLY: 'Agents fetched successfully',
    USER_FETCHED_SUCCESSFULLY: 'User fetched successfully',
    USER_DELETED_SUCCESSFULLY: 'User deleted successfully',
    USER_PROPERTIES_FETCHED_SUCCESSFULLY: 'User properties fetched successfully',
    PROPERTIES_FETCHED_SUCCESSFULLY: 'Properties fetched successfully',
    PROPERTY_FETCHED_SUCCESSFULLY: 'Property fetched successfully',
    PROPERTY_UPDATED_SUCCESSFULLY: 'Property updated successfully',
    PROPERTY_DELETED_SUCCESSFULLY: 'Property deleted successfully',
    PROPERTY_STATUS_UPDATED_SUCCESSFULLY: 'Property status updated successfully',
    PROPERTY_FEATURED_STATUS_UPDATED_SUCCESSFULLY: 'Property featured status updated successfully',
    PROPERTY_VERIFIED_STATUS_UPDATED_SUCCESSFULLY: 'Property verified status updated successfully',
    PROPERTY_STATS_FETCHED_SUCCESSFULLY: 'Property statistics fetched successfully',
    DASHBOARD_STATS_FETCHED_SUCCESSFULLY: 'Dashboard statistics fetched successfully',
};

// User Status Constants
export const USER_STATUS = {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    AVERAGE: 'average',
    POOR: 'poor',
    BAD: 'bad',
    BANNED: 'banned'
};

// User Status Labels for Display
export const USER_STATUS_LABELS = {
    [USER_STATUS.EXCELLENT]: 'Excellent',
    [USER_STATUS.GOOD]: 'Good',
    [USER_STATUS.AVERAGE]: 'Average',
    [USER_STATUS.POOR]: 'Poor',
    [USER_STATUS.BAD]: 'Bad',
    [USER_STATUS.BANNED]: 'Banned'
};

// User Status Colors for UI
export const USER_STATUS_COLORS = {
    [USER_STATUS.EXCELLENT]: '#10B981', // Green
    [USER_STATUS.GOOD]: '#059669', // Darker Green
    [USER_STATUS.AVERAGE]: '#F59E0B', // Yellow
    [USER_STATUS.POOR]: '#F97316', // Orange
    [USER_STATUS.BAD]: '#EF4444', // Red
    [USER_STATUS.BANNED]: '#7F1D1D' // Dark Red
};
  