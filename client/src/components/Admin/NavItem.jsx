import React from "react";

export default function NavItem({ icon, label, open, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
      {icon}
      {open ? <span className="font-medium">{label}</span> : null}
    </div>
  );
}
