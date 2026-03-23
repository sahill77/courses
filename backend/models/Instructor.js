import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    enrollments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Instructor', instructorSchema);
