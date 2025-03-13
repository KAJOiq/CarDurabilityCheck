import React, { useState } from "react";
import fetchData from "../../utils/fetchData";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const AddColorPopup = ({ onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [color, setColor] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("color", color);

      const response = await fetchData("admin/lookup/add-new-color", {
        method: "POST",
        body: formData
      });

      if (response.isSuccess) {
        setSuccess(response.results);
        refreshData();
        setColor("");
      } else {
        // التحقق من وجود أخطاء متعددة في الاستجابة
        if (response.errors && response.errors.length > 0) {
          setError(
            response.errors.map((err, index) => (
              <div key={index}>{err.message || "حدث خطأ أثناء الحفظ"}</div>
            ))
          );
        } else {
          setError("حدث خطأ أثناء الحفظ");
        }
      }
    } catch (err) {
      setError("انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">إضافة لون جديد</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم اللون</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            إغلاق
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>

        {(success || error) && (
          <div className={`p-4 ${success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            <div className="flex items-center gap-2">
              {success ? (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  {success}
                </>
              ) : (
                <>
                  <XCircleIcon className="w-5 h-5" />
                  {Array.isArray(error) ? error : <div>{error}</div>}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddColorPopup;
