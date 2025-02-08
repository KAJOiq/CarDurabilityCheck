import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  DocumentTextIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";

const Header = ({ userName, role, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white w-full p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold text-right">نظام إدارة طلبات فحص المتانة</h1>
      <nav className="flex items-center gap-6 text-lg">
      {(role === "admin" || role === "reporter") && (
          <Link
            to="/reports"
            className="flex items-center gap-2 hover:text-blue-400 transition duration-200"
          >
            <ChartBarSquareIcon className="w-6 h-6" />
            التقارير
          </Link>
        )}
        {(role === "admin" || role === "checker") && (
          <Link
            to="/certificates"
            className="flex items-center gap-2 hover:text-blue-400 transition duration-200"
          >
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
            شهادات الفحص
          </Link>
        )}
        {(role === "admin" || role === "user") && (
          <Link
            to="/entry"
            className="flex items-center gap-2 hover:text-blue-400 transition duration-200"
          >
            <DocumentTextIcon className="w-6 h-6" />
            الاستمارات
          </Link>
        )}
         {role === "admin" && (
          <Link
            to="/users"
            className="flex items-center gap-2 hover:text-blue-400 transition duration-200"
          >
            <UsersIcon className="w-6 h-6" />
            المستخدمون
          </Link>
        )}
        {/* User Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="flex items-center gap-2 hover:text-blue-400 transition duration-200">
            <UserCircleIcon className="w-6 h-6" />
            {userName}
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 bg-white text-black mt-2 rounded-lg shadow-lg w-48 transition-all duration-200 ${
              isDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            {/* Caret */}
            <div className="absolute -top-2 right-3 w-4 h-4 bg-white transform rotate-45" />

            <div className="relative bg-white rounded-lg p-1">
              <Link
                to="/change-password"
                className="block text-right px-4 py-2 hover:bg-gray-100 rounded-t-lg transition-colors"
              >
                تغيير كلمة المرور
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-right px-4 py-2 hover:bg-gray-100 rounded-b-lg transition-colors"
              >
                تسجيل خروج
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
