import nodemailer from 'nodemailer';
import hbs from "nodemailer-express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import { FRONTEND_URL, EMAIL_USER, EMAIL_PASS } from '../config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class emailService {
  constructor() {
    // Create reusable transporter object with timeout settings
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      // Add timeout configurations for production
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
    });

    // Configure handlebars
    this.transporter.use('compile', hbs({
      viewEngine: {
        extname: '.hbs',
        partialsDir: path.join(__dirname, 'templates'),
        layoutsDir: path.join(__dirname, 'templates'),
        defaultLayout: false,
      },
      viewPath: path.join(__dirname, 'templates'),
      extName: '.hbs',
    }));
    
  }

  /**
   * Send welcome email
   * @param {string} email - User's email address
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   */
  async sendWelcomeEmail(email, firstName, lastName) {
    try {
      const mailOptions = {
        from: `"99Commercial" <${EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to 99Commercial - Your Commercial Real Estate Platform',
        template: 'welcome',
        context: {
          email,
          firstName,
          lastName,
          frontendUrl: FRONTEND_URL,
        },
      };

      // Add timeout wrapper
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email send timeout')), 30000);
      });
      
      const result = await Promise.race([sendPromise, timeoutPromise]);
      console.log('Welcome email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  /**
   * Send verification email
   * @param {string} email - User's email address
   * @param {string} verificationToken - Email verification token
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   */
  async sendVerificationEmail(email, verificationToken, firstName, lastName) {
    try {
      const mailOptions = {
        from: `"99Commercial" <${EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - 99Commercial',
        template: 'verification',
        context: {
          email,
          verificationToken,
          firstName,
          lastName,
          frontendUrl: FRONTEND_URL,
        },
      };

      // Add timeout wrapper
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email send timeout')), 30000);
      });
      
      const result = await Promise.race([sendPromise, timeoutPromise]);
      console.log('Verification email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   * @param {string} email - User's email address
   * @param {string} resetToken - Password reset token
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   */
  async sendPasswordResetEmail(email, resetToken, firstName, lastName) {
    try {
      const mailOptions = {
        from: `"99Commercial" <${EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password - 99Commercial',
        template: 'password-reset',
        context: {
          email,
          resetToken,
          firstName,
          lastName,
          frontendUrl: FRONTEND_URL,
        },
      };

      // Add timeout wrapper
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email send timeout')), 30000);
      });
      
      const result = await Promise.race([sendPromise, timeoutPromise]);
      console.log('Password reset email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
}