# 🎓 SparksStream - Online Learning Platform

A full-stack MERN application for online course management with role-based access control, payment integration, and responsive design.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account (for email notifications)
- Razorpay account (for payments)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd courses
   ```

2. **Configure Environment**
   ```bash
   cd backend
   # Create .env file with your credentials
   ```

3. **Build & Start**
   ```bash
   # Option A: Automated (Windows)
   build.bat

   # Option B: Automated (Linux/Mac)
   chmod +x build.sh
   ./build.sh

   # Option C: Manual
   npm run build:full
   npm run build
   cd backend
   npm start
   ```

4. **Access Application**
   ```
   http://localhost:5000
   ```

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 3 steps
- **[START_SERVER.md](START_SERVER.md)** - How to start the server
- **[FIX_404_ERROR.md](FIX_404_ERROR.md)** - Troubleshoot 404 errors
- **[BUILD_README.md](BUILD_README.md)** - Build instructions
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment
- **[RESPONSIVE_ARCHITECTURE.md](RESPONSIVE_ARCHITECTURE.md)** - Design guide
- **[VISUAL_TESTING_GUIDE.md](VISUAL_TESTING_GUIDE.md)** - Testing procedures

## 🎯 Features

### For Students
- Browse and search courses
- Enroll in courses (free or paid)
- Track learning progress
- Access course content and videos
- Submit help tickets
- Manage profile settings

### For Instructors
- Create and manage courses
- Add course content and FAQs
- Track student enrollments
- Manage categories
- View analytics

### For Admins
- Manage users and instructors
- Approve/reject courses and categories
- Handle help tickets
- View platform statistics
- Configure system settings

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- Lucide Icons
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer
- Multer (file uploads)
- Razorpay (payments)

## 📁 Project Structure

```
courses/
├── frontend/              # React frontend
│   ├── dist/             # Production build
│   ├── src/              # Source code
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── features/     # Feature modules
│   │   ├── context/      # React context
│   │   └── services/     # API services
│   └── public/           # Static assets
│
├── backend/              # Express backend
│   ├── config/          # Configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── uploads/         # File storage
│
└── docs/                # Documentation
```

## 🔧 Development

### Development Mode (Hot Reload)
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Production Mode
```bash
npm run build
cd backend
npm start
```
- Application: http://localhost:5000

### Test Server
```bash
npm run test:server
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/profile` - Update profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

### Admin
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/courses/:id/approve` - Approve course

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Help
- `POST /api/help` - Submit help ticket
- `GET /api/help/my-tickets` - Get user tickets

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend (.env.production)
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## 🚨 Troubleshooting

### 404 API Errors
**Problem**: Getting 404 errors on API calls

**Solution**: Start the backend server!
```bash
cd backend
npm start
```
See [FIX_404_ERROR.md](FIX_404_ERROR.md) for details.

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=3000
```

### MongoDB Connection Failed
1. Check MONGODB_URI in backend/.env
2. Verify MongoDB Atlas network access
3. Whitelist your IP address

### Frontend Not Loading
```bash
# Rebuild frontend
npm run build --prefix frontend

# Restart backend
cd backend
npm start
```

## 📦 Deployment

### Option 1: VPS/Cloud Server
```bash
npm install -g pm2
cd backend
pm2 start index.js --name sparksstream
pm2 save
pm2 startup
```

### Option 2: Vercel
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Option 3: Docker
```bash
docker-compose up -d
```

## 🧪 Testing

### Manual Testing
1. User registration and login
2. Course browsing and enrollment
3. Payment processing
4. Admin panel functionality
5. Help ticket system

### Automated Testing
```bash
npm run test:server
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)

See [RESPONSIVE_ARCHITECTURE.md](RESPONSIVE_ARCHITECTURE.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Sparks Developers

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database
- Razorpay for payment integration
- All contributors and users

## 📞 Support

For issues or questions:
- Check documentation files
- Review troubleshooting guides
- Open an issue on GitHub

---

**Built with ❤️ by Sparks Developers**

Last Updated: 2026-03-25
