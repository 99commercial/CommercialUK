import FeedService from '../service/feed.service.js';

class FeedController {
  constructor() {
    this.feedService = new FeedService();
  }

  /**
   * Import properties from external URL
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async importProperties(req, res, next) {
    try {
      // Get URL from query parameter or request body
      // const url = req.query.url || req.body.url;

      // if (!url) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'URL parameter is required. Provide it as query parameter (?url=...) or in request body.'
      //   });
      // }

      let userId = req.user._id;

      const result = await this.feedService.importProperties(userId);

      res.status(200).json({
        success: result.success,
        data: result.data,
        message: result.message || 'Properties imported successfully',
        warnings: result.warnings || []
      });
    } catch (error) {
      // Handle import errors with proper status code and message
      const statusCode = error.statusCode || 500;
      const errorMessage = error.message || 'An error occurred during property import';
      
      res.status(statusCode).json({
        success: false,
        message: errorMessage,
        error: errorMessage,
        details: error.details || {},
        warnings: error.details?.warnings || []
      });
    }
  }
}

export default FeedController;

