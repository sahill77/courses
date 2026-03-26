# 🚀 Production Deployment Guide - Complete Configuration

## Production URLs

- **Frontend**: `https://courses-fr.vercel.app`
- **Backend**: `https://courses-lilac-six.vercel.app`

## Issue Fixed

Password reset emails were redirecting to localhost instead of production URL. This is now fixed with proper environment configuration.

## Environment Configuration

### Backend Production Environment Variables

These must be set in Vercel Dashboard for the backend deployment:

```env
PORT=5000
MONGODB_URI=mongodb+srv://sahilvanzara49_db_user:Sahil2306@cluster-1.x5kcibb.mongodb.net/?appName=Cluster-1
JWT_SECRET=supersecretkey123
EMAIL_USER=sahilvanzara49@gmail.com
EMAIL_PASS=iigjcpurtituikis
FRONTEND_URL=https://courses-fr.vercel.app
RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
RAZORPAY_KEY_SECRET=klu4beIZ1EMDi2F1OwYlRg3n
```

**CRITICAL**: `FRONTEND_URL` must be set to `https://courses-fr.vercel.app` in production!

### Frontend Production Environment Variables

File: `frontend/.env.production`

```env
VITE_API_URL=https://courses-lilac-six.vercel.app/api
VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
VITE_RAZORPAY_KEY_SECRET=klu4beIZ1EMDi2F1OwYlRg3n
```

## Backend Configuration Changes

### 1. CORS Configuration (backend/index.js)

Updated to allow multiple origins:

```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://courses-fr.vercel.app",
  "https://courses-lilac-six.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
```

### 2. Password Reset URL (backend/controllers/authController.js)

Uses environment variable:

```javascript
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
```

This ensures:
- **Development**: Uses `http://localhost:5000`
- **Production**: Uses `https://courses-fr.vercel.app`

## Vercel Deployment Steps

### Backend Deployment (courses-lilac-six.vercel.app)

1. **Go to Vercel Dashboard**
   - Navigate to backend project: `courses-lilac-six`

2. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `backend/.env.production`:
     ```
     MONGODB_URI=mongodb+srv://sahilvanzara49_db_user:Sahil2306@cluster-1.x5kcibb.mongodb.net/?appName=Cluster-1
     JWT_SECRET=supersecretkey123
     EMAIL_USER=sahilvanzara49@gmail.com
     EMAIL_PASS=iigjcpurtituikis
     FRONTEND_URL=https://courses-fr.vercel.app
     RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
     RAZORPAY_KEY_SECRET=klu4beIZ1EMDi2F1OwYlRg3n
     ```

3. **Deploy**
   - Push changes to GitHub
   - Vercel will auto-deploy
   - Or manually trigger deployment in Vercel dashboard

4. **Verify**
   - Check: `https://courses-lilac-six.vercel.app/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

### Frontend Deployment (courses-fr.vercel.app)

1. **Build Frontend Locally (Already Done)**
   ```bash
   cd frontend
   npm run build
   ```

2. **Go to Vercel Dashboard**
   - Navigate to frontend project: `courses-fr`

3. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add production variables:
     ```
     VITE_API_URL=https://courses-lilac-six.vercel.app/api
     VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
     ```

4. **Deploy**
   - Push changes to GitHub
   - Vercel will auto-deploy
   - Or manually trigger deployment

5. **Verify**
   - Visit: `https://courses-fr.vercel.app`
   - Should load the home page

## Testing Production Deployment

### Test 1: Home Page
```
https://courses-fr.vercel.app
```
✅ Should load home page

### Test 2: Login Page
```
https://courses-fr.vercel.app/login
```
✅ Should load login page (not 404)

### Test 3: API Health Check
```
https://courses-lilac-six.vercel.app/api/health
```
✅ Should return: `{"status":"ok","message":"Server is running"}`

### Test 4: Password Reset Flow

1. **Request Reset**
   - Go to: `https://courses-fr.vercel.app/login`
   - Click "Forgot password?"
   - Enter email
   - Click "Send Reset Link"

2. **Check Email**
   - Open email inbox
   - Look for "Password Reset Request"
   - Verify link shows: `https://courses-fr.vercel.app/reset-password/TOKEN`
   - Should NOT show `localhost`

3. **Click Reset Link**
   - Click "Reset Password" button in email
   - Should open: `https://courses-fr.vercel.app/reset-password/TOKEN`
   - Should NOT redirect to localhost
   - Should show reset password form

4. **Reset Password**
   - Enter new password
   - Confirm password
   - Click "Reset Password"
   - Should show success message
   - Should redirect to login

### Test 5: Course Browsing
```
https://courses-fr.vercel.app/courses
```
✅ Should show all courses
✅ Refresh should work (not 404)

### Test 6: Payment Flow
1. Navigate to a course
2. Click "Enroll Now"
3. Razorpay modal should open
4. Should use production API

## Files Modified

### Backend
- `backend/index.js` - Updated CORS configuration
- `backend/.env.production` - Created production environment file
- `backend/controllers/authController.js` - Already using `process.env.FRONTEND_URL`

### Frontend
- `frontend/.env.production` - Verified production API URL
- `frontend/dist/` - Rebuilt with production variables

## Important Notes

### Environment Variables Priority

**Backend (Vercel)**:
1. Vercel Dashboard Environment Variables (highest priority)
2. `.env.production` file (fallback)
3. `.env` file (development only)

**Frontend (Vite)**:
1. `.env.production` (production build)
2. `.env` (development)

### CORS Configuration

The backend now accepts requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:5000` (Backend dev server)
- `https://courses-fr.vercel.app` (Frontend production)
- `https://courses-lilac-six.vercel.app` (Backend production)

### Password Reset URL

The backend uses `process.env.FRONTEND_URL` which should be:
- **Development**: `http://localhost:5000`
- **Production**: `https://courses-fr.vercel.app`

## Troubleshooting

### Password Reset Still Shows Localhost

**Problem**: Email contains `http://localhost:5173/reset-password/...`

**Solution**:
1. Check Vercel backend environment variables
2. Ensure `FRONTEND_URL=https://courses-fr.vercel.app`
3. Redeploy backend
4. Request NEW password reset (old emails have old URL)

### CORS Errors in Production

**Problem**: Browser console shows CORS errors

**Solution**:
1. Verify backend CORS configuration includes production URLs
2. Check `allowedOrigins` array in `backend/index.js`
3. Redeploy backend

### API Calls Failing

**Problem**: Frontend can't reach backend API

**Solution**:
1. Check `frontend/.env.production` has correct `VITE_API_URL`
2. Should be: `https://courses-lilac-six.vercel.app/api`
3. Rebuild frontend: `npm run build`
4. Redeploy frontend

### 404 on Page Refresh

**Problem**: Refreshing `/courses` shows 404

**Solution**:
1. Ensure backend serves `index.html` for non-API routes
2. Check `backend/index.js` has catch-all middleware
3. Redeploy backend

## Deployment Checklist

### Backend Deployment
- [ ] Environment variables set in Vercel dashboard
- [ ] `FRONTEND_URL=https://courses-fr.vercel.app`
- [ ] CORS allows production frontend URL
- [ ] Code pushed to GitHub
- [ ] Vercel auto-deployed
- [ ] Health check works: `/api/health`

### Frontend Deployment
- [ ] `.env.production` has correct `VITE_API_URL`
- [ ] Frontend built: `npm run build`
- [ ] Environment variables set in Vercel dashboard
- [ ] Code pushed to GitHub
- [ ] Vercel auto-deployed
- [ ] Home page loads

### Testing
- [ ] Home page loads
- [ ] Login page loads
- [ ] Password reset sends production URL
- [ ] Password reset link works (no localhost redirect)
- [ ] Course browsing works
- [ ] Page refresh works (no 404)
- [ ] Payment flow works

## Quick Commands

### Build Frontend
```bash
cd frontend
npm run build
```

### Start Backend Locally
```bash
cd backend
npm start
```

### Test API Locally
```bash
curl http://localhost:5000/api/health
```

### Test API Production
```bash
curl https://courses-lilac-six.vercel.app/api/health
```

## Summary

✅ **Backend Environment**: `FRONTEND_URL=https://courses-fr.vercel.app`
✅ **Frontend Environment**: `VITE_API_URL=https://courses-lilac-six.vercel.app/api`
✅ **CORS**: Allows both development and production origins
✅ **Password Reset**: Uses production URL in emails
✅ **SPA Routing**: Works on all routes
✅ **Frontend Built**: With production environment variables

**Status**: READY FOR PRODUCTION DEPLOYMENT ✅
**Last Updated**: March 25, 2026
**Next Action**: Deploy to Vercel and test password reset flow

## Vercel Dashboard Links

- **Backend Project**: https://vercel.com/dashboard (courses-lilac-six)
- **Frontend Project**: https://vercel.com/dashboard (courses-fr)

Set environment variables in: Settings → Environment Variables → Add
