import React from "react";
import { Link } from "react-router-dom";

const Header = ({ userName, setFormType }) => {
  return (
    <header className="bg-gray-800 text-white w-full p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-right">نظام ادارة طلبات فحص المتانة</h1>
      <nav className="flex items-center space-x-4">
        <Link to="/entry" className="hover:underline">
        الاستمارات
        </Link>
        <Link to="/users" className="hover:underline">
        المستخدمون
        </Link>
        <Link to="/certificates" className="hover:underline">
          شهادات الفحص
        </Link>
        <Link to="/reports" className="hover:underline">
          التقارير
        </Link>
        <div className="relative group">
          <button className="hover:underline">{userName}</button>
          <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow-lg">
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">تغيير كلمة المرور</a>
            <a href="#" className="block px-4 py-2 hover:bg-gray-200">تسجيل خروج</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;