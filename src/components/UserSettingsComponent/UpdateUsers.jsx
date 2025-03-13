import React, { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import fetchData from "../../utils/fetchData";

const UpdateUsers = ({ userId, closeModal, refreshUsers }) => {
  // const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("يرجى تعبئة كلا الحقلين.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetchData(`Users/update-user-password?UserId=${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ password }),
      });

      if (response.isSuccess) {
        setSuccessMessage("تم تحديث بيانات المستخدم بنجاح");
        setTimeout(() => {
          refreshUsers();
          closeModal();
        }, 1000);
      } else {
        setError("فشل في تحديث معلومات المستخدم");
      }
    } catch {
      setError("حدث خطأ أثناء تحديث المستخدم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="text-right mb-6">
          <h3 className="text-xl font-bold text-gray-800">تحديث بيانات المستخدم</h3>
          <p className="text-gray-600 mt-2">يمكنك تعديل كلمة المرور لهذا المستخدم</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 text-right rounded-lg">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
{/*           <div>
            <label className="block text-right text-gray-700 mb-1">الاسم</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div> */}
          <div>
            <label className="block text-right text-gray-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="group bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-2.5 rounded-xl
                         hover:from-gray-200 hover:to-gray-300 transition-all duration-300
                         flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-xl
                         hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                         flex items-center justify-center gap-2 shadow-md hover:shadow-lg
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">جاري التحديث...</span>
              ) : (
                <>
                  <PencilSquareIcon className="w-5 h-5" />
                  <span>تحديث المستخدم</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUsers;