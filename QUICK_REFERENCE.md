# Quick Reference Card

## 🚀 Quick Start (60 seconds)

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

Open: http://localhost:5173

---

## 🔑 Sample Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Admin | admin@example.com | Admin@123 | /admin |
| Manager | manager@example.com | Manager@123 | /manager |
| User | user@example.com | User@123 | /user |

---

## 🎯 Key URLs

| Page | URL |
|------|-----|
| Home | http://localhost:5173 |
| Admin Dashboard | http://localhost:5173/admin |
| Manager Dashboard | http://localhost:5173/manager |
| User Dashboard | http://localhost:5173/user |
| Admin Calendar | http://localhost:5173/admin/calendar |
| Manager Calendar | http://localhost:5173/manager/calendar |
| User Calendar | http://localhost:5173/user/calendar |
| Login | http://localhost:5173/login |
| Signup | http://localhost:5173/signup |

---

## 📁 Key Files

### Backend
- `server/index.js` - Entry point
- `server/src/routes/` - API endpoints
- `server/src/controllers/` - Business logic
- `server/src/models/` - Database schemas
- `server/.env` - Environment variables

### Frontend
- `client/src/App.jsx` - Main router
- `client/src/pages/Home.jsx` - Home page
- `client/src/components/Admin/` - Admin dashboard
- `client/src/components/Manager/` - Manager dashboard
- `client/src/components/User/` - User dashboard
- `client/src/lib/api.js` - API client

---

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/role-based-task-management
JWT_SECRET=your-secret-key
PORT=4500
NODE_ENV=development
```

### Frontend (.env.local - optional)
```
VITE_API_URL=http://localhost:4500/api
```

---

## 🔄 npm Scripts

### Backend
```bash
npm run dev      # Development with auto-reload
npm start        # Production
npm run seed     # Seed sample data
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Lint code
npm run preview  # Preview build
```

---

## 🗂️ Project Structure

```
Role_Based_managemet/
├── server/                    # Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── index.js
│
└── client/                    # Frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── lib/
    └── package.json
```

---

## 🧪 Testing the App

1. **Add Manager** (Admin only)
   - Dashboard → Managers tab → Add Manager
   - Fill form and submit

2. **Add User** (Admin only)
   - Dashboard → Users tab → Add User
   - Fill form and submit

3. **Create Task** (Admin/Manager)
   - Dashboard → Tasks tab → Create Task
   - Select user and fill details

4. **Update Status** (Manager/User)
   - View task → Click status → Select new status

5. **View Calendar**
   - Click "Calendar" button
   - Switch views: Month, Week, Day, List

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't connect to MongoDB | Check MONGODB_URI in .env |
| Port 4500 in use | Change PORT in .env |
| Port 5173 in use | Vite uses next available port |
| Login fails | Clear localStorage (DevTools → Application) |
| API errors | Check backend is running and logs |
| Blank page | Check browser console (F12) |

---

## 📚 Documentation

- **README.md** - Full documentation
- **GETTING_STARTED.md** - Setup guide
- **DEPLOYMENT.md** - Deploy to production
- **FEATURES.md** - Complete features list
- **This file** - Quick reference

---

## 🚀 Deployment Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure MongoDB Atlas
- [ ] Set FRONTEND_URL in backend .env
- [ ] Update VITE_API_URL for production
- [ ] Enable HTTPS
- [ ] Test all features
- [ ] Set up monitoring/logging
- [ ] Configure backups

---

## 💻 Tech Stack

**Backend**
- Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt

**Frontend**
- React 19, Vite, Tailwind CSS, Framer Motion, FullCalendar, Axios

---

## 🔗 Useful Links

- Node.js: https://nodejs.org
- MongoDB: https://mongodb.com
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- Framer Motion: https://framer.com/motion

---

## 📞 Support

- Check project docs
- Review GitHub issues
- Check browser console (F12)
- Check server logs

---

**Last Updated:** November 20, 2025

**Need more help?** See README.md or GETTING_STARTED.md
