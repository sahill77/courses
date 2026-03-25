import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Category from "../models/Category.js";
import Instructor from "../models/Instructor.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();

    // Sync with Instructor model
    await Instructor.findOneAndUpdate(
      { user: course.instructor },
      { $addToSet: { courses: course._id } },
      { upsert: true }
    );

    res.status(201).send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const oldCourse = await Course.findById(req.params.id);
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) return res.status(404).send({ error: "Course not found" });

    // Sync with Instructor model if instructor changed
    if (oldCourse && oldCourse.instructor.toString() !== course.instructor.toString()) {
      // Remove from old instructor
      await Instructor.updateOne(
        { user: oldCourse.instructor },
        { $pull: { courses: course._id } }
      );
      // Add to new instructor
      await Instructor.findOneAndUpdate(
        { user: course.instructor },
        { $addToSet: { courses: course._id } },
        { upsert: true }
      );
    }

    res.send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).send({ error: "Course not found" });
    res.send({ message: "Course deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const courses = await Course.countDocuments();
    const enrollments = await Enrollment.countDocuments();
    const instructorsCount = await User.countDocuments({ role: 'instructor' });

    // Category-wise enrollment (Includes all courses for complete category tracking)
    const categoryStats = await Course.aggregate([
      { $group: { _id: '$category', studentCount: { $sum: { $size: { $ifNull: ['$students', []] } } } } },
      { $sort: { studentCount: -1 } }
    ]);

    // Course-wise enrollment (All courses)
    const courseStatsAll = await Course.find({}, 'title category students status');
    
    const formattedCourseStats = courseStatsAll.map(c => ({
      _id: c._id,
      title: c.title,
      category: c.category,
      count: c.students ? c.students.length : 0
    })).sort((a, b) => b.count - a.count);

    res.send({ 
      users, courses, enrollments, instructors: instructorsCount,
      categoryStats: categoryStats.map(s => ({ category: s._id, count: s.studentCount })),
      courseStats: formattedCourseStats
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").populate(
      "enrolledCourses",
      "title category",
    );

    const enrollments = await Enrollment.find({});
    const enrollmentMap = {};
    enrollments.forEach(en => {
        if (en.user && en.course) {
            enrollmentMap[`${en.user.toString()}-${en.course.toString()}`] = en.enrolledAt;
        }
    });

    const formattedUsers = users.map(u => {
      const userObj = u.toObject();
      userObj.enrolledCourses = userObj.enrolledCourses.map(course => {
          const enrolledDate = enrollmentMap[`${u._id.toString()}-${course._id.toString()}`];
          return {
              ...course,
              enrolledAt: enrolledDate || userObj.createdAt
          };
      });
      return userObj;
    });

    const sortedUsers = formattedUsers.sort((a, b) => a.name.localeCompare(b.name));

    res.send(sortedUsers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }, '-password');
    const allCourses = await Course.find().populate('instructor', 'name');
    const allEnrollments = await Enrollment.find();
    const instructorProfiles = await Instructor.find();

    const enriched = instructors.map(inst => {
      const profile = instructorProfiles.find(p => p.user.toString() === inst._id.toString());
      const instructorCourses = allCourses.filter(c => c.instructor?._id?.toString() === inst._id.toString());
      const courseIds = instructorCourses.map(c => c._id.toString());
      const categories = [...new Set(instructorCourses.map(c => c.category).filter(Boolean))];
      
      // Use the profile if it exists, otherwise calculate
      const totalStudents = profile ? profile.students.length : allEnrollments.filter(e => courseIds.includes(e.course.toString())).length;
      const totalCourses = profile ? profile.courses.length : instructorCourses.length;

      return {
        ...inst.toObject(),
        courses: instructorCourses.map(c => ({ _id: c._id, title: c.title, category: c.category })),
        categories,
        totalCourses,
        totalStudents,
        enrollments: profile ? profile.enrollments : [],
        studentIds: profile ? profile.students : []
      };
    });

    res.send(enriched);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Approve an instructor
export const approveInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'instructor') return res.status(404).send({ error: 'Instructor not found' });
    user.isApproved = true;
    await user.save();
    
    // Send email to instructor
    if (user.email) {
      try {
        await transporter.sendMail({
          from: `"SparksStream Admin" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Instructor Account Approved - Welcome to SparksStream!',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Welcome to SparksStream!</h1>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                          <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Hello ${user.name},</h2>
                          
                          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                            Congratulations! Your instructor account has been approved by our admin team. You can now start creating and managing courses on SparksStream.
                          </p>
                          
                          <table width="100%" cellpadding="15" cellspacing="0" style="background: #f0fdf4; border-radius: 8px; margin-bottom: 25px; border: 2px solid #22c55e;">
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px;">Instructor Name:</td>
                              <td style="color: #1f2937; font-weight: 700; padding: 12px 15px;">${user.name}</td>
                            </tr>
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px;">Email:</td>
                              <td style="color: #1f2937; padding: 12px 15px;">${user.email}</td>
                            </tr>
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px; vertical-align: middle;">Status:</td>
                              <td style="padding: 12px 15px; vertical-align: middle;">
                                <span style="display: inline-block; background-color: #22c55e; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">
                                  ✓ Approved
                                </span>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                            <tr>
                              <td style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px;">
                                <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 10px; font-size: 16px;">What's Next?</h3>
                                <ul style="color: #1f2937; line-height: 1.8; margin: 0; padding-left: 20px;">
                                  <li>Access your Instructor Dashboard</li>
                                  <li>Create your first course</li>
                                  <li>Add categories for your courses</li>
                                  <li>Upload course content and materials</li>
                                  <li>Start teaching and engaging with students</li>
                                </ul>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <tr>
                              <td>
                                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                                  Ready to start your teaching journey?
                                </p>
                                <a href="${process.env.FRONTEND_URL}/instructor" 
                                   style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                  Go to Instructor Dashboard
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <tr>
                              <td align="center">
                                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                  This is an automated message from SparksStream. Please do not reply to this email.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        });
        console.log(`Instructor approval email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send instructor approval email:', emailError);
      }
    }
    
    res.send({ message: 'Instructor approved successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Block an instructor
export const blockInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'instructor') return res.status(404).send({ error: 'Instructor not found' });
    user.isBlocked = true;
    await user.save();
    res.send({ message: 'Instructor blocked successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Unblock an instructor
export const unblockInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'instructor') return res.status(404).send({ error: 'Instructor not found' });
    user.isBlocked = false;
    await user.save();
    res.send({ message: 'Instructor unblocked successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get pending courses (from instructors)
export const getPendingCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' });
    res.send(courses);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Approve a course
export const approveCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) return res.status(404).send({ error: 'Course not found' });
    
    course.status = 'approved';
    await course.save();
    
    // Send email to instructor
    if (course.instructor && course.instructor.email) {
      try {
        await transporter.sendMail({
          from: `"SparksStream Admin" <${process.env.EMAIL_USER}>`,
          to: course.instructor.email,
          subject: `Course Approved: ${course.title}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Course Approved!</h1>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                          <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Hello ${course.instructor.name},</h2>
                          
                          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                            Great news! Your course has been approved by our admin team and is now live on SparksStream.
                          </p>
                          
                          <table width="100%" cellpadding="15" cellspacing="0" style="background: #f0fdf4; border-radius: 8px; margin-bottom: 25px; border: 2px solid #22c55e;">
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px;">Course Title:</td>
                              <td style="color: #1f2937; font-weight: 700; padding: 12px 15px;">${course.title}</td>
                            </tr>
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px;">Category:</td>
                              <td style="color: #1f2937; padding: 12px 15px;">${course.category}</td>
                            </tr>
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px; vertical-align: middle;">Status:</td>
                              <td style="padding: 12px 15px; vertical-align: middle;">
                                <span style="display: inline-block; background-color: #22c55e; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">
                                  ✓ Approved
                                </span>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                            <tr>
                              <td style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px;">
                                <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 10px; font-size: 16px;">What's Next?</h3>
                                <ul style="color: #1f2937; line-height: 1.8; margin: 0; padding-left: 20px;">
                                  <li>Add detailed course content and lessons</li>
                                  <li>Upload course materials and resources</li>
                                  <li>Set up course modules and structure</li>
                                  <li>Students can now enroll in your course</li>
                                </ul>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <tr>
                              <td>
                                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                                  Start managing your course and engaging with students now!
                                </p>
                                <a href="${process.env.FRONTEND_URL}/instructor" 
                                   style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                  Go to Instructor Dashboard
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <tr>
                              <td align="center">
                                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                  This is an automated message from SparksStream. Please do not reply to this email.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        });
        console.log(`Course approval email sent to ${course.instructor.email}`);
      } catch (emailError) {
        console.error('Failed to send course approval email:', emailError);
      }
    }
    
    res.send({ message: 'Course approved successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Reject a course (deletes from DB)
export const rejectCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).send({ error: 'Course not found' });
    await Enrollment.deleteMany({ course: req.params.id });
    await Instructor.updateMany({}, { $pull: { courses: req.params.id } });
    await User.updateMany({}, { $pull: { enrolledCourses: req.params.id } });
    res.send({ message: 'Course rejected and deleted' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get all categories for admin (including pending/rejected)
export const getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.send(categories);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get pending categories
export const getPendingCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'pending' });
    res.send(categories);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Approve a category
export const approveCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('createdBy', 'name email');
    if (!category) return res.status(404).send({ error: 'Category not found' });
    
    category.status = 'approved';
    await category.save();
    
    // Send email to instructor who created the category
    if (category.createdBy && category.createdBy.email) {
      try {
        await transporter.sendMail({
          from: `"SparksStream Admin" <${process.env.EMAIL_USER}>`,
          to: category.createdBy.email,
          subject: `Category Approved: ${category.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                      <tr>
                        <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Category Approved!</h1>
                        </td>
                      </tr>
                      
                      <tr>
                        <td style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                          <h2 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">Hello ${category.createdBy.name},</h2>
                          
                          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
                            Excellent news! Your category has been approved by our admin team and is now available on SparksStream.
                          </p>
                          
                          <table width="100%" cellpadding="15" cellspacing="0" style="background: #f0fdf4; border-radius: 8px; margin-bottom: 25px; border: 2px solid #22c55e;">
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px;">Category Name:</td>
                              <td style="color: #1f2937; font-weight: 700; padding: 12px 15px;">${category.name}</td>
                            </tr>
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px;">Description:</td>
                              <td style="color: #1f2937; padding: 12px 15px;">${category.description || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td style="color: #166534; font-weight: 600; padding: 12px 15px; vertical-align: middle;">Status:</td>
                              <td style="padding: 12px 15px; vertical-align: middle;">
                                <span style="display: inline-block; background-color: #22c55e; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; font-size: 14px;">
                                  ✓ Approved
                                </span>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                            <tr>
                              <td style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px;">
                                <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 10px; font-size: 16px;">What's Next?</h3>
                                <ul style="color: #1f2937; line-height: 1.8; margin: 0; padding-left: 20px;">
                                  <li>Create courses under this category</li>
                                  <li>This category is now visible to all users</li>
                                  <li>Students can browse courses in this category</li>
                                  <li>Start building your course content</li>
                                </ul>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <tr>
                              <td>
                                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                                  Ready to create courses in this category?
                                </p>
                                <a href="${process.env.FRONTEND_URL}/instructor" 
                                   style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                  Go to Instructor Dashboard
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <tr>
                              <td align="center">
                                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                  This is an automated message from SparksStream. Please do not reply to this email.
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        });
        console.log(`Category approval email sent to ${category.createdBy.email}`);
      } catch (emailError) {
        console.error('Failed to send category approval email:', emailError);
      }
    }
    
    res.send({ message: 'Category approved successfully', category });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Reject a category (returns status or deletes)
export const rejectCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).send({ error: 'Category not found' });
    
    // Optional: Also delete/archive courses associated with this rejected category
    // Not strictly required for MVP, but good practice.
    res.send({ message: 'Category rejected and deleted' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).send({ error: 'Category not found' });
    res.send({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete a user/student
export const deleteUser = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).send({ error: 'User not found' });
    await Enrollment.deleteMany({ user: req.params.id });
    await Course.updateMany({}, { $pull: { students: req.params.id } });
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: 'User deleted' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Delete an instructor
export const deleteInstructor = async (req, res) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u || u.role !== 'instructor') return res.status(404).send({ error: 'Instructor not found' });
    const courses = await Course.find({ instructor: req.params.id });
    const courseIds = courses.map(c => c._id);
    await Enrollment.deleteMany({ course: { $in: courseIds } });
    await Course.deleteMany({ instructor: req.params.id });
    await Instructor.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: 'Instructor and their courses deleted' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Toggle course homepage visibility
export const toggleCourseHomeVisibility = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send({ error: 'Course not found' });
    course.showOnHome = !course.showOnHome;
    await course.save();
    res.send({ message: `Course visibility updated: ${course.showOnHome}`, showOnHome: course.showOnHome });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
