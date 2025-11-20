# Getting Started Guide

Quick setup guide to get the Role-Based Task Management System running in 5 minutes.

## Prerequisites

- Node.js v14+ (download from https://nodejs.org)
- MongoDB (local or MongoDB Atlas cloud)
- Git

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd Role_Based_managemet
```

## Step 2: Backend Setup (Terminal 1)

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with these contents:
```

Create `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/role-based-task-management
JWT_SECRET=your-secret-key-123
PORT=4500
NODE_ENV=development
```

For **MongoDB Atlas**, replace with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/role-based-task-management
```

```bash
# Start backend server
npm run dev
```

Expected output:
```
✓ Server running on http://localhost:4500
✓ Connected to MongoDB
```

## Step 3: Frontend Setup (Terminal 2)

```bash
# Open new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:4500)
# echo "VITE_API_URL=http://localhost:4500/api" > .env

# Start frontend development server
npm run dev
```

Expected output:
```
✓ built in 2.5s

  ➜  Local:   http://localhost:5173/
```

## Step 4: Open in Browser

1. **Open http://localhost:5173** in your browser
2. You'll see the Home Page with navigation options

## Step 5: Login with Sample Credentials

### Option A: Admin Dashboard
1. Click "Admin" button on home page OR Go to http://localhost:5173/admin
2. You'll be redirected to login
3. Enter credentials:
   - **Email:** admin@example.com
   - **Password:** Admin@123
4. Click Login

### Option B: Manager Dashboard
1. Click "Manager" button on home page OR Go to http://localhost:5173/manager
2. Enter credentials:
   - **Email:** manager@example.com
   - **Password:** Manager@123
3. Click Login

### Option C: User Dashboard
1. Click "User" button on home page OR Go to http://localhost:5173/user
2. Enter credentials:
   - **Email:** user@example.com
   - **Password:** User@123
3. Click Login

## Troubleshooting

### Backend won't start
```bash
# Check if port 4500 is in use
# Windows:
netstat -ano | findstr :4500

# Mac/Linux:
lsof -i :4500

# If in use, change PORT in .env or kill the process
```

### MongoDB connection failed
```bash
# Check MongoDB is running
# For local MongoDB:
mongosh

# If not running:
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port 5173 already in use
Vite will automatically use the next available port. Check terminal output for the actual port.

### Clear browser cache
```
Press Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
Select "All time" → Clear data
```

### Reset localStorage (if stuck on login)
Open DevTools (F12) → Application → LocalStorage → Clear All

## What's Next?

1. **Explore Admin Dashboard**
   - Add new managers
   - Add new users
   - Create tasks
   - View all data

2. **Explore Manager Dashboard**
   - View assigned tasks
   - Update task status
   - Assign tasks to team members
   - View calendar

3. **Explore User Dashboard**
   - View your tasks
   - Update task status
   - View personal calendar

4. **Try Calendar Features**
   - Switch between Month, Week, Day, List views
   - Click on tasks to see details
   - Navigate between time periods

## Features to Try

- ✅ Login with different roles
- ✅ Add new manager/user (Admin only)
- ✅ Create tasks (Admin/Manager)
- ✅ Update task status
- ✅ View calendar with tasks
- ✅ Logout and return to home
- ✅ Responsive design (try resizing browser)
- ✅ Smooth animations (hover over buttons)

## Project Structure

```
server/              # Node.js + Express + MongoDB
├── src/
│   ├── controllers/ # Business logic
│   ├── models/      # Database schemas
│   ├── routes/      # API endpoints
│   └── middleware/  # Auth, error handling
└── index.js

client/              # React + Vite
├── src/
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── lib/         # API client, utilities
│   └── App.jsx      # Main router
└── package.json
```

## Available Scripts

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Start production
npm run seed     # Seed sample data
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

## Database Seeding

To populate the database with sample data:

```bash
cd server
npm run seed
```

This creates:
- 1 Admin user
- 2 Manager users
- 5 Regular users
- 10 Sample tasks

## Common Tasks

### Add a new user (as Admin)
1. Login as admin
2. Click "Admin Dashboard"
3. Go to "Users" tab
4. Click "Add User"
5. Fill form and submit

### Assign a task (as Admin/Manager)
1. Click "Tasks" tab (Admin) or "Assign Task" (Manager)
2. Click "Add Task" / "Create Task"
3. Select user and fill details
4. Submit

### Update task status (as Manager/User)
1. View task in dashboard
2. Click on task
3. Change status dropdown
4. Click save

### View calendar
1. Click "Calendar" button in dashboard header
2. Switch between views: Month, Week, Day, List
3. Click on tasks to see details

## Need Help?

1. Check the full README.md for detailed documentation
2. Check DEPLOYMENT.md for deployment instructions
3. Check browser console (F12) for error messages
4. Check server logs in terminal

## Next Steps

- Deploy to production (see DEPLOYMENT.md)
- Customize colors and branding
- Add more features
- Set up real MongoDB Atlas database
- Configure email notifications

---

**Happy coding! 🚀**

For questions or issues, check the project documentation or create an issue on GitHub.
