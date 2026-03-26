# 🚀 Deploy Now - Quick Start

## What Was Fixed

1. ✅ Backend now only serves API in production (not frontend)
2. ✅ Frontend has proper Vercel configuration for SPA routing
3. ✅ Password reset uses production URL
4. ✅ CORS allows both frontend and backend URLs

## Files Changed

- `backend/index.js` - Conditional frontend serving (dev only)
- `backend/vercel.json` - Backend routing configuration
- `frontend/vercel.json` - Frontend SPA routing (NEW FILE)
- `backend/.env.production` - Production environment template

## Deploy Steps

### 1. Set Backend Environment Variables in Vercel

Go to: **Vercel Dashboard → courses-lilac-six → Settings → Environment Variables**

Add these 8 variables:

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

**MOST IMPORTANT:**
- `NODE_ENV=production` (tells backend NOT to serve frontend)
- `FRONTEND_URL=https://courses-fr.vercel.app` (for password reset emails)

### 2. Set Frontend Environment Variables in Vercel

Go to: **Vercel Dashboard → courses-fr → Settings → Environment Variables**

Add these 2 variables:

```
VITE_API_URL=https://courses-lilac-six.vercel.app/api
VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
```

### 3. Deploy to Vercel

```bash
git add .
git commit -m "Fix production deployment architecture"
git push origin main
```

Vercel will automatically deploy both projects.

### 4. Test

**Access Frontend (Users should use this):**
```
https://courses-fr.vercel.app
https://courses-fr.vercel.app/login
https://courses-fr.vercel.app/courses
```

**Test Backend API:**
```bash
curl https://courses-lilac-six.vercel.app/api/health
```

**Test Password Reset:**
1. Go to: `https://courses-fr.vercel.app/login`
2. Click "Forgot password?"
3. Enter email
4. Check email - link should be: `https://courses-fr.vercel.app/reset-password/TOKEN`

## Important Notes

### ⚠️ Don't Access Backend URL Directly

**This is WRONG:**
```
https://courses-lilac-six.vercel.app ❌
```
Will show "Not Found" - this is CORRECT behavior! Backend is API only.

**This is CORRECT:**
```
https://courses-fr.vercel.app ✅
```
This is the user-facing website.

### ⚠️ Backend URL is for API Only

The backend URL (`courses-lilac-six.vercel.app`) should ONLY be used for API calls:
```
https://courses-lilac-six.vercel.app/api/health ✅
https://courses-lilac-six.vercel.app/api/auth/login ✅
https://courses-lilac-six.vercel.app/api/courses ✅
```

### ⚠️ Users Access Frontend URL

All users should access:
```
https://courses-fr.vercel.app
```

This serves the React app, which then makes API calls to the backend.

## Architecture

```
User Browser
    ↓
https://courses-fr.vercel.app (Frontend - React App)
    ↓
Makes API calls to
    ↓
https://courses-lilac-six.vercel.app/api/* (Backend - API Server)
    ↓
MongoDB Database
```

## What Happens After Deployment

### Backend (courses-lilac-six.vercel.app)
- Serves ONLY `/api/*` endpoints
- Returns 404 for non-API routes (this is correct!)
- Sends password reset emails with frontend URL

### Frontend (courses-fr.vercel.app)
- Serves React application
- All routes work (login, courses, reset-password, etc.)
- Makes API calls to backend
- Users access this URL

## Verification

After deployment, verify:

1. **Frontend loads:**
   ```
   https://courses-fr.vercel.app
   ```
   Should show home page

2. **API works:**
   ```bash
   curl https://courses-lilac-six.vercel.app/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

3. **Password reset:**
   - Request reset
   - Email should contain: `https://courses-fr.vercel.app/reset-password/TOKEN`
   - Should NOT contain: `localhost` or `courses-lilac-six`

## Troubleshooting

### "Not Found" on Backend URL
**This is correct!** Don't access `courses-lilac-six.vercel.app` directly.
Use `courses-fr.vercel.app` instead.

### Password Reset Still Shows Localhost
1. Check backend environment variables in Vercel
2. Ensure `FRONTEND_URL=https://courses-fr.vercel.app`
3. Ensure `NODE_ENV=production`
4. Redeploy backend
5. Request NEW password reset

### CORS Errors
1. Check backend CORS configuration includes both URLs
2. Redeploy backend

### API Calls Failing
1. Check frontend `VITE_API_URL` in Vercel
2. Should be: `https://courses-lilac-six.vercel.app/api`
3. Redeploy frontend

## Summary

✅ Backend serves API only in production
✅ Frontend serves React app with SPA routing
✅ Password reset uses production frontend URL
✅ Local development still works (backend serves frontend locally)

**Status**: Ready to deploy ✅
**Action**: Set environment variables in Vercel and deploy
