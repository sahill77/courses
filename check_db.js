import mongoose from 'mongoose';
import User from './backend/models/User.js';
import Course from './backend/models/Course.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './backend/.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const instructors = await User.find({ role: 'instructor' });
        const courses = await Course.find();
        
        console.log('--- Instructors in User Collection ---');
        instructors.forEach(i => console.log(`Name: ${i.name}, Email: ${i.email}, Approved: ${i.isApproved}`));
        
        console.log('\n--- Unique Instructor Names in Course Collection ---');
        const courseInstructors = [...new Set(courses.map(c => c.instructor))];
        courseInstructors.forEach(name => {
            const count = courses.filter(c => c.instructor === name).length;
            const matchesUser = instructors.some(i => i.name === name);
            console.log(`Instructor: ${name}, Course Count: ${count}, Matches User: ${matchesUser}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
