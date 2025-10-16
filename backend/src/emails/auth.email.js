import nodemailer from 'nodemailer';
import hbs from "nodemailer-express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import { FRONTEND_URL, EMAIL_USER, EMAIL_PASS } from '../config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class emailService {
  constructor() {
    
    // Create reusable transporter object with Brevo SMTP configuration
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', // Always this for Brevo
      port: 465, // Use 587 for TLS
      secure: true, // Must be false for port 587
      auth: {
        user: EMAIL_USER, // Brevo SMTP login (your email or username)
        pass: EMAIL_PASS, // Brevo SMTP password (API key)
      },
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000,   // 30 seconds
      socketTimeout: 60000,     // 60 seconds
      tls: {
        rejectUnauthorized: true, // ✅ should be true in production
      },
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
    
    // Verify Brevo SMTP connection
    this.verifyBrevoConnection();
  }

  /**
   * Verify Brevo SMTP connection
   */
  async verifyBrevoConnection() {
    try {
      await this.transporter.verify();
      console.log(EMAIL_USER,EMAIL_PASS);
      
      console.log('✅ Brevo SMTP connection verified successfully');
    } catch (error) {
      console.log(EMAIL_USER,EMAIL_PASS);

      console.error('❌ Brevo SMTP connection verification failed:', error.message);
      console.error('Please check your Brevo SMTP credentials and settings');
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
        from: `"99Commercial" <shardul@99home.co.uk>`,
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
        from: `"99Commercial" <shardul@99home.co.uk>`,
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
      from: `"99Commercial" <shardul@99home.co.uk>`,
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

    // Enhanced retry mechanism for Brevo SMTP
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const sendPromise = this.transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Brevo email send timeout')), 30000);
        });
        
        const result = await Promise.race([sendPromise, timeoutPromise]);
        console.log(`✅ Password reset email sent successfully via Brevo (attempt ${attempt}):`, result.messageId);
        return result;
      } catch (error) {
        console.error(`❌ Password reset email attempt ${attempt} failed:`, error.message);
        
        // Handle Brevo-specific errors
        if (error.message.includes('socket close') || 
            error.message.includes('ECONNRESET') || 
            error.message.includes('EPIPE') ||
            error.code === 'ECONNRESET' ||
            error.code === 'EPIPE') {
          
          console.log(`🔄 Socket error detected, retrying with new connection (attempt ${attempt})`);
          
          // Recreate transporter for Brevo
          this.transporter.close();
          this.transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            secure: EMAIL_SECURE,
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
            }
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
          console.error('❌ All password reset email attempts failed via Brevo');
          throw new Error(`Failed to send password reset email via Brevo after 3 attempts: ${error.message}`);
        }
        
        // Wait before retry (exponential backoff)
        const waitTime = 2000 * Math.pow(2, attempt - 1); // 2s, 4s, 8s
        console.log(`⏳ Waiting ${waitTime}ms before retry attempt ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
}