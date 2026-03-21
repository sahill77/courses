import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getAllCourses,
  getStudentDashboard,
  getCourseDetail,
  enrollCourse,
  getEnrollmentProgress,
  updateProgress,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/my/courses", auth, getStudentDashboard); // MUST be before /:id
router.get("/:id/enrollment", auth, getEnrollmentProgress);
router.get("/:id", getCourseDetail);
router.post("/:id/enroll", auth, enrollCourse);
router.post("/:id/progress", auth, updateProgress);

export default router;
