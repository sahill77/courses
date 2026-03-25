# 💳 Payment Setup Guide

## Quick Fix for "Razorpay key not configured"

The error occurs because environment variables weren't set. I've now created the files, but you need to restart the backend.

## Step 1: Verify Files Exist

Check these files exist:
- ✅ `frontend/.env` (for development)
- ✅ `frontend/.env.production` (for production)
- ✅ `backend/.env` (for backend)

## Step 2: Update Razorpay Keys

### Get Your Razorpay Keys
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Login with your account
3. Go to Settings → API Keys
4. Copy your Test Key ID and Key Secret

### Update Backend (.env)
Edit `backend/.env` and ensure these lines exist:
```env
RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
```

⚠️ Replace with your actual keys from Razorpay Dashboard!

### Update Frontend (.env.production)
Edit `frontend/.env.production`:
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
```

⚠️ Use the same Key ID as backend!

### Update Frontend (.env) - For Development
Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
```

## Step 3: Rebuild Frontend

After updating the keys:
```bash
npm run build --prefix frontend
```

## Step 4: Restart Backend

```bash
cd backend
npm start
```

## Step 5: Test Payment

1. Go to http://localhost:5000
2. Browse a course with price > ₹0
3. Click "Enroll Now"
4. Razorpay modal should open
5. Use test card: **4111 1111 1111 1111**
6. CVV: Any 3 digits
7. Expiry: Any future date

## Verification Checklist

- [ ] `backend/.env` has `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- [ ] `frontend/.env.production` has `VITE_RAZORPAY_KEY_ID`
- [ ] Frontend rebuilt (`npm run build --prefix frontend`)
- [ ] Backend restarted (`cd backend && npm start`)
- [ ] Browser refreshed (Ctrl+F5)
- [ ] No console errors (F12 → Console)

## Test Cards

### Successful Payment
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

### Failed Payment (for testing)
```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

## Common Issues

### Issue: Still showing "Razorpay key not configured"
**Solution**: 
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Rebuild frontend again
4. Restart backend

### Issue: "Key ID is invalid"
**Solution**: 
1. Verify key in Razorpay Dashboard
2. Make sure it starts with `rzp_test_` (for test mode)
3. Copy-paste carefully (no extra spaces)

### Issue: Payment modal doesn't open
**Solution**:
1. Check browser console for errors
2. Disable ad blockers
3. Try different browser
4. Check if Razorpay script loads (view page source)

## Environment Variables Explained

### VITE_RAZORPAY_KEY_ID
- This is your **public** Razorpay Key ID
- Safe to expose in frontend
- Starts with `rzp_test_` (test mode) or `rzp_live_` (live mode)
- Get from: Razorpay Dashboard → Settings → API Keys

### RAZORPAY_KEY_SECRET
- This is your **private** Razorpay Key Secret
- NEVER expose in frontend
- Only in backend `.env` file
- Used to verify payment signatures
- Get from: Razorpay Dashboard → Settings → API Keys

## Quick Commands

```bash
# Check if env files exist
ls frontend/.env*
ls backend/.env

# View Razorpay keys (backend)
cd backend
cat .env | grep RAZORPAY

# View Razorpay keys (frontend)
cd frontend
cat .env.production | grep RAZORPAY

# Rebuild and restart
npm run build --prefix frontend
cd backend
npm start
```

## Success Indicators

When everything is working:
1. ✅ No console errors
2. ✅ "Enroll Now" button works
3. ✅ Razorpay modal opens
4. ✅ Can enter card details
5. ✅ Payment processes
6. ✅ Redirects to dashboard after success

## Need Help?

See `PAYMENT_TROUBLESHOOTING.md` for detailed debugging steps.

---

**Current Status**: 
- ✅ Environment files created
- ✅ Frontend rebuilt
- ⚠️ **Action Required**: Restart backend server!

**Next Step**: 
```bash
cd backend
npm start
```

Then test payment at: http://localhost:5000
