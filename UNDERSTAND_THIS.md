# ⚠️ UNDERSTAND THIS - Critical Information

## The "Not Found" Error You're Seeing is CORRECT!

You're accessing `https://courses-lilac-six.vercel.app` in your browser and seeing "Not Found". **This is the expected behavior!**

### Why?

**`courses-lilac-six.vercel.app` is the BACKEND (API server)**
- It's NOT a website
- It's NOT meant to be accessed directly in a browser
- It ONLY serves API endpoints like `/api/health`, `/api/auth/login`, etc.
- Accessing it directly will show "Not Found" - this is CORRECT!

**`courses-fr.vercel.app` is the FRONTEND (website)**
- This IS the website users should access
- This serves the React application
- This is what you should type in the browser
- This is what users will see

## Simple Analogy

Think of it like a restaurant:

**Backend (courses-lilac-six.vercel.app)** = Kitchen
- You don't go into the kitchen to eat
- The kitchen prepares food (processes API requests)
- Only staff (API calls) access the kitchen

**Frontend (courses-fr.vercel.app)** = Dining Area
- This is where customers (users) go
- This is the public-facing part
- This is what you access in your browser

## What You Should Do

### ❌ STOP Doing This:
```
Opening: https://courses-lilac-six.vercel.app in browser
```
This will always show "Not Found" because it's the API server!

### ✅ START Doing This:
```
Opening: https://courses-fr.vercel.app in browser
```
This is the actual website users should access!

## The Complete Flow

1. **User types in browser:**
   ```
   https://courses-fr.vercel.app/login
   ```

2. **Frontend Vercel serves:**
   - The React app (index.html + JavaScript)

3. **React app loads in browser:**
   - Shows login page

4. **User submits login form:**
   - React app makes API call to: `https://courses-lilac-six.vercel.app/api/auth/login`

5. **Backend processes:**
   - Validates credentials
   - Returns JWT token

6. **React app receives response:**
   - Stores token
   - Redirects to dashboard

## Password Reset Flow

1. **User goes to:**
   ```
   https://courses-fr.vercel.app/login
   ```

2. **Clicks "Forgot password?"**

3. **Frontend makes API call to:**
   ```
   https://courses-lilac-six.vercel.app/api/auth/forgot-password
   ```

4. **Backend sends email with link:**
   ```
   https://courses-fr.vercel.app/reset-password/TOKEN
   ```
   (NOT localhost, NOT backend URL)

5. **User clicks link in email:**
   - Opens: `https://courses-fr.vercel.app/reset-password/TOKEN`
   - Frontend shows reset password form

6. **User enters new password:**
   - Frontend makes API call to: `https://courses-lilac-six.vercel.app/api/auth/reset-password/TOKEN`
   - Backend updates password
   - User can login

## Two Separate Vercel Projects

You have TWO different Vercel projects:

### Project 1: courses-lilac-six (Backend)
- **Type**: Node.js API server
- **URL**: `https://courses-lilac-six.vercel.app`
- **Purpose**: Process API requests
- **Access**: Only through API calls (not browser)
- **Endpoints**: `/api/auth/*`, `/api/courses/*`, etc.

### Project 2: courses-fr (Frontend)
- **Type**: React application
- **URL**: `https://courses-fr.vercel.app`
- **Purpose**: User interface
- **Access**: Users type this in browser
- **Pages**: `/login`, `/courses`, `/reset-password`, etc.

## What Needs to Be Done

### 1. Set Environment Variables in Vercel

**Backend Project (courses-lilac-six):**
- Add `NODE_ENV=production`
- Add `FRONTEND_URL=https://courses-fr.vercel.app`
- Add other variables (MongoDB, JWT, Email, Razorpay)

**Frontend Project (courses-fr):**
- Add `VITE_API_URL=https://courses-lilac-six.vercel.app/api`
- Add `VITE_RAZORPAY_KEY_ID`

### 2. Deploy

```bash
git add .
git commit -m "Fix deployment"
git push origin main
```

### 3. Test Using Frontend URL

**Access this in browser:**
```
https://courses-fr.vercel.app
```

**NOT this:**
```
https://courses-lilac-six.vercel.app ❌
```

## Common Questions

### Q: Why does the backend URL show "Not Found"?
**A:** Because it's an API server, not a website. It's supposed to show "Not Found" when accessed directly.

### Q: Where should users go?
**A:** `https://courses-fr.vercel.app` - This is the actual website.

### Q: How does the frontend talk to the backend?
**A:** The frontend makes API calls to `https://courses-lilac-six.vercel.app/api/*` endpoints.

### Q: Why do I have two Vercel projects?
**A:** One for the backend (API) and one for the frontend (website). This is a common architecture called "separation of concerns".

### Q: Can I combine them into one?
**A:** Yes, but it's not recommended. Keeping them separate is better for:
- Scalability
- Security
- Deployment flexibility
- Performance

## Final Checklist

- [ ] Understand: Backend URL is for API only
- [ ] Understand: Frontend URL is for users
- [ ] Set backend environment variables in Vercel
- [ ] Set frontend environment variables in Vercel
- [ ] Deploy both projects
- [ ] Test using frontend URL: `https://courses-fr.vercel.app`
- [ ] Don't access backend URL directly in browser

## Summary

**Backend (courses-lilac-six.vercel.app):**
- API server
- Not for browser access
- "Not Found" is correct behavior

**Frontend (courses-fr.vercel.app):**
- Website
- For browser access
- What users should use

**Password Reset:**
- Email link: `https://courses-fr.vercel.app/reset-password/TOKEN`
- NOT: `localhost` or backend URL

**Status**: Everything is configured correctly ✅
**Action**: Deploy and use frontend URL
