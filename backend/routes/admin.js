import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(auth, adminAuth);

// Create a new course
router.post("/courses", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Update a course
router.put("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) return res.status(404).send({ error: "Course not found" });
    res.send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete a course
router.delete("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).send({ error: "Course not found" });
    res.send({ message: "Course deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get Platform Stats
router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const courses = await Course.countDocuments();
    const enrollments = await Enrollment.countDocuments();
    res.send({ users, courses, enrollments });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get all users and their enrollments
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password").populate(
      "enrolledCourses",
      "title category",
    );

    // Sort: Admins -> Enrolled Students -> New Students
    const sortedUsers = users.sort((a, b) => {
      // 1. Admins first
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;

      // 2. Enrolled students after admins
      const aHasEnrollments = a.enrolledCourses?.length > 0;
      const bHasEnrollments = b.enrolledCourses?.length > 0;

      if (aHasEnrollments && !bHasEnrollments) return -1;
      if (!aHasEnrollments && bHasEnrollments) return 1;

      // 3. Newest first for users within the same category
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.send(sortedUsers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
