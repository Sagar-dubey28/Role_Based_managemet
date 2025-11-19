import React from "react";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

function Topbar({ user, onLogout }) {
  return (
    <div className="bg-white shadow sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80">
          <div className="text-2xl font-bold text-indigo-600">📊 RB Task</div>
          <div className="text-sm text-gray-500">Management System</div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={18} className="text-indigo-600" />
            <span>
              <strong>{user.name}</strong> <span className="text-gray-400">({user.role.toUpperCase()})</span>
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
