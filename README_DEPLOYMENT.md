# 🚀 Deployment README

## Quick Summary

Your application has been fixed and is ready for production deployment. The "Not Found" error you're seeing is **CORRECT** behavior.

## The Issue You're Experiencing

You're accessing `https://courses-lilac-six.vercel.app` (backend) in your browser and seeing "Not Found". **This is expected!**

### Why?
- `courses-lilac-six.vercel.app` = Backend API server (not a website)
- `courses-fr.vercel.app` = Frontend website (what users should access)

## What You Need to Do

### 1. Access the Correct URL

**❌ STOP accessing:**
```
https://courses-lilac-six.vercel.app
```

**✅ START accessing:**
```
https://courses-fr.vercel.app
```

### 2. Set Environment Variables in Vercel

#### Backend (courses-lilac-six)
Go to: Vercel Dashboard → courses-lilac-six → Settings → Environment Variables

Add:
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

#### Frontend (courses-fr)
Go to: Vercel Dashboard → courses-fr → Settings → Environment Variables

Add:
```
VITE_API_URL=https://courses-lilac-six.vercel.app/api
VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
```

### 3. Deploy

```bash
git add .
git commit -m "Fix production deployment"
git push origin main
```

### 4. Test

Visit: `https://courses-fr.vercel.app`

## Files Changed

- ✅ `backend/index.js` - Conditional frontend serving
- ✅ `backend/vercel.json` - Backend routing
- ✅ `frontend/vercel.json` - Frontend SPA routing (NEW)
- ✅ `backend/.env.production` - Production environment (NEW)

## Documentation Created

1. **UNDERSTAND_THIS.md** - Read this first!
2. **ARCHITECTURE_DIAGRAM.txt** - Visual diagram
3. **DEPLOY_NOW.md** - Quick deployment guide
4. **CORRECT_DEPLOYMENT_ARCHITECTURE.md** - Detailed architecture
5. **VERCEL_ENV_VARIABLES.md** - Environment variables reference

## Key Points

1. **Two Separate Deployments:**
   - Backend: `courses-lilac-six.vercel.app` (API only)
   - Frontend: `courses-fr.vercel.app` (Website)

2. **Users Access Frontend:**
   - `https://courses-fr.vercel.app` ✅

3. **Backend is for API Only:**
   - `https://courses-lilac-six.vercel.app/api/*` ✅
   - Direct access shows "Not Found" (correct!)

4. **Password Reset:**
   - Email link: `https://courses-fr.vercel.app/reset-password/TOKEN`
   - NOT localhost

## Status

✅ Code fixed and ready for deployment
✅ Local development works
✅ Production architecture correct
✅ Documentation complete

## Next Steps

1. Read `UNDERSTAND_THIS.md`
2. Set environment variables in Vercel
3. Deploy to Vercel
4. Access `https://courses-fr.vercel.app` (NOT backend URL)

## Support

If you have questions, refer to:
- `UNDERSTAND_THIS.md` - Explains the architecture
- `ARCHITECTURE_DIAGRAM.txt` - Visual diagram
- `DEPLOY_NOW.md` - Step-by-step deployment

**Last Updated**: March 25, 2026
