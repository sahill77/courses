# SparksStream - Deployment Guide

## Overview
This guide explains how to build and deploy the SparksStream application with the frontend served from the backend.

## Architecture
- **Frontend**: React + Vite (builds to static files)
- **Backend**: Express.js (serves API + static frontend)
- **Database**: MongoDB Atlas
- **File Storage**: Local uploads folder

## Build Process

### Step 1: Build Frontend
```bash
# From project root
npm run build

# Or from frontend directory
cd frontend
npm run build
```

This creates a production build in `frontend/dist/` with:
- Optimized and minified JavaScript
- Optimized CSS
- Compressed assets
- Code splitting for better performance

### Step 2: Backend Configuration
The backend is already configured to:
1. Serve API routes at `/api/*`
2. Serve uploaded files at `/uploads/*`
3. Serve frontend static files from `frontend/dist/`
4. Handle client-side routing (SPA fallback)

### Step 3: Environment Variables

#### Backend (.env)
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

#### Frontend (.env.production)
```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## Local Production Testing

### Full Build and Run
```bash
# 1. Install all dependencies
npm run build:full

# 2. Build frontend
npm run build

# 3. Start backend (serves frontend + API)
npm start
```

### Access Application
Open browser: `http://localhost:5000`

The backend now serves:
- Frontend: `http://localhost:5000/`
- API: `http://localhost:5000/api/*`
- Uploads: `http://localhost:5000/uploads/*`

## Production Deployment

### Option 1: Traditional Server (VPS/Cloud)

#### Prerequisites
- Node.js 18+ installed
- MongoDB connection
- Domain name (optional)

#### Steps
```bash
# 1. Clone repository
git clone <your-repo-url>
cd courses

# 2. Install dependencies and build
npm run build:full
npm run build

# 3. Set environment variables
# Edit backend/.env with production values

# 4. Start with PM2 (recommended)
npm install -g pm2
cd backend
pm2 start index.js --name sparksstream
pm2 save
pm2 startup

# Or start directly
npm start
```

#### Nginx Configuration (Optional)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Vercel Deployment

#### Backend (Vercel)
The `backend/vercel.json` is already configured:
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
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

Deploy backend:
```bash
cd backend
vercel --prod
```

#### Frontend (Vercel)
Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

Deploy frontend:
```bash
cd frontend
vercel --prod
```

Update `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

### Option 3: Docker Deployment

#### Create Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install --prefix frontend
RUN npm install --prefix backend

# Copy source code
COPY frontend ./frontend
COPY backend ./backend

# Build frontend
RUN npm run build --prefix frontend

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend and built frontend
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Install production dependencies only
WORKDIR /app/backend
RUN npm install --production

EXPOSE 5000

CMD ["node", "index.js"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
    volumes:
      - ./backend/uploads:/app/backend/uploads
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

## Post-Deployment Checklist

### Functionality
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Course browsing works
- [ ] Course enrollment works
- [ ] Payment integration works
- [ ] Admin panel accessible
- [ ] File uploads work
- [ ] Email notifications work
- [ ] Help tickets work

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Images optimized and loading
- [ ] No console errors
- [ ] Mobile responsive

### Security
- [ ] HTTPS enabled (production)
- [ ] Environment variables secured
- [ ] CORS configured correctly
- [ ] JWT tokens working
- [ ] File upload validation
- [ ] SQL injection prevention
- [ ] XSS protection

### Monitoring
- [ ] Error logging setup
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database backups configured

## Troubleshooting

### Frontend not loading
```bash
# Check if build exists
ls -la frontend/dist

# Rebuild frontend
npm run build --prefix frontend

# Check backend logs
cd backend
npm start
```

### API routes not working
```bash
# Check CORS configuration in backend/index.js
# Verify API routes are prefixed with /api
# Check network tab in browser DevTools
```

### Database connection issues
```bash
# Verify MONGODB_URI in backend/.env
# Check MongoDB Atlas network access
# Test connection with MongoDB Compass
```

### File uploads failing
```bash
# Check uploads directory exists
mkdir -p backend/uploads

# Verify permissions
chmod 755 backend/uploads

# Check multer configuration
```

## Maintenance

### Update Dependencies
```bash
# Check for updates
npm outdated --prefix frontend
npm outdated --prefix backend

# Update packages
npm update --prefix frontend
npm update --prefix backend
```

### Database Backup
```bash
# MongoDB Atlas: Use automated backups
# Or manual backup:
mongodump --uri="your_mongodb_uri" --out=./backup
```

### Logs Management
```bash
# With PM2
pm2 logs sparksstream

# View last 100 lines
pm2 logs sparksstream --lines 100

# Clear logs
pm2 flush
```

## Performance Optimization

### Frontend
- Code splitting (already configured)
- Lazy loading routes
- Image optimization
- CDN for static assets

### Backend
- Enable gzip compression
- Add caching headers
- Database indexing
- Connection pooling

### Database
- Create indexes on frequently queried fields
- Use aggregation pipelines
- Implement pagination
- Regular maintenance

## Scaling

### Horizontal Scaling
- Use load balancer (Nginx/HAProxy)
- Multiple backend instances
- Shared session storage (Redis)
- Centralized file storage (S3/CloudFlare)

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Add caching layer (Redis)
- Use CDN for static assets

## Support

For issues or questions:
- Check logs: `pm2 logs` or `docker logs`
- Review error messages
- Check MongoDB Atlas status
- Verify environment variables
- Test API endpoints with Postman

---

Last Updated: 2026-03-25
Version: 1.0.0
