import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String, default: '' },
    color: { type: String, default: 'var(--primary)' },
    showOnHome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
