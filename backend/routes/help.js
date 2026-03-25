import express from "express";
import HelpTicket from "../models/HelpTicket.js";
import { auth } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const jwt = await import('jsonwebtoken');
      const User = (await import('../models/User.js')).default;
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    }
  } catch (e) {
    // Ignore auth errors for optional auth
  }
  next();
};

// Submit help ticket (public or authenticated)
router.post("/", optionalAuth, async (req, res) => {
  try {
    console.log('Received help ticket request:', req.body);
    console.log('User:', req.user?._id);
    
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      console.log('Validation failed: missing fields');
      return res.status(400).json({ error: "All fields are required" });
    }
    
    if (!email.includes('@')) {
      console.log('Validation failed: invalid email');
      return res.status(400).json({ error: "Invalid email address" });
    }
    
    console.log('Creating ticket...');
    const ticket = new HelpTicket({
      user: req.user?._id,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    
    console.log('Saving ticket...');
    await ticket.save();
    console.log('Ticket saved successfully:', ticket.ticketNumber);
    
    // Send confirmation email
    try {
      await transporter.sendMail({
        from: `"SparksStream Support" <${process.env.EMAIL_USER}>`,
        to: ticket.email,
        subject: `Ticket Created: ${ticket.ticketNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">SparksStream Support</h1>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Hello ${ticket.name},</h2>
                        
                        <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                          Thank you for contacting SparksStream Support. We have received your request and our team will review it shortly.
                        </p>
                        
                        <!-- Ticket Details Box -->
                        <table width="100%" cellpadding="15" cellspacing="0" style="background: #f3f4f6; border-radius: 8px; margin-bottom: 25px;">
                          <tr>
                            <td style="color: #6b7280; font-weight: 600; padding: 12px 15px; width: 40%;">Ticket Number:</td>
                            <td style="color: #1f2937; font-weight: 700; padding: 12px 15px;">${ticket.ticketNumber}</td>
                          </tr>
                          <tr>
                            <td style="color: #6b7280; font-weight: 600; padding: 12px 15px;">Subject:</td>
                            <td style="color: #1f2937; padding: 12px 15px;">${ticket.subject}</td>
                          </tr>
                          <tr>
                            <td style="color: #6b7280; font-weight: 600; padding: 12px 15px; vertical-align: middle;">Status:</td>
                            <td style="padding: 12px 15px; vertical-align: middle;">
                              <span style="display: inline-block; background-color: #f59e0b; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">
                                Pending
                              </span>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Your Message Box -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                          <tr>
                            <td style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px;">
                              <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 10px; font-size: 16px;">Your Message:</h3>
                              <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${ticket.message}</p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Action Section -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                          <tr>
                            <td>
                              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                                You will receive email updates when your ticket status changes or when our team responds.
                                You can also track your ticket anytime by logging into your account.
                              </p>
                              <a href="${process.env.FRONTEND_URL}/settings" 
                                 style="display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                View My Tickets
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Footer -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                          <tr>
                            <td align="center">
                              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                This is an automated message from SparksStream Support. Please do not reply to this email.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      });
      console.log(`Confirmation email sent to ${ticket.email}`);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({ message: "Help request submitted successfully", ticket });
  } catch (error) {
    console.error('Help ticket creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ error: error.message || "Failed to create ticket" });
  }
});

// Get user's own tickets
router.get("/my-tickets", auth, async (req, res) => {
  try {
    const tickets = await HelpTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
