import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, LockClosedIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import FetchData from "../utils/fetchData";

const Login = ({ onLogin }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await FetchData(
        "Users/login",
        {
          method: "POST",
          body: JSON.stringify({ userName, password }),
        },
        { "Content-Type": "application/json" }
      );

      if (data.isSuccess) {
        const { accessToken, userDetails } = data.results;
        const { id, role } = userDetails;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("id", id);
        localStorage.setItem("role", role); // roles:- admin, user, supervisor, reporter, checker.

        onLogin(userName);
        navigate("/users");
      } else {
        throw new Error("فشل تسجيل الدخول. حاول مرة أخرى.");
      }
    } catch (error) {
      setErrorMessage(error.message || "حدث خطأ. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">تسجيل الدخول</h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              placeholder="اسم المستخدم"
              className="border rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="كلمة المرور"
              className="border rounded-lg pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center bg-blue-500 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-600 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
          {errorMessage && <p className="text-red-500 text-center mt-3">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
