import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "./models/Course.js";
import User from "./models/User.js";
import Enrollment from "./models/Enrollment.js";

dotenv.config();

const courses = [
  {
    title: "Complete Web Development",
    description:
      "Learn HTML, CSS, JavaScript, React, and Node.js from scratch.",
    thumbnail: "/images/courses/web-dev.png",
    instructor: "John Doe",
    category: "Development",
    price: 49.99,
    content: [
      { title: "Introduction to HTML", description: "Basics of web structure" },
      { title: "CSS Mastery", description: "Styling and Layouts" },
      {
        title: "JavaScript Fundamentals",
        description: "Logic and Interactivity",
      },
    ],
    faqs: [
      {
        question: "Do I need any prior experience?",
        answer: "No, this course starts from absolute basics.",
      },
      {
        question: "Will I get a certificate?",
        answer: "Yes, upon completion of all modules.",
      },
      {
        question: "Is there support if I get stuck?",
        answer: "Yes, our community and mentors are active 24/7.",
      },
    ],
  },
  {
    title: "Python for Data Science",
    description:
      "Master Python and libraries like Pandas, NumPy, and Scikit-learn.",
    thumbnail: "/images/courses/data-science.png",
    instructor: "Jane Smith",
    category: "Development",
    price: 59.99,
    content: [
      { title: "Python Basics", description: "Syntax and Data Types" },
      {
        title: "Data Analysis with Pandas",
        description: "Cleaning and exploring data",
      },
    ],
    faqs: [
      {
        question: "Is Python necessary for Data Science?",
        answer: "Yes, it is the most popular language in the field.",
      },
      {
        question: "What projects will I build?",
        answer:
          "You will analyze real-world datasets and build predictive models.",
      },
    ],
  },
  {
    title: "Advanced Software Development",
    description:
      "Master software architecture, design patterns, and testing strategies.",
    thumbnail: "/images/courses/software-dev.png",
    instructor: "Robert Martin",
    category: "Development",
    price: 79.99,
    content: [
      {
        title: "SOLID Principles",
        description: "Writing clean, maintainable code",
      },
      {
        title: "Design Patterns",
        description: "Common solutions to software problems",
      },
    ],
    faqs: [
      {
        question: "Who is this course for?",
        answer:
          "Experienced developers looking to advance their architecture skills.",
      },
      {
        question: "Is testing included?",
        answer: "Yes, we cover TDD and integration testing.",
      },
    ],
  },
  {
    title: "iOS & Android App Development",
    description:
      "Build high-performance mobile apps using React Native and Flutter.",
    thumbnail: "/images/courses/mobile-dev.png",
    instructor: "Angela Yu",
    category: "Development",
    price: 64.99,
    content: [
      {
        title: "React Native Basics",
        description: "Components and Navigation",
      },
      { title: "Flutter Widgets", description: "Building beautiful UIs" },
    ],
    faqs: [
      {
        question: "Which is better, React Native or Flutter?",
        answer: "We cover both so you can choose the best for your project.",
      },
      {
        question: "Can I publish these apps to stores?",
        answer: "Absolutely, we guide you through the submission process.",
      },
    ],
  },
  {
    title: "Game Development",
    description:
      "Create professional 2D and 3D games from scratch using C# and Unity.",
    thumbnail: "/images/courses/game-dev.png",
    instructor: "Rick Davidson",
    category: "Development",
    price: 54.99,
    content: [
      { title: "C# for Unity", description: "Scripting game logic" },
      {
        title: "3D Modeling Basics",
        description: "Creating assets for your game",
      },
    ],
    faqs: [
      {
        question: "Do I need a high-end PC?",
        answer: "A mid-range PC is sufficient for most Unity projects.",
      },
      {
        question: "Will I learn C#?",
        answer:
          "Yes, we cover C# from scratch specifically for game development.",
      },
    ],
  },
  {
    title: "Cyber Security Fundamentals",
    description: "Protect systems and networks from digital attacks.",
    thumbnail: "/images/courses/cybersecurity.png",
    instructor: "Kevin Mitnick",
    category: "Analysis",
    price: 89.99,
    content: [
      { title: "Network Security", description: "Firewalls and Protocols" },
      {
        title: "Ethical Hacking",
        description: "Finding vulnerabilities safely",
      },
    ],
    faqs: [
      {
        question: "Will I learn hacking?",
        answer: "You will learn ethical hacking to defend against attacks.",
      },
      {
        question: "Are there any prerequisites?",
        answer: "Basic networking knowledge is helpful but not mandatory.",
      },
    ],
  },
  {
    title: "UI/UX Design Essentials",
    description:
      "Master the art of creating beautiful and functional user interfaces.",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    instructor: "Sarah Jenkins",
    category: "Design",
    price: 44.99,
    content: [
      { title: "Design Thinking", description: "Understanding user needs" },
      { title: "Wireframing", description: "Creating low-fidelity layouts" },
      {
        title: "Color Theory & Typography",
        description: "Visual design principles",
      },
    ],
    faqs: [
      {
        question: "Is this course for beginners?",
        answer: "Yes, we start from the very basics of design theory.",
      },
      {
        question: "What tools will I learn?",
        answer:
          "The course focuses on design principles applicable to any tool.",
      },
    ],
  },
  {
    title: "Figma Masterclass",
    description: "Learn how to use Figma for professional design workflows.",
    thumbnail: "/images/courses/figma-masterclass.png",
    instructor: "Gary Simon",
    category: "Design",
    price: 49.99,
    content: [
      {
        title: "Figma Interface Basics",
        description: "Getting started with the tool",
      },
      {
        title: "Auto Layout & Components",
        description: "Advanced prototyping",
      },
      { title: "Design Systems", description: "Building scalable libraries" },
    ],
    faqs: [
      {
        question: "Do I need a paid Figma account?",
        answer: "No, the free version is perfectly sufficient for this course.",
      },
      {
        question: "Will I learn prototyping?",
        answer: "Yes, we cover interactive prototyping in depth.",
      },
    ],
  },
  {
    title: "Full-Stack Machine Learning",
    description: "Build and deploy machine learning models at scale.",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    instructor: "Andrew Ng",
    category: "Development",
    price: 99.99,
    content: [
      { title: "Deep Learning", description: "Neural Networks and AI" },
      { title: "MLOps", description: "Deploying models to production" },
    ],
    faqs: [
      {
        question: "Is this course math-heavy?",
        answer: "We cover the necessary math in an intuitive way.",
      },
      {
        question: "Will I learn deployment?",
        answer: "Yes, we focus on Full-Stack ML, including deployment.",
      },
    ],
  },
  {
    title: "Data Analysis",
    description:
      "Master the art of interpreting complex data sets to make informed decisions.",
    thumbnail: "/images/courses/data-analysis.png",
    instructor: "Dr. Linda Fox",
    category: "Analysis",
    price: 54.99,
    content: [
      {
        title: "Introduction to Statistics",
        description: "Understanding probability and distributions",
      },
      {
        title: "Data Visualization",
        description: "Creating impactful charts and dashboards",
      },
      {
        title: "Case Studies in Analytics",
        description: "Real-world data interpretation",
      },
    ],
    faqs: [
      {
        question: "What software will be used?",
        answer: "We primarily use Excel, Tableau, and basic SQL.",
      },
      {
        question: "Do I need to be a math expert?",
        answer:
          "Basic comfort with numbers is all you need; we teach the rest.",
      },
    ],
  },
  {
    title: "Social Media Marketing",
    description:
      "Master social media strategies, audience engagement, and platform analytics.",
    thumbnail: "/images/courses/social-media-marketing.png",
    instructor: "Sarah Jenkins",
    category: "Marketing",
    price: 39.99,
    content: [
      {
        title: "Building an Audience",
        description: "Organic growth strategies",
      },
      { title: "Paid Advertising", description: "Meta and Google Ads" },
      { title: "Content Creation", description: "Designing for engagement" },
    ],
    faqs: [
      {
        question: "Which platforms are covered?",
        answer: "We cover Instagram, TikTok, LinkedIn, and Facebook.",
      },
      {
        question: "Will I learn about ads?",
        answer: "Yes, we have a dedicated module for paid social advertising.",
      },
    ],
  },
  {
    title: "Blogging",
    description:
      "Create compelling content, build an audience, and monetize your blog.",
    thumbnail: "/images/courses/blogging.png",
    instructor: "David Miller",
    category: "Marketing",
    price: 29.99,
    content: [
      {
        title: "Finding Your Niche",
        description: "Targeting the right audience",
      },
      { title: "Content Strategy", description: "Planning and writing posts" },
      { title: "Monetization", description: "Ads, affiliates, and more" },
    ],
    faqs: [
      {
        question: "Do I need to be a good writer?",
        answer:
          "We provide templates and frameworks to help anyone write great content.",
      },
      {
        question: "How long until I can monetize?",
        answer:
          "Most students see results within 3-6 months of consistent blogging.",
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Enrollment.deleteMany({});
    console.log("Cleared existing enrollments");

    await Course.deleteMany({});
    console.log("Cleared existing courses");

    await Course.insertMany(courses);
    console.log("Sample courses added");

    // Create a default admin
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      const admin = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "adminpassword",
        role: "admin",
      });
      await admin.save();
      console.log("Default admin created: admin@example.com / adminpassword");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding DB:", error);
  }
};

seedDB();
