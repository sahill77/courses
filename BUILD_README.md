# SparksStream - Build Instructions

## Quick Start

### Automated Build (Recommended)

#### For Windows:
```bash
build.bat
```

#### For Linux/Mac:
```bash
chmod +x build.sh
./build.sh
```

### Manual Build

#### Step 1: Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

#### Step 2: Build Frontend
```bash
# From project root
npm run build

# Or from frontend directory
cd frontend
npm run build
```

#### Step 3: Start Backend
```bash
cd backend
npm start
```

#### Step 4: Access Application
Open browser: `http://localhost:5000`

## Build Output

After building, you'll have:
- `frontend/dist/` - Production-ready static files
- Optimized JavaScript bundles
- Minified CSS
- Compressed assets

## Environment Configuration

### Backend (.env)
Create `backend/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend (.env.production)
Already configured in `frontend/.env.production`:
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## Project Structure

```
courses/
├── frontend/
│   ├── dist/              # Build output (created after build)
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── .env.production    # Production environment variables
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded files
│   ├── .env               # Backend environment variables
│   ├── index.js           # Main server file
│   └── package.json
├── build.sh               # Linux/Mac build script
├── build.bat              # Windows build script
├── package.json           # Root package file
└── DEPLOYMENT_GUIDE.md    # Detailed deployment guide
```

## How It Works

### Development Mode
- Frontend runs on `http://localhost:5173` (Vite dev server)
- Backend runs on `http://localhost:5000` (Express server)
- Frontend proxies API requests to backend

### Production Mode
- Frontend is built to static files in `frontend/dist/`
- Backend serves both API and frontend from `http://localhost:5000`
- Single server handles everything

## Build Scripts

### Root package.json
```json
{
  "scripts": {
    "dev": "concurrently \"npm run backend\" \"npm run frontend\"",
    "build": "npm run build --prefix frontend",
    "build:full": "npm install --prefix frontend && npm run build --prefix frontend && npm install --prefix backend",
    "start": "npm start --prefix backend"
  }
}
```

### Usage
- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build frontend for production
- `npm run build:full` - Install dependencies and build
- `npm start` - Start production server

## Troubleshooting

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules
rm -rf backend/node_modules
npm run build:full
```

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=3000
```

### Frontend Not Loading
```bash
# Verify build exists
ls -la frontend/dist

# Rebuild
npm run build --prefix frontend

# Check backend logs
cd backend
npm start
```

### API Requests Failing
1. Check backend is running
2. Verify CORS configuration in `backend/index.js`
3. Check browser console for errors
4. Verify API routes are prefixed with `/api`

### Database Connection Issues
1. Verify MONGODB_URI in `backend/.env`
2. Check MongoDB Atlas network access
3. Ensure IP address is whitelisted
4. Test connection with MongoDB Compass

## Performance Tips

### Build Optimization
- Code splitting is enabled by default
- Vendor chunks separated for better caching
- Source maps disabled in production
- Assets minified and compressed

### Runtime Optimization
- Enable gzip compression on server
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries

## Next Steps

1. ✅ Build the application
2. ✅ Configure environment variables
3. ✅ Start the server
4. 📖 Read DEPLOYMENT_GUIDE.md for production deployment
5. 📖 Read RESPONSIVE_ARCHITECTURE.md for design details
6. 📖 Read VISUAL_TESTING_GUIDE.md for testing

## Support

For detailed deployment instructions, see:
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `RESPONSIVE_ARCHITECTURE.md` - Responsive design documentation
- `VISUAL_TESTING_GUIDE.md` - Testing procedures

---

Last Updated: 2026-03-25
