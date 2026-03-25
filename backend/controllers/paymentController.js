import Razorpay from "razorpay";
import crypto from "crypto";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Instructor from "../models/Instructor.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();

    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const options = {
      amount: Math.round(course.price * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${courseId.toString().slice(-10)}_${req.user._id.toString().slice(-10)}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret missing");
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).send({ error: "Course not found" });

      const alreadyEnrolled = await Enrollment.findOne({
        user: req.user._id,
        course: course._id,
      });

      if (alreadyEnrolled) {
          return res.status(200).json({ message: "Already enrolled" });
      }

      const enrollment = new Enrollment({
        user: req.user._id,
        course: course._id,
      });
      await enrollment.save();

      // Sync with Instructor model
      await Instructor.findOneAndUpdate(
        { user: course.instructor },
        {
          $addToSet: {
            enrollments: enrollment._id,
            students: req.user._id,
          },
        },
        { upsert: true }
      );

      // Update User model
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { enrolledCourses: course._id },
      });

      // Update Course model
      await Course.findByIdAndUpdate(course._id, {
        $addToSet: { students: req.user._id },
      });

      return res.status(200).json({ message: "Payment verified and enrolled successfully" });
    } else {
      return res.status(400).json({ error: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
};
