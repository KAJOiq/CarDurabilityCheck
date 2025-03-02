import React, { useState } from "react";
import fetchData from "../utils/fetchData";
import { CheckCircleIcon, XCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const UpdateVehicleNamePopup = ({ onClose, refreshData, vehicleId, vehicleName: initialVehicleName }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [vehicleName, setVehicleName] = useState(initialVehicleName || "");

  const handleSubmit = async () => {
    if (!vehicleName || !vehicleId) {
      setError("يرجى تعبئة جميع الحقول.");
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetchData(
        `admin/lookup/update-vehicle-name?Id=${vehicleId}&NewName=${encodeURIComponent(vehicleName)}`,
        {
          method: "PUT",
          headers: {
            "accept": "*/*",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.isSuccess) {
        setSuccess("تم تعديل اسم المركبة بنجاح!");
        refreshData(); 
        setTimeout(() => {
          onClose(); 
        }, 1000);
      } else {
        setError(response.errors?.[0]?.message || "حدث خطأ أثناء التعديل");
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
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            <PencilSquareIcon className="w-6 h-6 inline-block mr-2 text-green-500" />
            تعديل اسم المركبة
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
              <XCircleIcon className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المركبة</label>
            <input
              type="text"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="أدخل اسم المركبة"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="animate-pulse">جاري التعديل...</span>
            ) : (
              <>
                <PencilSquareIcon className="w-5 h-5" />
                <span>تعديل</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateVehicleNamePopup;