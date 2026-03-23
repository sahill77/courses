import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Instructor from "../models/Instructor.js";

// Get all courses belonging to the logged-in instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.send(courses);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Create a new course (auto-set instructor to logged-in user's ID)
export const createInstructorCourse = async (req, res) => {
  try {
    const courseData = { ...req.body, instructor: req.user._id, status: 'pending' };
    const course = new Course(courseData);
    await course.save();

    // Sync with Instructor model
    await Instructor.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { courses: course._id } },
      { upsert: true }
    );

    res.status(201).send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update an instructor's own course
export const updateInstructorCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send({ error: "Course not found" });
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: "You can only edit your own courses." });
    }
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(updated);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete an instructor's own course
export const deleteInstructorCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send({ error: "Course not found" });
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: "You can only delete your own courses." });
    }
    await Course.findByIdAndDelete(req.params.id);

    // Sync with Instructor model
    await Instructor.updateOne(
      { user: req.user._id },
      { $pull: { courses: req.params.id } }
    );

    res.send({ message: "Course deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all enrolled students across instructor's courses
export const getInstructorStudents = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);

    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate("user", "name email createdAt")
      .populate("course", "title category");

    res.send(enrollments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get stats for the instructor dashboard
export const getInstructorStats = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map(c => c._id);
    const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });
    const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];

    res.send({
      totalCourses: courses.length,
      totalStudents,
      totalCategories: categories.length,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
