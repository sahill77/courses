import mongoose from "mongoose";

const helpTicketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "closed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

// Generate ticket number before saving
helpTicketSchema.pre('save', async function() {
  if (!this.ticketNumber) {
    const count = await mongoose.model('HelpTicket').countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;
  }
});

export default mongoose.model("HelpTicket", helpTicketSchema);
