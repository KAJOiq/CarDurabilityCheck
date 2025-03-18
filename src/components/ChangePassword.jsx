import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData"; 
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages([]);
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("Password", password);

      const response = await fetchData("auth/change-password", {
        method: "PATCH",
        body: formData,
      });

      if (!response.isSuccess) {
        if (response.errors) {
          setErrorMessages(response.errors.map((err) => err.message));
        } else {
          setErrorMessages(["فشل في تغيير كلمة المرور"]);
        }
        return;
      }

      setSuccessMessage("تم تغيير كلمة المرور بنجاح.");
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      setErrorMessages([err.message || "حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">تغيير كلمة المرور</h3>
          <button
            onClick={() => navigate("/")}
            className="group text-gray-500 hover:text-gray-800"
          >
            <XMarkIcon className="w-6 h-6 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {errorMessages.length > 0 && (
          <div className="text-right text-red-600 text-sm mb-3">
            <ul>
              {errorMessages.map((err, index) => (
                <li key={index}>{err} •</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && (
          <div className="text-green-600 text-sm mb-3">
            <CheckCircleIcon className="w-5 h-5 inline-block mr-2" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex justify-center">
            <button
              type="submit"
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl
                        hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                        flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "جاري التغيير..." : "تغيير"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
