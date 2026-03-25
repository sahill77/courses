import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import HelpTicket from "../models/HelpTicket.js";
import nodemailer from "nodemailer";
import {
  createCourse,updateCourse,deleteCourse,getStats,getUsers,getInstructors,
  approveInstructor,blockInstructor,unblockInstructor,
  getPendingCourses,approveCourse,rejectCourse,
  getAllCategoriesAdmin,getPendingCategories,approveCategory,rejectCategory,
  deleteCategory,deleteUser,deleteInstructor,toggleCourseHomeVisibility
} from "../controllers/adminController.js";

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

// Helper function to send ticket update email
const sendTicketUpdateEmail = async (ticket) => {
  const statusInfo = {
    pending: { color: '#f59e0b', bg: '#fef3c7', label: 'Pending' },
    'in-progress': { color: '#3b82f6', bg: '#dbeafe', label: 'In Progress' },
    resolved: { color: '#22c55e', bg: '#d1fae5', label: 'Resolved' },
    closed: { color: '#6b7280', bg: '#e5e7eb', label: 'Closed' }
  };
  
  const currentStatus = statusInfo[ticket.status] || statusInfo.pending;

  try {
    await transporter.sendMail({
      from: `"SparksStream Support" <${process.env.EMAIL_USER}>`,
      to: ticket.email,
      subject: `Ticket Update: ${ticket.ticketNumber} - ${currentStatus.label}`,
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
                        Your support ticket has been updated. Here are the details:
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
                            <span style="display: inline-block; background-color: ${currentStatus.color}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">
                              ${currentStatus.label}
                            </span>
                          </td>
                        </tr>
                      </table>
                      
                      ${ticket.adminNotes ? `
                      <!-- Admin Response Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <tr>
                          <td style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px;">
                            <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 10px; font-size: 16px;">Admin Response:</h3>
                            <p style="color: #1f2937; line-height: 1.6; margin: 0; white-space: pre-wrap;">${ticket.adminNotes}</p>
                          </td>
                        </tr>
                      </table>
                      ` : ''}
                      
                      <!-- Action Section -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <tr>
                          <td>
                            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                              You can view your ticket details anytime by logging into your account and visiting the Settings page.
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
    console.log(`Email sent to ${ticket.email} for ticket ${ticket.ticketNumber}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

router.use(auth, adminAuth);

router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.put("/courses/:id/toggle-home", toggleCourseHomeVisibility);
router.delete("/courses/:id", deleteCourse);
router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/instructors", getInstructors);

// Instructor management
router.put("/instructors/:id/approve", approveInstructor);
router.put("/instructors/:id/block", blockInstructor);
router.put("/instructors/:id/unblock", unblockInstructor);
router.delete("/instructors/:id", deleteInstructor);

// Course approval
router.get("/pending-courses", getPendingCourses);
router.put("/courses/:id/approve", approveCourse);
router.put("/courses/:id/reject", rejectCourse);

// Category management
router.get("/categories", getAllCategoriesAdmin);
router.get("/pending-categories", getPendingCategories);
router.put("/categories/:id/approve", approveCategory);
router.put("/categories/:id/reject", rejectCategory);
router.delete("/categories/:id", deleteCategory);

// User management
router.delete("/users/:id", deleteUser);

// Help ticket management
router.get("/help-tickets", async (req, res) => {
  try {
    const tickets = await HelpTicket.find().populate("user", "name email").sort({ createdAt: -1 });
    res.send(tickets);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/help-tickets/:id", async (req, res) => {
  try {
    const { status, priority, adminNotes } = req.body;
    const oldTicket = await HelpTicket.findById(req.params.id);
    
    if (!oldTicket) return res.status(404).send({ error: "Ticket not found" });
    
    // Check if status or adminNotes changed
    const statusChanged = oldTicket.status !== status;
    const notesChanged = oldTicket.adminNotes !== adminNotes;
    
    const ticket = await HelpTicket.findByIdAndUpdate(
      req.params.id,
      { status, priority, adminNotes },
      { new: true }
    ).populate("user", "name email");
    
    // Send email if status changed or admin added/updated notes
    if (statusChanged || (notesChanged && adminNotes)) {
      await sendTicketUpdateEmail(ticket);
    }
    
    res.send(ticket);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/help-tickets/:id", async (req, res) => {
  try {
    const ticket = await HelpTicket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).send({ error: "Ticket not found" });
    res.send({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
