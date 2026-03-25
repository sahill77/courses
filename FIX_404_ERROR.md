# 🔧 Fixing 404 API Errors

## The Problem
You're seeing errors like:
```
AxiosError: Request failed with status code 404
```

## Root Cause
**The backend server is not running!** The frontend build is just static HTML/CSS/JS files. They need the backend server to handle API requests.

## The Solution

### Step 1: Start the Backend Server
```bash
cd backend
npm start
```

### Step 2: Wait for Confirmation
You should see:
```
🚀 Server running on port 5000
📍 Local: http://localhost:5000
📡 API: http://localhost:5000/api
📁 Uploads: http://localhost:5000/uploads
✓ Serving frontend from: [path]/frontend/dist
MongoDB connected successfully
```

### Step 3: Access the Application
Open your browser to: **http://localhost:5000**

⚠️ **Important**: Use port 5000, NOT 5173!

## Verify It's Working

### Test 1: Health Check
Open: http://localhost:5000/api/health

Should show:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Test 2: Run Test Script
```bash
npm run test:server
```

Should show all green checkmarks ✅

### Test 3: Check Browser Console
1. Open http://localhost:5000
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Should see no 404 errors

## Still Getting 404 Errors?

### Check 1: Is the Server Actually Running?
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

If nothing shows up, the server isn't running!

### Check 2: Are You Using the Correct URL?
❌ Wrong: http://localhost:5173 (dev server, not running)
✅ Correct: http://localhost:5000 (production server)

### Check 3: Is MongoDB Connected?
Look for this in terminal:
```
MongoDB connected successfully
```

If you see connection errors:
1. Check `MONGODB_URI` in `backend/.env`
2. Verify MongoDB Atlas is accessible
3. Check network access settings in MongoDB Atlas

### Check 4: Environment Variables
Make sure `backend/.env` exists and has:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
# ... other variables
```

## Common Mistakes

### Mistake 1: Opening the HTML File Directly
❌ Don't: Open `frontend/dist/index.html` in browser
✅ Do: Start backend server and go to http://localhost:5000

### Mistake 2: Using Development Port
❌ Don't: http://localhost:5173 (when not in dev mode)
✅ Do: http://localhost:5000 (production mode)

### Mistake 3: Not Starting the Server
❌ Don't: Just build and expect it to work
✅ Do: Build, then start the backend server

### Mistake 4: Wrong Directory
❌ Don't: Run `npm start` from project root
✅ Do: Run `npm start` from backend directory

## Complete Startup Sequence

```bash
# 1. Make sure you're in the project root
cd /path/to/courses

# 2. Build frontend (if not already built)
npm run build

# 3. Go to backend directory
cd backend

# 4. Make sure .env is configured
# Edit .env if needed

# 5. Start the server
npm start

# 6. Wait for "Server running" message

# 7. Open browser
# Go to: http://localhost:5000
```

## Development vs Production

### Development Mode
```bash
# From project root
npm run dev
```
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:5000 (Express server)
- Hot reload enabled
- Use this for development

### Production Mode
```bash
# Build frontend
npm run build

# Start backend
cd backend
npm start
```
- Everything: http://localhost:5000 (Express serves both)
- No hot reload
- Optimized build
- Use this for production/testing

## Quick Diagnostic

Run these commands to diagnose:

```bash
# 1. Check if build exists
ls frontend/dist/index.html

# 2. Check if backend dependencies installed
ls backend/node_modules

# 3. Check if .env exists
ls backend/.env

# 4. Test server
npm run test:server

# 5. Check what's running on port 5000
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

## Still Not Working?

### Option 1: Clean Restart
```bash
# Stop all Node processes
# Windows: Ctrl+C in terminal
# Linux/Mac: Ctrl+C or killall node

# Rebuild everything
npm run build:full
npm run build

# Start fresh
cd backend
npm start
```

### Option 2: Check Logs
Look at the terminal where you ran `npm start`. Any errors?

Common errors:
- `EADDRINUSE`: Port already in use (change PORT in .env)
- `MongooseError`: Database connection issue (check MONGODB_URI)
- `MODULE_NOT_FOUND`: Missing dependencies (run npm install)

### Option 3: Use Development Mode
If production mode isn't working, try development:
```bash
npm run dev
```
Then access: http://localhost:5173

## Prevention

To avoid this in the future:

1. ✅ Always start the backend server before accessing the app
2. ✅ Use the correct URL (port 5000 for production)
3. ✅ Check terminal for "Server running" message
4. ✅ Verify MongoDB connection
5. ✅ Keep .env file updated

## Summary

**The Fix**: Just start the backend server!
```bash
cd backend
npm start
```

Then go to: http://localhost:5000

That's it! 🎉

---

**Need more help?** See START_SERVER.md for detailed instructions.
