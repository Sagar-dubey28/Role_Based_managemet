import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./pages/TopBar.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import ManagerDashboard from "./components/Manager/ManagerDashboard.jsx";
import UserDashboard from "./components/User/UserDashboard.jsx";
import Calendar from "./components/Calendar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { authAPI } from "./lib/api.js";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-16 w-16 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {currentUser && <Topbar user={currentUser} onLogout={handleLogout} />}
        <div className="p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={currentUser ? <Navigate to={`/${currentUser.role}`} /> : <Home />} />
            <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}`} /> : <Login />} />
            <Route path="/signup" element={currentUser ? <Navigate to={`/${currentUser.role}`} /> : <Signup />} />

            {/* Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard currentUser={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Calendar currentUser={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerDashboard currentUser={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/calendar"
              element={
                <ProtectedRoute requiredRole="manager">
                  <Calendar currentUser={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard currentUser={currentUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/calendar"
              element={
                <ProtectedRoute requiredRole="user">
                  <Calendar currentUser={currentUser} />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to={currentUser ? `/${currentUser.role}` : "/"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}