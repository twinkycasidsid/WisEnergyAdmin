import React from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "../SearchContext";

function Header({ onMenuClick }) {
  const { searchQuery, setSearchQuery } = useSearch();

  // ✅ Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const displayName = user.displayName || "Admin User";
  const role = user.role || "Admin";
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <header className="flex items-center bg-white px-8 py-4 w-full">
      {/* Hamburger menu icon */}
      <button
        onClick={onMenuClick}
        className="mr-4 p-2 rounded hover:bg-gray-100"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="5" y="8" width="18" height="2" rx="1" fill="#4B5563" />
          <rect x="5" y="13" width="18" height="2" rx="1" fill="#4B5563" />
          <rect x="5" y="18" width="18" height="2" rx="1" fill="#4B5563" />
        </svg>
      </button>

      {!isDashboard && (
        <div className="relative w-full max-w-xl">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" strokeWidth="2" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#43A866]/30"
          />
        </div>
      )}
      {/* User profile section */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="text-right">
          <div className="font-semibold text-gray-800 text-sm">
            {displayName}
          </div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
        <img
          src="/admin-profile.png"
          alt="User"
          className="w-10 h-10 rounded-full object-cover border"
        />
      </div>
    </header>
  );
}

export default Header;
