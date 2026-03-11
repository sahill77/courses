import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.send(courses);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get course detail
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).send({ error: 'Course not found' });
        res.send(course);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Enroll in a course
router.post('/:id/enroll', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).send({ error: 'Course not found' });

        const alreadyEnrolled = await Enrollment.findOne({ user: req.user._id, course: course._id });
        if (alreadyEnrolled) return res.status(400).send({ error: 'Already enrolled' });

        const enrollment = new Enrollment({ user: req.user._id, course: course._id });
        await enrollment.save();

        req.user.enrolledCourses.push(course._id);
        await req.user.save();

        course.students.push(req.user._id);
        await course.save();

        res.send({ message: 'Enrolled successfully' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get student dashboard data
router.get('/my/courses', auth, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');
        res.send(enrollments);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
