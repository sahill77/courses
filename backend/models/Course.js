import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String }, // URL
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
    showOnHome: { type: Boolean, default: false },
    content: [
      {
        title: { type: String },
        videoUrl: { type: String },
        description: { type: String },
      },
    ], // Modules or lessons
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Course", courseSchema);
