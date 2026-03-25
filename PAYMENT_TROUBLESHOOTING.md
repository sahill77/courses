# 💳 Payment Troubleshooting Guide

## Common Payment Errors

### Error: "Payment Failed"

This error can occur for several reasons. Follow these steps to diagnose and fix:

## Step 1: Check Razorpay Configuration

### Backend (.env)
Ensure these variables are set in `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### Frontend (.env.production)
Ensure this is set in `frontend/.env.production`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_SUkf1Ndyy9Mvnk
```

⚠️ **Important**: After changing environment variables, you MUST rebuild:
```bash
npm run build --prefix frontend
cd backend
npm start
```

## Step 2: Verify Razorpay Keys

### Test Mode Keys
- Key ID starts with: `rzp_test_`
- Use test cards for testing

### Live Mode Keys
- Key ID starts with: `rzp_live_`
- Use real cards (charges apply)

### Get Your Keys
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate keys if not already done
4. Copy Key ID and Key Secret

## Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors

### Common Console Errors

#### "Razorpay SDK not loaded"
**Solution**: Refresh the page. The Razorpay script should load from CDN.

#### "Razorpay key not configured"
**Solution**: 
1. Check `frontend/.env.production` has `VITE_RAZORPAY_KEY_ID`
2. Rebuild frontend: `npm run build --prefix frontend`
3. Restart backend

#### "Failed to create payment order"
**Solution**: Check backend logs for errors. Likely issues:
- Razorpay keys missing in `backend/.env`
- Invalid Razorpay keys
- Network connectivity issues

## Step 4: Test Payment Flow

### Test with Free Course First
1. Set course price to 0
2. Try enrolling
3. If this works, payment integration is the issue

### Test Razorpay Connection
```bash
# From backend directory
node -e "
const Razorpay = require('razorpay');
require('dotenv').config();
const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
console.log('Razorpay initialized successfully');
"
```

## Step 5: Check Backend Logs

Look for these in terminal where backend is running:

### Success
```
Payment order created: order_xxxxx
Payment verified successfully
```

### Errors
```
Razorpay keys are missing
Razorpay Order Error: ...
Payment Verification Error: ...
```

## Step 6: Test Cards (Test Mode)

Use these test cards in Razorpay test mode:

### Successful Payment
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

### Failed Payment
- Card: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

## Step 7: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Try payment
4. Look for these requests:

### POST /api/payments/order
- Should return: `{ id, currency, amount }`
- Status: 200 OK

### POST /api/payments/verify
- Should return: `{ message: "Payment verified..." }`
- Status: 200 OK

## Common Issues & Solutions

### Issue 1: "Key ID is invalid"
**Cause**: Wrong Razorpay Key ID

**Solution**:
1. Verify key in Razorpay Dashboard
2. Update `backend/.env` and `frontend/.env.production`
3. Rebuild and restart

### Issue 2: "Signature verification failed"
**Cause**: Wrong Razorpay Key Secret

**Solution**:
1. Verify secret in Razorpay Dashboard
2. Update `backend/.env`
3. Restart backend (no rebuild needed)

### Issue 3: Payment modal doesn't open
**Cause**: Razorpay script not loaded

**Solution**:
1. Check `frontend/index.html` has:
   ```html
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```
2. Check browser console for script loading errors
3. Try different network/disable ad blockers

### Issue 4: "Amount must be at least INR 1.00"
**Cause**: Course price is less than ₹1

**Solution**:
1. Set course price to at least ₹1
2. Or make course free (₹0) to skip payment

### Issue 5: Payment succeeds but enrollment fails
**Cause**: Database error or enrollment logic issue

**Solution**:
1. Check backend logs
2. Verify MongoDB connection
3. Check if user is already enrolled

## Debugging Checklist

- [ ] Razorpay keys configured in `backend/.env`
- [ ] Razorpay key configured in `frontend/.env.production`
- [ ] Frontend rebuilt after env changes
- [ ] Backend restarted
- [ ] Razorpay script loads in browser
- [ ] No console errors
- [ ] Network requests succeed (200 OK)
- [ ] Using test mode keys for testing
- [ ] Course price is valid (₹0 or ≥₹1)

## Testing Workflow

### 1. Test Free Enrollment
```
1. Set course price to ₹0
2. Click "Enroll Now"
3. Should enroll directly without payment
```

### 2. Test Paid Enrollment
```
1. Set course price to ₹100
2. Click "Enroll Now"
3. Razorpay modal should open
4. Use test card: 4111 1111 1111 1111
5. Complete payment
6. Should redirect to dashboard
```

### 3. Test Payment Failure
```
1. Use test card: 4000 0000 0000 0002
2. Payment should fail
3. Should show error message
4. User should not be enrolled
```

## Environment Variables Reference

### Backend (.env)
```env
# Required for payment
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# Other required variables
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.production)
```env
# Required for payment
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx

# API URL
VITE_API_URL=/api
```

## Still Not Working?

### 1. Check Razorpay Dashboard
- Login to dashboard
- Check if test mode is enabled
- Verify API keys are active
- Check payment logs

### 2. Enable Debug Mode
Add console logs in `CourseDetail.jsx`:
```javascript
console.log('Razorpay Key:', import.meta.env.VITE_RAZORPAY_KEY_ID);
console.log('Order Data:', orderData);
console.log('Razorpay loaded:', typeof window.Razorpay);
```

### 3. Test Backend Directly
Use Postman or curl:
```bash
# Create order
curl -X POST http://localhost:5000/api/payments/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"courseId":"COURSE_ID"}'
```

### 4. Contact Support
If still having issues:
1. Check Razorpay status page
2. Review Razorpay documentation
3. Contact Razorpay support

## Quick Fix Commands

```bash
# Rebuild everything
npm run build:full
npm run build

# Restart backend
cd backend
npm start

# Test server
npm run test:server

# Check environment variables
cd backend
cat .env | grep RAZORPAY

cd ../frontend
cat .env.production | grep RAZORPAY
```

---

**Remember**: Always use test mode keys during development!

**Test Key ID**: Starts with `rzp_test_`
**Live Key ID**: Starts with `rzp_live_`
