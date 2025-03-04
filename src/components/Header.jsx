import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  DocumentTextIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const Header = ({ userName, role, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white w-full px-4 py-3 flex justify-between items-center shadow-xl relative z-50">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
        نظام فحص المتانة
      </h1>
      
      <nav className="flex items-center gap-4">
        <div className="flex items-center gap-4">
        {(role === "printer") && (
            <Link
              to="/print-app"
              className="group flex items-center gap-1 hover:text-purple-400 transition-all duration-300"
            >
              <DocumentTextIcon className="w-6 h-6 text-purple-400 group-hover:-translate-y-1 transition-transform" />
              <span className="text-base font-medium">الاستمارات</span>
            </Link>
          )}

          {(role === "superadmin" || role === "admin") && (
            <Link
              to="/dropdown-list"
              className="group flex items-center gap-1 hover:text-cyan-400 transition-all duration-300"
            >
              <ClipboardDocumentListIcon className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="text-base font-medium">القوائم المنسدلة</span>
            </Link>
          )}

          {(role === "superadmin" || role === "admin" || role === "reporter") && (
            <Link
              to="/reports"
              className="group flex items-center gap-1 hover:text-emerald-400 transition-all duration-300"
            >
              <ChartBarSquareIcon className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-base font-medium">التقارير</span>
            </Link>
          )}

          {(role === "superadmin" || role === "admin" || role === "checker") && (
            <Link
              to="/certificates"
              className="group flex items-center gap-1 hover:text-amber-400 transition-all duration-300"
            >
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-400 group-hover:animate-pulse" />
              <span className="text-base font-medium">شهادات الفحص</span>
            </Link>
          )}

          {(role === "superadmin" || role === "admin" || role === "user") && (
            <Link
              to="/forms"
              className="group flex items-center gap-1 hover:text-purple-400 transition-all duration-300"
            >
              <DocumentTextIcon className="w-6 h-6 text-purple-400 group-hover:-translate-y-1 transition-transform" />
              <span className="text-base font-medium">الاستمارات</span>
            </Link>
          )}

          {(role === "superadmin" || role === "admin") && (
            <Link
              to="/users"
              className="group flex items-center gap-1 hover:text-pink-400 transition-all duration-300"
            >
              <UsersIcon className="w-6 h-6 text-pink-400 group-hover:skew-x-12 transition-transform" />
              <span className="text-base font-medium">المستخدمون</span>
            </Link>
          )}
        </div>

        {/* User Dropdown */}
        <div
          className="relative group"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300">
            <UserCircleIcon className="w-8 h-8 text-cyan-400 group-hover:rotate-180 transition-transform" />
            <div className="flex flex-col items-center">
              <span className="text-base font-semibold">{userName}</span>
              {/* <span className="text-xs text-gray-300">{role}</span> */}
            </div>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-48 transition-all duration-300 ${
              isDropdownOpen 
                ? "opacity-100 visible translate-y-0" 
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            <div className="p-1 space-y-1">
              <Link
                to="/change-password"
                className="flex items-center justify-end gap-2 px-3 py-2 rounded-md hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm">تغيير كلمة السر</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </Link>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-end gap-2 px-3 py-2 rounded-md hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm">تسجيل خروج</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;