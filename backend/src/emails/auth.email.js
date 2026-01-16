import nodemailer from 'nodemailer';
import hbs from "nodemailer-express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import { FRONTEND_URL, EMAIL_USER, EMAIL_PASS } from '../config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class emailService {
  constructor() {
    
    // Create reusable transporter object with Zoho SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: 'smtppro.zoho.in',
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER, // your Zoho email
        pass: process.env.EMAIL_PASS  // your Zoho app password
      }
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
    
    // Verify Zoho SMTP connection
    this.verifyZohoConnection();
  }

  /**
   * Verify Zoho SMTP connection
   */
  async verifyZohoConnection() {
    try {
      console.log('🔍 Testing Zoho SMTP connection...');
      console.log('📧 Email User:', EMAIL_USER);
      console.log('🔑 Password length:', EMAIL_PASS ? EMAIL_PASS.length : 'undefined');
      
      await this.transporter.verify();
      
      console.log('✅ Zoho SMTP connection verified successfully');
    } catch (error) {
      console.error('❌ Zoho SMTP connection verification failed:', error.message);
      console.error('🔍 Error details:', error);
      console.error('📧 Please check your Zoho SMTP credentials and settings');
      
      // Additional debugging for common Zoho issues
      if (error.message.includes('535')) {
        console.error('🚨 535 Error: Authentication failed - check app-specific password');
      }
      if (error.message.includes('553')) {
        console.error('🚨 553 Error: Relay not allowed - check Zoho SMTP settings');
      }
    }
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
        from: `"99Commercial" <noreply@commercialuk.co.uk>`,
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
        from: `"99Commercial" <noreply@commercialuk.co.uk>`,
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
    const mailOptions = {
      from: `"99Commercial" <noreply@commercialuk.co.uk>`,
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

    // Enhanced retry mechanism for Zoho SMTP
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const sendPromise = this.transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Zoho email send timeout')), 30000);
        });
        
        const result = await Promise.race([sendPromise, timeoutPromise]);
        console.log(`✅ Password reset email sent successfully via Zoho (attempt ${attempt}):`, result.messageId);
        return result;
      } catch (error) {
        console.error(`❌ Password reset email attempt ${attempt} failed:`, error.message);
        
        // Handle Zoho-specific errors
        if (error.message.includes('socket close') || 
            error.message.includes('ECONNRESET') || 
            error.message.includes('EPIPE') ||
            error.code === 'ECONNRESET' ||
            error.code === 'EPIPE') {
          
          console.log(`🔄 Socket error detected, retrying with new connection (attempt ${attempt})`);
          
          // Recreate transporter for Zoho
          this.transporter.close();
          this.transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 587,
            secure: false,
            auth: {
              user: EMAIL_USER,
              pass: EMAIL_PASS,
            },
            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
            tls: {
              rejectUnauthorized: false,
              ciphers: 'SSLv3'
            },
            debug: true,
            logger: true,
          });
          
          // Reconfigure handlebars
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
        
        if (attempt === 3) {
          console.error('❌ All password reset email attempts failed via Zoho');
          throw new Error(`Failed to send password reset email via Zoho after 3 attempts: ${error.message}`);
        }
        
        // Wait before retry (exponential backoff)
        const waitTime = 2000 * Math.pow(2, attempt - 1); // 2s, 4s, 8s
        console.log(`⏳ Waiting ${waitTime}ms before retry attempt ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  /**
   * Send evaluated report link email
   * @param {string} email - User's email address
   * @param {string} reportLink - Link to the generated evaluated report
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   */
  async sendEvaluatedReportEmail(email, reportLink, firstName, lastName) {
    try {
      const mailOptions = {
        from: `"CommercialUK" <noreply@commercialuk.co.uk>`,
        to: email,
        subject: 'Your Property Evaluation Report is Ready - CommercialUK',
        template: 'evaluation-report',
        context: {
          email,
          reportLink,
          firstName: firstName || 'Valued Customer',
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
      console.log('✅ Evaluated report email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending evaluated report email:', error);
      throw error;
    }
  }

  /**
   * Send email update for new query
   * @param {string} email - User's email address
   * @param {string} firstName - User's first name
   * @param {string} lastName - User's last name
   * @param {object} queryDetails - Details of the new query
   */
  async sendEmailUpdateForNewQuery(email, firstName, lastName, queryDetails) {
    try {
      const mailOptions = {
        from: `"CommercialUK" <noreply@commercialuk.co.uk>`,
        to: email,
        subject: 'New Query Update - CommercialUK',
        template: 'new-query',
        context: {
          email,
          firstName: firstName || 'Valued Customer',
          lastName,
          queryDetails,
          frontendUrl: FRONTEND_URL,
        },
      };

      // Add timeout wrapper
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Email send timeout')), 30000);
      });

      const result = await Promise.race([sendPromise, timeoutPromise]);
      console.log('✅ New query email sent successfully:', result.messageId);
      return result;
    } catch (error) {
      console.error('❌ Error sending new query email:', error);
      throw error;
    }
  }
}