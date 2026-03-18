import express from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS
  },
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      "supersecretkey123",
      { expiresIn: "1d" },
    );
    res.send({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Update Profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.send({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Forgot Password - email check + send reset link
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'No account found with this email.' });

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: `"SparksStream" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:2rem;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#6366f1">Reset Your Password</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:1.5rem 0;padding:0.75rem 2rem;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
          <p style="color:#64748b;font-size:0.85rem">If you didn't request this, ignore this email.</p>
        </div>
      `
    });

    res.send({ message: 'Reset link sent to your email.' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Verify Reset Token
router.get("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).send({ error: 'Reset link is invalid or has expired.' });
    res.send({ message: 'Token valid.', email: user.email });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Reset Password with token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).send({ error: 'Reset link is invalid or has expired.' });

    user.password = req.body.password; // pre-save hook hashes it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
