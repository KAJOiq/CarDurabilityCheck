import React, { useState } from "react";
import fetchData from "../utils/fetchData";

const UpdateUsers = ({ userId, closeModal, refreshUsers }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password) {
      setError("يرجى تعبئة كلا الحقلين.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(""); 

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetchData(
        `Users/update-user-information?UserId=${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, password }),
        }
      );

      if (response.isSuccess) {
        setTimeout(() => {
          setSuccessMessage("تم تحديث بيانات المستخدم بنجاح");
        });

        setTimeout(() => {
          refreshUsers();
          closeModal();
        }, 1000); 
      } else {
        setError("فشل في تحديث معلومات المستخدم");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحديث المستخدم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex text-right items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-2xl font-bold mb-4">تحديث بيانات المستخدم</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 mb-4 animate-fade-in">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">الاسم</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">كلمة المرور</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="group bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl 
                       hover:from-gray-600 hover:to-gray-700 transition-all duration-300 
                       flex items-center justify-center gap-3 shadow-lg hover:shadow-xl w-1/2"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl 
                       hover:from-blue-600 hover:to-blue-700 transition-all duration-300 
                       flex items-center justify-center gap-3 shadow-lg hover:shadow-xl w-1/2 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جاري التحديث..." : "تحديث المستخدم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUsers;
