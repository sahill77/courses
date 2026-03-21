import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import Category from "../models/Category.js";

export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) return res.status(404).send({ error: "Course not found" });
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
    const instructors = await User.countDocuments({ role: 'instructor' });

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
      users, courses, enrollments, instructors,
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

    const sortedUsers = formattedUsers.sort((a, b) => {
      // 1. Admins first
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;

      // 2. Enrolled students after admins
      const aHasEnrollments = a.enrolledCourses?.length > 0;
      const bHasEnrollments = b.enrolledCourses?.length > 0;

      if (aHasEnrollments && !bHasEnrollments) return -1;
      if (!aHasEnrollments && bHasEnrollments) return 1;

      // 3. Newest first for users within the same category
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.send(sortedUsers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }, '-password');
    const allCourses = await Course.find();
    const allEnrollments = await Enrollment.find();

    const enriched = instructors.map(inst => {
      const instObj = inst.toObject();
      const instructorCourses = allCourses.filter(c => c.instructor === inst.name);
      const courseIds = instructorCourses.map(c => c._id.toString());
      const categories = [...new Set(instructorCourses.map(c => c.category).filter(Boolean))];
      const totalStudents = allEnrollments.filter(e => courseIds.includes(e.course.toString())).length;

      return {
        ...instObj,
        courses: instructorCourses.map(c => ({ _id: c._id, title: c.title, category: c.category })),
        categories,
        totalCourses: instructorCourses.length,
        totalStudents,
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
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send({ error: 'Course not found' });
    course.status = 'approved';
    await course.save();
    res.send({ message: 'Course approved successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Reject a course
export const rejectCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send({ error: 'Course not found' });
    course.status = 'rejected';
    await course.save();
    res.send({ message: 'Course rejected' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
