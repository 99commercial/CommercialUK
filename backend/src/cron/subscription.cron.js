import cron from 'node-cron';
import PaymentService from '../modules/payment/service/payment.service.js';

const paymentService = new PaymentService();

/**
 * Daily cron job to check and update expired subscriptions
 * Runs every day at midnight (00:00)
 */
export const startSubscriptionExpiryCheck = () => {
  // Schedule: Run every day at midnight (00:00)
  // Format: minute hour day month dayOfWeek
  cron.schedule('0 0 * * *', async () => {
    try {
      await paymentService.checkAndUpdateExpiredSubscriptions();
    } catch (error) {
      console.error('Error in subscription expiry check:', error.message);
    }
  });
};
