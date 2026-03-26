# 🔐 Vercel Environment Variables - Quick Reference

## ⚠️ CRITICAL: Set These in Vercel Dashboard

### Backend Project (courses-lilac-six.vercel.app)

Go to: **Vercel Dashboard → courses-lilac-six → Settings → Environment Variables**

Add these variables:

| Variable Name | Value |
|--------------|-------|
| `MONGODB_URI` | `mongodb+srv://sahilvanzara49_db_user:Sahil2306@cluster-1.x5kcibb.mongodb.net/?appName=Cluster-1` |
| `JWT_SECRET` | `supersecretkey123` |
| `EMAIL_USER` | `sahilvanzara49@gmail.com` |
| `EMAIL_PASS` | `iigjcpurtituikis` |
| `FRONTEND_URL` | `https://courses-fr.vercel.app` |
| `RAZORPAY_KEY_ID` | `rzp_test_SUkf1Ndyy9Mvnk` |
| `RAZORPAY_KEY_SECRET` | `klu4beIZ1EMDi2F1OwYlRg3n` |

**MOST IMPORTANT**: `FRONTEND_URL=https://courses-fr.vercel.app`

This ensures password reset emails use the production URL, not localhost!

---

### Frontend Project (courses-fr.vercel.app)

Go to: **Vercel Dashboard → courses-fr → Settings → Environment Variables**

Add these variables:

| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | `https://courses-lilac-six.vercel.app/api` |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_SUkf1Ndyy9Mvnk` |

---

## How to Add Environment Variables in Vercel

1. **Login to Vercel Dashboard**
   - Go to: https://vercel.com/dashboard

2. **Select Project**
   - Click on backend project: `courses-lilac-six`
   - Or frontend project: `courses-fr`

3. **Navigate to Settings**
   - Click "Settings" tab at the top

4. **Go to Environment Variables**
   - Click "Environment Variables" in the left sidebar

5. **Add Variable**
   - Click "Add" button
   - Enter variable name (e.g., `FRONTEND_URL`)
   - Enter value (e.g., `https://courses-fr.vercel.app`)
   - Select environment: Production, Preview, Development (select all)
   - Click "Save"

6. **Repeat for All Variables**
   - Add each variable from the tables above

7. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Or push new commit to trigger auto-deployment

---

## Verification

### After Setting Backend Variables

Test the health endpoint:
```bash
curl https://courses-lilac-six.vercel.app/api/health
```

Should return:
```json
{"status":"ok","message":"Server is running"}
```

### After Setting Frontend Variables

Visit the frontend:
```
https://courses-fr.vercel.app
```

Should load the home page without errors.

---

## Password Reset Test

1. Go to: `https://courses-fr.vercel.app/login`
2. Click "Forgot password?"
3. Enter your email
4. Check email for reset link
5. Verify link shows: `https://courses-fr.vercel.app/reset-password/TOKEN`
6. Should NOT show `localhost`

---

## Common Issues

### Issue: Password reset still shows localhost

**Cause**: `FRONTEND_URL` not set in Vercel backend environment variables

**Fix**:
1. Go to Vercel Dashboard → courses-lilac-six → Settings → Environment Variables
2. Add: `FRONTEND_URL=https://courses-fr.vercel.app`
3. Redeploy backend
4. Request NEW password reset

### Issue: CORS errors in browser console

**Cause**: Backend CORS not configured for production frontend URL

**Fix**:
1. Code already updated in `backend/index.js`
2. Push changes to GitHub
3. Vercel will auto-deploy

### Issue: API calls failing (404 or network errors)

**Cause**: Frontend `VITE_API_URL` not set correctly

**Fix**:
1. Go to Vercel Dashboard → courses-fr → Settings → Environment Variables
2. Add: `VITE_API_URL=https://courses-lilac-six.vercel.app/api`
3. Redeploy frontend

---

## Environment Variable Checklist

### Backend (courses-lilac-six)
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] FRONTEND_URL (CRITICAL!)
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET

### Frontend (courses-fr)
- [ ] VITE_API_URL
- [ ] VITE_RAZORPAY_KEY_ID

---

## Quick Copy-Paste

### Backend Variables (Copy All)
```
MONGODB_URI=mongodb+srv://sahilvanzara49_db_user:Sahil2306@cluster-1.x5kcibb.mongodb.net/?appName=Cluster-1
JWT_SECRET=supersecretkey123
EMAIL_USER=sahilvanzara49@gmail.com
EMAIL_PASS=iigjcpurtituikis
FRONTEND_URL=https://courses-fr.vercel.app
RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
RAZORPAY_KEY_SECRET=klu4beIZ1EMDi2F1OwYlRg3n
```

### Frontend Variables (Copy All)
```
VITE_API_URL=https://courses-lilac-six.vercel.app/api
VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
```

---

## After Setting Variables

1. **Redeploy Both Projects**
   - Backend: Push to GitHub or manual redeploy
   - Frontend: Push to GitHub or manual redeploy

2. **Wait for Deployment**
   - Usually takes 1-2 minutes

3. **Test Everything**
   - Home page loads
   - Login works
   - Password reset uses production URL
   - Course browsing works
   - Payment flow works

---

**Status**: Environment variables documented ✅
**Last Updated**: March 25, 2026
**Action Required**: Set these variables in Vercel Dashboard
