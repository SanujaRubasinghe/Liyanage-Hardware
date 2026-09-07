import React, { useState, useRef, useEffect } from "react";
import { UserCircle, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchModal from './SearchModal';
import {toast} from 'react-toastify'
import API from "../api";

const Header = ({ username = "John Doe", setAdmin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const toggle = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', toggle);
    return () => window.removeEventListener('keydown', toggle);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfile = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const res = await API.post("/logout")
      toast.success(res.data.message || "Successfully logged out!")
    } catch (error) {
      toast.error("Error logging out!")
    }
    setAdmin(null)
  };

  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 shadow sticky top-0 z-40">
      <h1 className="text-xl font-semibold text-gray-700">New Liyanage Hardware</h1>

      <button
        onClick={() => setOpen(true)}
        className="ml-auto flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md shadow-inner border border-gray-300 text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
        <span className="text-sm">Search</span>
        <kbd className="ml-2 text-xs text-gray-500 border border-gray-300 rounded px-1">
          Ctrl+K
        </kbd>
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex ml-2 items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition"
        >
          <UserCircle size={28} />
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            {username}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg z-50">
            <button
              onClick={handleProfile}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
            >
              <User size={16} /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
