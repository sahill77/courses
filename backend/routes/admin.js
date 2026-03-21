import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import {
  createCourse,updateCourse,deleteCourse,getStats,getUsers,getInstructors,
  approveInstructor,blockInstructor,unblockInstructor,
  getPendingCourses,approveCourse,rejectCourse
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

// Course approval
router.get("/pending-courses", getPendingCourses);
router.put("/courses/:id/approve", approveCourse);
router.put("/courses/:id/reject", rejectCourse);

export default router;
