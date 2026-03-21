import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userData = { name, email, password, role };
    // Instructors require admin approval
    if (role === 'instructor') {
      userData.isApproved = false;
    }
    const user = new User(userData);
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    if (user.isBlocked) {
      return res.status(403).send({ error: "Your account has been suspended. Please contact the administrator." });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.send({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isBlocked: user.isBlocked,
      },
      token,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
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
        isApproved: user.isApproved,
        isBlocked: user.isBlocked,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: "No account found with this email." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: `"SparksStream" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:2rem;border:1px solid #e2e8f0;border-radius:12px">
          <h2 style="color:#6366f1">Reset Your Password</h2>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:1.5rem 0;padding:0.75rem 2rem;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
          <p style="color:#64748b;font-size:0.85rem">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.send({ message: "Reset link sent to your email." });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const verifyResetToken = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).send({ error: "Reset link is invalid or has expired." });
    res.send({ message: "Token valid.", email: user.email });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).send({ error: "Reset link is invalid or has expired." });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ message: "Password reset successfully." });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
