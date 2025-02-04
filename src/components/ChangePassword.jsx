import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import FetchData from "../utils/fetchData";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#\$\^+=!*()@%&])[A-Za-z\d#$\^+=!*()@%&]{6,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validatePassword(password)) {
      setError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل، وتحتوي على حرف كبير واحد على الأقل، وحرف صغير واحد، ورقم واحد، وحرف خاص واحد (#$^+=!*()@%&).");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Password", password);

      const response = await FetchData("PATCH", "Users/change-password", formData, true);

      if (response.isSuccess) {
        setSuccess("تم تغيير كلمة المرور بنجاح.");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(response.errors?.[0]?.message || "حدث خطأ أثناء تغيير كلمة المرور.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">تغيير كلمة المرور</h2>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-md mb-3">
            <ExclamationCircleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-600 bg-green-100 p-3 rounded-md mb-3">
            <CheckCircleIcon className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="relative">
            <span className="text-gray-700 block mb-1">كلمة المرور الجديدة</span>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <LockClosedIcon className="w-5 h-5 absolute top-3 right-3 text-gray-400" />
            </div>
          </label>

          <button
            type="submit"
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl
                      hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "جاري التغيير..." : "تغيير"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
