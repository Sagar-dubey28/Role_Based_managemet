# Deployment Guide

This guide provides step-by-step instructions to deploy the Role-Based Task Management System to production.

## Backend Deployment

### Option 1: Deploy to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` directory

3. **Configure Environment**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     ```
     MONGODB_URI=<your-mongodb-atlas-url>
     JWT_SECRET=<your-secure-secret>
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://your-app.onrender.com`)



1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=<your-mongodb-url>
   heroku config:set JWT_SECRET=<your-secret>
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts and set environment variables in Vercel dashboard**

---

## Frontend Deployment

### Option 1: Deploy to Vercel

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Select `client` directory as root

3. **Configure Build**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**
   ```
   VITE_API_URL=<your-backend-url>/api
   ```
   Example: `https://your-app.onrender.com/api`

5. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Option 2: Deploy to Netlify

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Deploy**
   - Click "New site from Git"
   - Select your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Configure Environment**
   - Go to Site Settings → Build & Deploy → Environment
   - Add variable: `VITE_API_URL=<your-backend-url>/api`

4. **Deploy**
   - Netlify will automatically build and deploy



## Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster**
   - Click "Create" on Database
   - Choose Free tier
   - Select your region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to Database Access
   - Click "Add New Database User"
   - Create username and password
   - Click "Add User"

4. **Allow Network Access**
   - Go to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Select "Drivers"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use as `MONGODB_URI` in backend `.env`

### Option 2: MongoDB Community Edition (Local)

1. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Install for your operating system

2. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Use Local Connection**
   ```
   MONGODB_URI=mongodb://localhost:27017/role-based-task-management
   ```

---

## DNS & Domain Setup

1. **Purchase Domain**
   - Get domain from GoDaddy, Namecheap, etc.

2. **Configure DNS**
   - For Vercel/Netlify: They provide DNS instructions
   - Add DNS records to your domain registrar
   - Follow platform-specific DNS setup

3. **Enable HTTPS**
   - Most platforms (Vercel, Netlify) auto-generate SSL certificates

---





### Manual Setup (if needed)

Use Let's Encrypt for free SSL:

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Generate Certificate**
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

3. **Configure Your Server**
   - Point to certificate files
   - Update HTTPS configuration

---

## Post-Deployment Verification

1. **Test Backend**
   ```bash
   curl https://your-backend-url/api/auth/login -X POST
   ```

2. **Test Frontend**
   - Open https://your-frontend-url
   - Try login with sample credentials
   - Verify all features work

3. **Check Browser Console**
   - Open DevTools
   - Check for any errors
   - Verify API calls are successful

4. **Monitor Performance**
   - Check backend logs for errors
   - Monitor database performance
   - Set up error tracking (Sentry, etc.)

---

## Environment Variables Checklist

### Backend Production
- [ ] `MONGODB_URI` - Production MongoDB URL
- [ ] `JWT_SECRET` - Strong, unique secret key
- [ ] `NODE_ENV=production`
- [ ] `PORT=4500` (or platform-assigned)

### Frontend Production
- [ ] `VITE_API_URL` - Production backend URL with `/api`

---

## Security Checklist

- [ ] JWT secret is strong and unique
- [ ] MongoDB credentials are secure
- [ ] CORS is configured correctly for production domain
- [ ] Environment variables are not committed to git
- [ ] HTTPS is enabled
- [ ] Database backups are configured
- [ ] Error messages don't expose sensitive data
- [ ] Rate limiting is implemented (optional)
- [ ] API keys are rotated regularly

---

## Monitoring & Logging

1. **Backend Logs**
   - Check deployment platform's log viewer
   - Set up error tracking (Sentry, LogRocket)

2. **Frontend Monitoring**
   - Use Google Analytics
   - Set up error tracking
   - Monitor performance metrics

3. **Database Monitoring**
   - MongoDB Atlas provides monitoring
   - Set up alerts for unusual activity

---

## Troubleshooting Deployment Issues

### Backend Won't Start
- Check logs for error messages
- Verify environment variables are set
- Ensure MongoDB connection string is correct
- Check Node.js version compatibility

### Frontend Shows Blank Page
- Check browser console for errors
- Verify API URL is correct
- Clear browser cache






