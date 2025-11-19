import React from "react";

export default function StatCard({ title, value, color = "blue" }) {
  const colors = {
    blue: "#3498db",
    orange: "#e67e22",
    purple: "#8e44ad",
    green: "#27ae60",
  };
  return (
    <div className="p-6 bg-white rounded-2xl shadow flex items-center gap-6 border-l-8" style={{ borderColor: colors[color] }}>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-3xl font-extrabold text-[#2c3e50]">{value}</div>
      </div>
    </div>
  );
}
