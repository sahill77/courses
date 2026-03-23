import mongoose from 'mongoose';
import User from './models/User.js';
import Course from './models/Course.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './.env' });

async function debug() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const instructors = await User.find({ role: 'instructor' }, '-password');
        const courses = await Course.find();
        
        let output = '--- INSTRUCTOR USERS ---\n';
        instructors.forEach(u => {
            output += `ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Approved: ${u.isApproved}, Blocked: ${u.isBlocked}\n`;
        });
        
        output += '\n--- ALL UNIQUE INSTRUCTOR NAMES IN COURSES ---\n';
        const names = [...new Set(courses.map(c => c.instructor))];
        names.forEach(n => {
            output += `Instructor in course: ${JSON.stringify(n)}\n`;
        });

        fs.writeFileSync('debug_output.txt', output);
        console.log('Debug info written to debug_output.txt');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
debug();
