# 🚀 Quick Start Guide - SparksStream

## Get Started in 3 Steps

### Step 1: Configure Environment
```bash
# Edit backend/.env with your credentials
cd backend
# Copy and edit .env file
```

Required variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Step 2: Start Server
```bash
# From backend directory
npm start
```

### Step 3: Open Browser
```
http://localhost:5000
```

That's it! Your application is running! 🎉

---

## Development Mode

Want to develop with hot reload?

```bash
# From project root
npm run dev
```

This starts:
- Frontend: http://localhost:5173 (with hot reload)
- Backend: http://localhost:5000 (with nodemon)

---

## Rebuild Frontend

Made changes to frontend?

```bash
# From project root
npm run build

# Then restart backend
cd backend
npm start
```

---

## Common Commands

```bash
# Development (both servers)
npm run dev

# Build frontend
npm run build

# Full build (install + build)
npm run build:full

# Start production server
npm start

# Start backend only
cd backend && npm start

# Start frontend dev server only
cd frontend && npm run dev
```

---

## Default Credentials

### Admin Account
- Email: `admin@example.com`
- Password: `adminpassword`

(Change these after first login!)

---

## Ports

- **Production**: http://localhost:5000 (frontend + backend)
- **Development Frontend**: http://localhost:5173
- **Development Backend**: http://localhost:5000

---

## Need Help?

- 📖 Full build guide: `BUILD_README.md`
- 🚀 Deployment guide: `DEPLOYMENT_GUIDE.md`
- 🎨 Design guide: `RESPONSIVE_ARCHITECTURE.md`
- 🧪 Testing guide: `VISUAL_TESTING_GUIDE.md`
- ✅ Build status: `BUILD_COMPLETE.md`

---

## Troubleshooting

### Port already in use?
Change `PORT` in `backend/.env`

### Database connection failed?
Check `MONGODB_URI` in `backend/.env`

### Frontend not loading?
1. Check if `frontend/dist` exists
2. Rebuild: `npm run build`
3. Restart backend

### API not working?
1. Check backend is running
2. Check browser console for errors
3. Verify API routes start with `/api`

---

**Ready to deploy?** See `DEPLOYMENT_GUIDE.md`

**Need to rebuild?** Run `build.bat` (Windows) or `./build.sh` (Linux/Mac)
