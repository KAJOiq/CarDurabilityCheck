import React from "react";
import { Link } from "react-router-dom";
import { UserCircleIcon, DocumentTextIcon, UsersIcon, ClipboardDocumentCheckIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline";

const Header = ({ userName }) => {
  return (
    <header className="bg-gray-900 text-white w-full p-4 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold text-right">نظام إدارة طلبات فحص المتانة</h1>
      <nav className="flex items-center gap-6 text-lg">
        <Link to="/entry" className="flex items-center gap-2 hover:text-blue-400 transition duration-200">
          <DocumentTextIcon className="w-6 h-6" />
          الاستمارات
        </Link>
        <Link to="/users" className="flex items-center gap-2 hover:text-blue-400 transition duration-200">
          <UsersIcon className="w-6 h-6" />
          المستخدمون
        </Link>
        <Link to="/certificates" className="flex items-center gap-2 hover:text-blue-400 transition duration-200">
          <ClipboardDocumentCheckIcon className="w-6 h-6" />
          شهادات الفحص
        </Link>
        <Link to="/reports" className="flex items-center gap-2 hover:text-blue-400 transition duration-200">
          <ChartBarSquareIcon className="w-6 h-6" />
          التقارير
        </Link>
        <div className="relative group">
          <button className="flex items-center gap-2 hover:text-blue-400 transition duration-200">
            <UserCircleIcon className="w-6 h-6" />
            {userName}
          </button>
          <div className="absolute right-0 hidden group-hover:block bg-white text-black mt-2 rounded-lg shadow-lg w-48">
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">تغيير كلمة المرور</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-100">تسجيل خروج</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
