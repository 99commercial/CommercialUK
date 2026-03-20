import express from 'express';
import { emailService } from '../../../../emails/auth.email.js';

const router = express.Router();
const mailer = new emailService();

// Public pre-registration endpoint (used by the CommercialUK pre-register form)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, role: rawRole } = req.body || {};

    // If role isn't provided, default to `user` for backward compatibility.
    const role = (rawRole || 'user').toString().toLowerCase().trim();

    if (!name || !email || !phone || !address) {
      return res.status(422).json({
        success: false,
        message: 'Missing required fields: name, email, phone, address',
      });
    }

    if (!['user', 'agent'].includes(role)) {
      return res.status(422).json({
        success: false,
        message: 'Invalid role. Allowed values: user, agent',
      });
    }

    await mailer.sendPreRegisterEmail(name, email, phone, address, role);

    return res.status(200).json({
      success: true,
      message: 'Pre-registration request submitted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit pre-registration request',
    });
  }
});

export default router;

