import mongoose from 'mongoose';
import User from './backend/models/User.js';
import Course from './backend/models/Course.js';
import Enrollment from './backend/models/Enrollment.js';
import Instructor from './backend/models/Instructor.js';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const instructors = await User.find({ role: 'instructor' });
        const courses = await Course.find();
        const enrollments = await Enrollment.find();

        console.log(`Found ${instructors.length} instructors and ${courses.length} courses.`);

        for (const inst of instructors) {
            console.log(`Processing instructor: ${inst.name}`);
            
            // 1. Create/Update Instructor Profile
            let profile = await Instructor.findOne({ user: inst._id });
            if (!profile) {
                profile = new Instructor({ user: inst._id });
            }

            // 2. Link courses where instructor name matches string
            const instructorCourses = courses.filter(c => 
                (typeof c.instructor === 'string' && c.instructor === inst.name) ||
                (c.instructor && c.instructor.toString() === inst._id.toString())
            );

            profile.courses = instructorCourses.map(c => c._id);
            
            // Update Course objects to use ID if they currently use string
            for (const course of instructorCourses) {
                if (typeof course.instructor === 'string') {
                    course.instructor = inst._id;
                    await course.save();
                }
            }

            // 3. Link enrollments and students
            const courseIds = instructorCourses.map(c => c._id.toString());
            const instEnrollments = enrollments.filter(e => courseIds.includes(e.course.toString()));
            profile.enrollments = instEnrollments.map(e => e._id);
            profile.students = [...new Set(instEnrollments.map(e => e.user))];

            await profile.save();
            console.log(`Updated profile for ${inst.name}: ${profile.courses.length} courses, ${profile.students.length} students.`);
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
