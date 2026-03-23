import mongoose from 'mongoose';
import User from './models/User.js';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({ role: 'instructor' });
        const courses = await Course.find();
        
        console.log('--- Instructor Users ---');
        users.forEach(u => console.log(`${u._id}: ${u.name} (${u.email}) - Approved: ${u.isApproved}`));
        
        console.log('\n--- Courses with String Instructors ---');
        courses.forEach(c => {
            if (typeof c.instructor === 'string') {
                console.log(`Course: ${c.title} - Instructor (String): ${c.instructor}`);
            }
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
