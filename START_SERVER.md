# 🚀 Starting Your SparksStream Server

## Important: You Must Start the Backend Server!

The 404 errors you're seeing mean the backend server is not running. The frontend build is just static files - they need the backend server to handle API requests.

## How to Start the Server

### Option 1: Quick Start (Recommended)
```bash
cd backend
npm start
```

Then open: **http://localhost:5000**

### Option 2: Development Mode (with hot reload)
```bash
# From project root
npm run dev
```

This starts:
- Frontend dev server: http://localhost:5173
- Backend server: http://localhost:5000

## Verify Server is Running

### Check 1: Terminal Output
You should see:
```
🚀 Server running on port 5000
📍 Local: http://localhost:5000
📡 API: http://localhost:5000/api
📁 Uploads: http://localhost:5000/uploads
✓ Serving frontend from: [path]/frontend/dist
```

### Check 2: Health Check
Open in browser: http://localhost:5000/api/health

Should return:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Check 3: Database Connection
Terminal should show:
```
MongoDB connected successfully
```

## Common Issues

### Issue 1: Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=3000
```

### Issue 2: MongoDB Connection Failed
**Error**: `MongooseServerSelectionError`

**Solution**:
1. Check `MONGODB_URI` in `backend/.env`
2. Verify MongoDB Atlas network access
3. Ensure IP address is whitelisted
4. Test connection with MongoDB Compass

### Issue 3: Missing Environment Variables
**Error**: Various errors about undefined variables

**Solution**:
Create/edit `backend/.env`:
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

### Issue 4: 404 Errors on API Calls
**Cause**: Backend server not running

**Solution**:
1. Make sure you're in the `backend` directory
2. Run `npm start`
3. Wait for "Server running" message
4. Then access http://localhost:5000

### Issue 5: Frontend Build Not Found
**Error**: "Frontend Build Not Found" page

**Solution**:
```bash
# Build frontend
npm run build --prefix frontend

# Or from frontend directory
cd frontend
npm run build
cd ..

# Then start backend
cd backend
npm start
```

## Step-by-Step Startup Process

### First Time Setup
```bash
# 1. Configure environment
cd backend
# Edit .env file with your credentials

# 2. Install dependencies (if not done)
npm install

# 3. Start server
npm start
```

### Regular Startup
```bash
cd backend
npm start
```

### After Frontend Changes
```bash
# 1. Rebuild frontend
npm run build --prefix frontend

# 2. Restart backend
cd backend
npm start
```

## Production Deployment

For production, use PM2:
```bash
# Install PM2
npm install -g pm2

# Start with PM2
cd backend
pm2 start index.js --name sparksstream

# Save configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

## Monitoring

### View Logs
```bash
# With PM2
pm2 logs sparksstream

# Or check terminal output when running npm start
```

### Check Status
```bash
# With PM2
pm2 status

# Or check if process is running
# Windows
tasklist | findstr node

# Linux/Mac
ps aux | grep node
```

## Quick Troubleshooting Checklist

- [ ] Backend server is running (`cd backend && npm start`)
- [ ] Terminal shows "Server running on port 5000"
- [ ] MongoDB connection successful
- [ ] Environment variables configured in `backend/.env`
- [ ] Frontend build exists at `frontend/dist/`
- [ ] Accessing http://localhost:5000 (not 5173)
- [ ] No other process using port 5000

## Need Help?

1. Check terminal for error messages
2. Verify all environment variables are set
3. Test API health: http://localhost:5000/api/health
4. Check MongoDB Atlas status
5. Review logs for specific errors

---

**Remember**: The frontend is just static files. You MUST run the backend server to handle API requests!

**Access URL**: http://localhost:5000 (when backend is running)
