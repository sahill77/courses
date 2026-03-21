import express from "express";
import { auth } from "../middleware/auth.js";
import {
  register,
  login,
  updateProfile,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", auth, updateProfile);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

export default router;
