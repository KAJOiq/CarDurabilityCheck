import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";

const EnableUsers = ({ userId, onEnable, isEnabled }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleEnableConfirmation = async (confirmed) => {
    if (!confirmed) {
      setShowConfirmModal(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetchData(`Users/${userId}/enable-user-account`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.isSuccess) {
        onEnable(userId);
      } else {
        setErrorMessage("فشل في تمكين المستخدم، يرجى المحاولة مرة أخرى");
      }
    } catch (error) {
      setErrorMessage("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmModal(true)}
        className={`p-2 rounded-lg transition-all ${
          isEnabled
            ? "text-gray-400 cursor-not-allowed"
            : "text-green-600 hover:bg-green-50 hover:text-green-800"
        }`}
        disabled={isEnabled}
      >
        <CheckCircleIcon className="w-5 h-5" />
      </button>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="text-right mb-6">
              <h3 className="text-xl font-bold text-gray-800">تفعيل المستخدم</h3>
              <p className="text-gray-600 mt-2">هل أنت متأكد من رغبتك في تفعيل هذا المستخدم؟</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleEnableConfirmation(false)}
                className="group bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-2.5 rounded-xl
                         hover:from-gray-200 hover:to-gray-300 transition-all duration-300
                         flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleEnableConfirmation(true)}
                disabled={isLoading}
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl
                         hover:from-green-600 hover:to-green-700 transition-all duration-300
                         flex items-center justify-center gap-2 shadow-md hover:shadow-lg
                         disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="animate-pulse">جاري التفعيل...</span>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>تأكيد التفعيل</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnableUsers;
