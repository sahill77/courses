import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' }).populate("instructor", "name");
    res.send(courses);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getStudentDashboard = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'course',
        populate: { path: 'instructor', select: 'name' }
      })
      .sort({ updatedAt: -1 });
    res.send(enrollments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getCourseDetail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name');
    if (!course) return res.status(404).send({ error: "Course not found" });
    res.send(course);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const getEnrollmentProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id }).populate('course');
    if (!enrollment) return res.status(404).send({ error: 'Enrollment not found' });
    res.send(enrollment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { moduleId, completed, lastAccessedModuleIndex } = req.body;
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });
    if (!enrollment) return res.status(404).send({ error: 'Enrollment not found' });

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send({ error: 'Course not found' });

    // Toggle completed module
    if (moduleId) {
      if (completed) {
        if (!enrollment.completedModules.includes(moduleId)) {
          enrollment.completedModules.push(moduleId);
        }
      } else {
        enrollment.completedModules = enrollment.completedModules.filter(id => id !== moduleId);
      }
    }

    // Update last accessed index
    if (lastAccessedModuleIndex !== undefined) {
      enrollment.lastAccessedModuleIndex = lastAccessedModuleIndex;
    }

    // Calculate progress percentage
    const totalModules = course.content ? course.content.length : 0;
    enrollment.progress = totalModules > 0 ? Math.round((enrollment.completedModules.length / totalModules) * 100) : 0;

    await enrollment.save();
    res.send(enrollment);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send({ error: "Course not found" });

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });
    if (alreadyEnrolled)
      return res.status(400).send({ error: "Already enrolled" });

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
          students: req.user._id
        } 
      },
      { upsert: true }
    );

    req.user.enrolledCourses.push(course._id);
    await req.user.save();

    course.students.push(req.user._id);
    await course.save();

    res.send({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
