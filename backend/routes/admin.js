import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import {
  createCourse,updateCourse,deleteCourse,getStats,getUsers,getInstructors,
  approveInstructor,blockInstructor,unblockInstructor,
  getPendingCourses,approveCourse,rejectCourse,
  deleteCategory,deleteUser,deleteInstructor
} from "../controllers/adminController.js";

const router = express.Router();

router.use(auth, adminAuth);

router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
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

// Category & User management
router.delete("/categories/:id", deleteCategory);
router.delete("/users/:id", deleteUser);

export default router;
