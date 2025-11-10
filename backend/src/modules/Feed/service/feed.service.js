import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import importFirstFeedProperty from '../../../utils/import99home.js';

export class FeedService {
  /**
   * Import properties from external URL
   * @returns {Promise<Object>} The response data in JSON format
   */
  async importProperties(userId) {
    try {

      console.log(userId);
      

      let url = 'https://99home.co.uk/v2/commercial/feed.xml';

      if (!url) {
        const error = new Error('URL is required');
        error.statusCode = 400;
        throw error;
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (urlError) {
        const error = new Error('Invalid URL format');
        error.statusCode = 400;
        throw error;
      }

      // Make GET request to the provided URL
      const response = await axios.get(url, {
        timeout: 30000, // 30 second timeout
        responseType: 'text',
        headers: {
          'Accept': 'application/xml, text/xml',
          'Content-Type': 'application/xml'
        }
      });

      const parsedData = await parseStringPromise(response.data, {
        explicitArray: false,
        mergeAttrs: true,
        explicitRoot: false,
        trim: true
      });

      console.log(parsedData, 'parsedData');

      // Ensure properties is an array
      let properties = parsedData.property;
      if (!Array.isArray(properties)) {
        properties = properties ? [properties] : [];
      }

      for(let i = 0; i < properties.length; i++) {
        let result = await importFirstFeedProperty(properties, userId , i);
      }

      // Return the result from importFirstFeedProperty
      return {
        success: result.success,
        data: result,
        message: result.success 
          ? `Property imported successfully. Reference: ${result.reference}` 
          : `Import failed: ${result.error || 'Unknown error'}`,
        warnings: result.warnings || []
      };
    } catch (error) {
      // If error already has statusCode (from import failure), re-throw it
      if (error.statusCode) {
        throw error;
      }

      // Handle axios errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const err = new Error(`Failed to fetch data from URL: ${error.response.status} ${error.response.statusText}`);
        err.statusCode = error.response.status;
        throw err;
      } else if (error.request) {
        // The request was made but no response was received
        const err = new Error('No response received from the provided URL');
        err.statusCode = 503;
        throw err;
      } else {
        // Something happened in setting up the request that triggered an Error
        // This could be an import error or other error
        const err = new Error(error.message || 'An error occurred during property import');
        err.statusCode = error.statusCode || 500;
        err.details = error.details || {};
        throw err;
      }
    }
  }
}

export default FeedService;

