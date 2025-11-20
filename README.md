# Role-Based Task Management System

A full-stack web application for managing tasks with role-based access control. Supports three user roles: Admin, Manager, and User with different permissions and dashboards.

## 🎯 Features

- **Role-Based Access Control**: Admin, Manager, and User roles with specific permissions
- **Task Management**: Create, update, delete, and track tasks across the organization
- **Calendar Integration**: Interactive calendar view (Month, Week, Day, List views) with task visualization
- **Manager Assignment**: Admins can create and manage managers
- **User Management**: Admins can manage users and assign tasks to them
- **Task Status Tracking**: Track tasks through Pending → In Progress → Completed states
- **Professional UI**: Beautiful, animated dashboards with Framer Motion
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud database)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Role_Based_managemet
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (see configuration below)
# Add your MongoDB connection string and JWT secret

# Run the development server
npm run dev

# Or run in production
npm start

# Seed sample data (optional)
npm run seed
```

**Backend runs on:** `http://localhost:4500`

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file (optional, see configuration below)
# The frontend will connect to localhost:4500 by default

# Run the development server
npm run dev

# Or build for production
npm run build
```

**Frontend runs on:** `http://localhost:5173`

## ⚙️ Configuration

### Backend (.env file)

Create a `.env` file in the `server` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/role-based-task-management
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/role-based-task-management

# JWT Secret Key
JWT_SECRET=your-secret-key-here

# Server Port
PORT=4500

# Node Environment
NODE_ENV=development
```

### Frontend (.env file)

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:4500/api
```

## 🔐 Sample Credentials

### Admin Account
```
Email: admin@example.com
Password: Admin@123
Role: Admin
Permissions: Manage all users, managers, tasks, and view dashboards
```

### Manager Account
```
Email: manager@example.com
Password: Manager@123
Role: Manager
Permissions: View team members, assign tasks, update task status, view team calendar
```

### User Account
```
Email: user@example.com
Password: User@123
Role: User
Permissions: View assigned tasks, update task status, view personal calendar
```

## 📂 Project Structure

```
Role_Based_managemet/
├── server/                          # Backend (Express.js + MongoDB)
│   ├── index.js                     # Entry point
│   ├── package.json
│   ├── src/
│   │   ├── config/                  # Database config
│   │   ├── controllers/             # Route handlers
│   │   ├── middleware/              # Auth middleware, error handler
│   │   ├── models/                  # Database schemas (User, Task)
│   │   ├── routes/                  # API routes
│   │   ├── seeders/                 # Sample data seeder
│   │   └── utils/                   # Database utilities
│   └── .env                         # Environment variables
│
└── client/                          # Frontend (React + Vite)
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx                  # Main app router
    │   ├── main.jsx                 # Entry point
    │   ├── index.css                # Global styles
    │   ├── components/
    │   │   ├── Admin/               # Admin dashboard components
    │   │   ├── Manager/             # Manager dashboard components
    │   │   ├── User/                # User dashboard components
    │   │   ├── Calendar.jsx         # FullCalendar integration
    │   │   ├── ProtectedRoute.jsx   # Route protection
    │   │   └── TaskDetailModal.jsx  # Task detail modal
    │   ├── pages/
    │   │   ├── Home.jsx             # Home page
    │   │   ├── Login.jsx            # Login page
    │   │   ├── Signup.jsx           # Signup page
    │   │   └── TopBar.jsx           # Navigation bar
    │   └── lib/
    │       ├── api.js               # API endpoints
    │       └── axiosInstance.js     # Axios configuration
    └── .env                         # Environment variables
```

## 🔄 User Workflows

### Admin Workflow
1. Login with admin credentials
2. Dashboard shows: Users, Managers, and Tasks tabs
3. Can add new users, managers, and tasks
4. Can delete users, managers, and tasks
5. Can view all tasks in calendar view
6. Can logout (redirects to home page)

### Manager Workflow
1. Login with manager credentials
2. Dashboard shows stats and assigned tasks
3. Can see team members and their assigned tasks
4. Can update task status (Pending → In Progress → Completed)
5. Can assign new tasks to team members
6. Can view tasks in calendar view
7. Can logout (redirects to home page)

### User Workflow
1. Login with user credentials
2. Dashboard shows personal tasks and stats
3. Can update their own task status
4. Can view tasks in calendar view
5. Can logout (redirects to home page)

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Admin Routes (Protected - Admin only)
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/managers` - Create manager
- `GET /api/admin/managers` - Get all managers
- `DELETE /api/admin/managers/:id` - Delete manager
- `GET /api/admin/tasks` - Get all tasks
- `POST /api/admin/tasks` - Create task
- `DELETE /api/admin/tasks/:id` - Delete task

### Task Routes (Protected)
- `GET /api/tasks/assigned` - Get tasks assigned to user
- `GET /api/tasks/:id` - Get task details
- `PATCH /api/tasks/:id/status` - Update task status

## 🎨 UI/UX Features

- **Framer Motion Animations**: Smooth entrance animations, hover effects, and staggered transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Dark Mode Ready**: Tailwind CSS for easy theme customization
- **Interactive Calendar**: 4 different calendar views (Month, Week, Day, List)
- **Real-time Updates**: Auto-refresh every 10 seconds
- **Form Validation**: Client-side validation with error messages
- **Loading States**: Animated loading spinners and skeleton screens

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **FullCalendar** - Calendar integration
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📝 Running Tests

The seeder creates sample data with the credentials mentioned above:

```bash
# Backend seeder
cd server
npm run seed
```

This will create:
- 1 Admin user
- 2 Manager users
- 5 Regular users
- 10 Sample tasks assigned to various users

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your MongoDB Atlas connection string
- Verify `MONGODB_URI` in `.env` is correct

### CORS Error
- Ensure backend is running on port 4500
- Check frontend `.env` has correct `VITE_API_URL`

### Login Issues
- Clear browser localStorage: Open DevTools → Application → LocalStorage → Clear All
- Verify credentials are correct
- Check backend server is running

### Port Already in Use
- Backend: Kill process on port 4500 or change PORT in `.env`
- Frontend: Vite will automatically use next available port

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Protected Routes**: Route guards for role-based access
- **CORS Configuration**: Restricted to frontend origin
- **Input Validation**: Server-side validation for all endpoints
- **Error Handling**: Secure error messages (no sensitive data leaked)

## 📈 Future Enhancements

- [ ] Task priority levels and filtering
- [ ] Email notifications for task assignments
- [ ] Real-time notifications using WebSockets
- [ ] Task comments and collaboration
- [ ] User profile management
- [ ] Dark mode toggle
- [ ] Export tasks to PDF/CSV
- [ ] Team analytics and reporting
- [ ] Two-factor authentication
- [ ] Audit logs for admin actions

## 📄 License

This project is open source and available under the ISC License.

## 👥 Support

For issues or questions, please create an issue in the GitHub repository.

## 🚀 Deployment

### Deploy Backend (Vercel, Render, or Heroku)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy

### Deploy Frontend (Vercel, Netlify)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set build command: `npm run build`
4. Deploy

---

**Made with ❤️ for role-based task management**
