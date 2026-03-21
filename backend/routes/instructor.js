import express from "express";
import { auth, instructorAuth } from "../middleware/auth.js";
import {
  getInstructorCourses,
  createInstructorCourse,
  updateInstructorCourse,
  deleteInstructorCourse,
  getInstructorStudents,
  getInstructorStats,
} from "../controllers/instructorController.js";

const router = express.Router();

// Status check — only needs auth, not approval check
router.get("/status", auth, (req, res) => {
  if (req.user.role !== 'instructor') return res.status(403).send({ error: 'Not an instructor' });
  res.send({
    isApproved: req.user.isApproved,
    isBlocked: req.user.isBlocked,
    name: req.user.name,
    email: req.user.email,
  });
});

// All other routes require full instructor auth (approved + not blocked)
router.use(auth, instructorAuth);

router.get("/courses", getInstructorCourses);
router.post("/courses", createInstructorCourse);
router.put("/courses/:id", updateInstructorCourse);
router.delete("/courses/:id", deleteInstructorCourse);
router.get("/students", getInstructorStudents);
router.get("/stats", getInstructorStats);

export default router;
