import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchData from "../utils/fetchData";

const Login = ({ onLogin }) => { // Accept onLogin as a prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    setLoading(true);
    setErrorMessage("");
    try {
        const data = await FetchData(
            'auth/login',
            {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            },
            { 'Content-Type': 'application/json' }
        );

        const { accessToken, userDetails } = data.results;
        const { id, role } = userDetails;

        // Save sensitive data securely
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('id', id);
        
        onLogin(username); // Trigger onLogin after successful login
        navigate('/'); // Redirect to home after login
    } catch (error) {
        setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-right font-medium mb-1">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full" 
            />
          </div>
          <div>
            <label className="block text-right font-medium mb-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
          >
            تسجيل الدخول
          </button>
          {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
