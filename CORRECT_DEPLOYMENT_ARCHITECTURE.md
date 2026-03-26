# 🏗️ Correct Deployment Architecture

## ⚠️ IMPORTANT: Understanding the Architecture

Your application has TWO separate Vercel deployments:

### 1. Backend API Server
- **URL**: `https://courses-lilac-six.vercel.app`
- **Purpose**: Serves ONLY API endpoints
- **Access**: `/api/*` routes only
- **DO NOT**: Access this URL directly in browser (will show 404)

### 2. Frontend React App
- **URL**: `https://courses-fr.vercel.app`
- **Purpose**: Serves the React application
- **Access**: All user-facing pages
- **DO**: Access this URL in browser

## The Problem You're Experiencing

You're accessing `https://courses-lilac-six.vercel.app` (backend) directly in the browser and seeing "Not Found". This is CORRECT behavior!

### Why?
- The backend is an API server, not a website
- It only responds to `/api/*` endpoints
- Users should NEVER access the backend URL directly
- Users should ONLY access `https://courses-fr.vercel.app`

## Correct Usage

### ❌ WRONG - Don't Do This
```
https://courses-lilac-six.vercel.app
https://courses-lilac-six.vercel.app/login
https://courses-lilac-six.vercel.app/courses
```
These will show "Not Found" because the backend doesn't serve HTML pages.

### ✅ CORRECT - Do This
```
https://courses-fr.vercel.app
https://courses-fr.vercel.app/login
https://courses-fr.vercel.app/courses
https://courses-fr.vercel.app/reset-password/TOKEN
```
These will work because the frontend serves the React app.

### ✅ CORRECT - API Calls
```
https://courses-lilac-six.vercel.app/api/health
https://courses-lilac-six.vercel.app/api/auth/login
https://courses-lilac-six.vercel.app/api/courses
```
These work because they're API endpoints.

## How It Works

### Request Flow

```
User visits: https://courses-fr.vercel.app/login
    ↓
Frontend Vercel serves: index.html
    ↓
React app loads in browser
    ↓
React Router shows: Login page
    ↓
User submits login form
    ↓
Frontend makes API call to: https://courses-lilac-six.vercel.app/api/auth/login
    ↓
Backend processes request
    ↓
Backend returns: JWT token
    ↓
Frontend stores token
    ↓
User is logged in
```

## Password Reset Flow

### Correct Flow

1. **User requests reset**
   - Visits: `https://courses-fr.vercel.app/login`
   - Clicks "Forgot password?"
   - Enters email

2. **Frontend sends API request**
   - POST to: `https://courses-lilac-six.vercel.app/api/auth/forgot-password`

3. **Backend sends email**
   - Email contains: `https://courses-fr.vercel.app/reset-password/TOKEN`
   - NOT: `https://courses-lilac-six.vercel.app/reset-password/TOKEN`
   - NOT: `http://localhost:5173/reset-password/TOKEN`

4. **User clicks link**
   - Opens: `https://courses-fr.vercel.app/reset-password/TOKEN`
   - Frontend loads reset password page
   - User enters new password

5. **Frontend sends API request**
   - POST to: `https://courses-lilac-six.vercel.app/api/auth/reset-password/TOKEN`

6. **Backend updates password**
   - Password reset successful
   - User can login with new password

## Configuration Files

### Backend (courses-lilac-six)

**File: `backend/index.js`**
```javascript
// In production, backend does NOT serve frontend
if (process.env.NODE_ENV !== 'production') {
  // Development: serve frontend
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
} else {
  // Production: return 404 for non-API routes
  app.use((req, res) => {
    res.status(404).json({ 
      error: "Not Found",
      message: "This is the API server. Please access the frontend at https://courses-fr.vercel.app"
    });
  });
}
```

**File: `backend/vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "index.js"
    },
    {
      "src": "/uploads/(.*)",
      "dest": "index.js"
    },
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### Frontend (courses-fr)

**File: `frontend/vercel.json`**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes serve `index.html` so React Router can handle routing.

## Environment Variables

### Backend (courses-lilac-six) - Vercel Dashboard

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://sahilvanzara49_db_user:Sahil2306@cluster-1.x5kcibb.mongodb.net/?appName=Cluster-1
JWT_SECRET=supersecretkey123
EMAIL_USER=sahilvanzara49@gmail.com
EMAIL_PASS=iigjcpurtituikis
FRONTEND_URL=https://courses-fr.vercel.app
RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
RAZORPAY_KEY_SECRET=klu4beIZ1EMDi2F1OwYlRg3n
```

**CRITICAL**: 
- `NODE_ENV=production` - Tells backend NOT to serve frontend
- `FRONTEND_URL=https://courses-fr.vercel.app` - Used in password reset emails

### Frontend (courses-fr) - Vercel Dashboard

```
VITE_API_URL=https://courses-lilac-six.vercel.app/api
VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
```

## Local Development

In local development, the backend CAN serve the frontend:

```
http://localhost:5000 → Serves React app
http://localhost:5000/api/* → Serves API
```

This works because `NODE_ENV` is not set to 'production' locally.

## Deployment Steps

### Step 1: Set Environment Variables

**Backend (courses-lilac-six)**
1. Go to Vercel Dashboard
2. Select `courses-lilac-six` project
3. Settings → Environment Variables
4. Add all backend variables (including `NODE_ENV=production`)

**Frontend (courses-fr)**
1. Go to Vercel Dashboard
2. Select `courses-fr` project
3. Settings → Environment Variables
4. Add all frontend variables

### Step 2: Deploy

```bash
git add .
git commit -m "Fix deployment architecture"
git push origin main
```

Both projects will auto-deploy.

### Step 3: Test

**Test Frontend**
```
✅ https://courses-fr.vercel.app
✅ https://courses-fr.vercel.app/login
✅ https://courses-fr.vercel.app/courses
✅ https://courses-fr.vercel.app/reset-password/TOKEN
```

**Test Backend API**
```bash
curl https://courses-lilac-six.vercel.app/api/health
# Should return: {"status":"ok","message":"Server is running"}
```

**Don't Test Backend Root**
```
❌ https://courses-lilac-six.vercel.app
# Will show 404 - this is CORRECT!
```

## Common Mistakes

### Mistake 1: Accessing Backend URL Directly
**Problem**: Typing `https://courses-lilac-six.vercel.app` in browser
**Result**: "Not Found" error
**Solution**: Access `https://courses-fr.vercel.app` instead

### Mistake 2: Wrong FRONTEND_URL
**Problem**: `FRONTEND_URL=http://localhost:5173` in production
**Result**: Password reset emails have localhost URLs
**Solution**: Set `FRONTEND_URL=https://courses-fr.vercel.app` in Vercel

### Mistake 3: Missing NODE_ENV
**Problem**: `NODE_ENV` not set to 'production' in Vercel
**Result**: Backend tries to serve frontend files (which don't exist on Vercel)
**Solution**: Set `NODE_ENV=production` in Vercel backend environment variables

### Mistake 4: Wrong API URL in Frontend
**Problem**: `VITE_API_URL=http://localhost:5000/api` in production
**Result**: Frontend can't reach backend
**Solution**: Set `VITE_API_URL=https://courses-lilac-six.vercel.app/api` in Vercel

## Testing Checklist

### Frontend Tests
- [ ] Home page loads: `https://courses-fr.vercel.app`
- [ ] Login page loads: `https://courses-fr.vercel.app/login`
- [ ] Courses page loads: `https://courses-fr.vercel.app/courses`
- [ ] Refresh works (no 404)
- [ ] Direct URL access works

### Backend API Tests
- [ ] Health check: `curl https://courses-lilac-six.vercel.app/api/health`
- [ ] Login API works
- [ ] Courses API works
- [ ] Password reset API works

### Password Reset Test
- [ ] Request reset from frontend
- [ ] Email contains: `https://courses-fr.vercel.app/reset-password/TOKEN`
- [ ] Email does NOT contain: `localhost`
- [ ] Clicking link opens frontend reset page
- [ ] Reset password works

## Summary

**Two Separate Deployments:**
1. **Backend** (`courses-lilac-six.vercel.app`) - API only
2. **Frontend** (`courses-fr.vercel.app`) - React app

**Users Access:**
- ✅ Frontend URL: `https://courses-fr.vercel.app`
- ❌ Backend URL: `https://courses-lilac-six.vercel.app` (API only)

**Password Reset:**
- Email link: `https://courses-fr.vercel.app/reset-password/TOKEN`
- NOT: `localhost` or backend URL

**Status**: Architecture corrected ✅
**Last Updated**: March 25, 2026
**Next Action**: Deploy to Vercel with correct environment variables
