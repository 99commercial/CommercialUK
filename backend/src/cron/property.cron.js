import cron from 'node-cron';
import Property from '../models/property.model.js';

/**
 * Daily cron job to check and update expired properties
 * Runs every day at midnight (00:00)
 */
export const startPropertyExpiryCheck = () => {
  // Schedule: Run every day at midnight (00:00)
  // Format: minute hour day month dayOfWeek
  cron.schedule('0 0 * * *', async () => {
    try {
      // Set today's date to start of day for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find all properties with property_status 'Active'
      const activeProperties = await Property.find({
        property_status: 'Active',
        deleted_at: null
      });
      
      let updatedCount = 0;
      
      for (const property of activeProperties) {
        if (property.expiry_date) {
          // Set expiry_date to start of day for comparison
          const expiryDate = new Date(property.expiry_date);
          expiryDate.setHours(0, 0, 0, 0);
          
          // If today's date equals expiry_date, set isExpired to true
          if (today.getTime() === expiryDate.getTime()) {
            property.isExpired = true;
            await property.save();
            updatedCount++;
          }
        }
      }
      
    } catch (error) {
      console.error('Error in property expiry check:', error.message);
    }
  });
};
