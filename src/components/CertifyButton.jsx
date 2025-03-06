import React, { useEffect, useState } from "react";
import fetchData from "../utils/fetchData";

const CertifyButton = ({ formData, disabled, onCertificationSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [certifying, setCertifying] = useState(false);
  const [stickerNumber, setStickerNumber] = useState("");
  const [stickerProvider, setStickerProvider] = useState("");

  const handleCertify = async () => {
    if (!formData || !stickerNumber || !stickerProvider) return;
    setCertifying(true);
    setError(null);
    setSuccessMessage("");

    const form = new FormData();
    form.append("ApplicationId", formData.applicationId);
    form.append("StickerNumber", stickerNumber);
    form.append("StickerProvider", stickerProvider);

    try {
        const response = await fetchData("checker/application/certify-durability-application", {
            method: "PUT",
            body: form,
        });

        if (response.isSuccess) {
            setSuccessMessage("تم التوثيق بنجاح!");
            onCertificationSuccess();
        } else {
            if (response.errors && response.errors.length > 0) {
                const errorCode = response.errors[0].code;
                const errorMessage = response.errors[0].message;

                if (errorCode === "400") {
                    if (errorMessage.includes("الرجاء ادخال الاسم الكامل لمثبت الملصق")) {
                        setError("يرجى إدخال الاسم الكامل لمُثبِّت الملصق قبل المتابعة.");
                    } else if (errorMessage.includes("رقم الملصق مسجل بالفعل")) {
                        setError("رقم الملصق مسجل بالفعل، يرجى التأكد من رقم الملصق مرة أخرى.");
                    } else {
                        setError(errorMessage);
                    }
                } else {
                    setError(errorMessage);
                }
            } else {
                setError("فشل في توثيق الشهادة، يرجى المحاولة لاحقًا.");
            }
        }
    } catch (err) {
        setError("حدث خطأ أثناء التوثيق، يرجى المحاولة مرة أخرى.");
    } finally {
        setCertifying(false);
    }
};

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={disabled}
        className={`bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-lg 
                    hover:from-green-600 hover:to-green-700 transition-all duration-300
                    flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
            clipRule="evenodd"
          />
        </svg>
        اصدار شهادة الفحص
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h3 className="text-xl font-semibold text-center">أدخل تفاصيل الملصق</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">رقم الملصق</label>
                <input
                  type="text"
                  value={stickerNumber}
                  onChange={(e) => setStickerNumber(e.target.value)}
                  className="mt-1 p-2 w-full border border-black rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">مثبت الملصق</label>
                <input
                  type="text"
                  value={stickerProvider}
                  onChange={(e) => setStickerProvider(e.target.value)}
                  className="mt-1 p-2 w-full border border-black rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button 
                onClick={handleCertify}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg 
                          hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                          flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                اصدار الشهادة
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                إغلاق
              </button>
            </div>

            {/* Success or Error Popup */}
            {successMessage && (
              <div className="bg-green-100 text-green-700 text-center p-4 rounded-md mt-4">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 text-center p-4 rounded-md mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CertifyButton;