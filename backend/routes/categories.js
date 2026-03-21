import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import {
  getAllCategories,
  createCategory,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
// Allow both admins and approved instructors to create categories
router.post("/", auth, (req, res, next) => {
  if (req.user.role === 'admin' || (req.user.role === 'instructor' && req.user.isApproved)) {
    return next();
  }
  res.status(403).send({ error: 'Access denied.' });
}, createCategory);
router.put("/:id", auth, adminAuth, updateCategory);

export default router;
