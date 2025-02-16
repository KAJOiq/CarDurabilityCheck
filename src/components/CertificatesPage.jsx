import React, { useState, useEffect } from "react";
import fetchData from "../utils/fetchData";
import { MagnifyingGlassIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import CertificatesForm from "./CertificatesForm"; // Import the CertificatesForm

const CertificatesPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setApplicationId(searchInput);
    setSuccessMessage("");
  };

  useEffect(() => {
    if (!applicationId) return;

    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData(
          `checker/application/find-application?applicationId=${applicationId}`,
          { method: "GET" }
        );
        if (data.isSuccess) {
          setFormData(data.results);
        } else {
          if (data.errors) {
            const errorMessage = data.errors[0].message;
            if (data.errors[0].code === "404") {
              setError("لم يتم العثور على الاستمارة.");
            } else {
              setError(errorMessage);
            }
          }
          setFormData(null);
        }
      } catch (err) {
        setError("فشل في جلب البيانات. الرجاء التحقق من الرقم والمحاولة مرة أخرى.");
        setFormData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [applicationId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <form onSubmit={handleSearch} className="group">
          <div className="flex flex-row-reverse gap-2 shadow-lg rounded-xl overflow-hidden">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ادخل رقم استمارة الفحص"
              className="flex-1 p-4 text-lg border-0 focus:ring-2 focus:ring-blue-500 rounded-r-xl bg-white/95 text-right"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-8 py-4 text-white font-semibold transition-all flex items-center gap-3"
            >
              <MagnifyingGlassIcon className="h-6 w-6 transform group-hover:scale-110 transition-transform" />
              بحث
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center p-8 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-600 font-medium">جاري تحميل البيانات...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <p className="text-red-600 font-semibold text-center">{error}</p>
          </div>
        )}

        {formData && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-50 p-6 border-b flex justify-between items-center flex-row-reverse">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
                {formData.applicationId}
              </h2>
              {/* Certificates Form */}
              {formData && (
                <CertificatesForm 
                  formData={formData} 
                />
              )}              
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              {Object.entries({
                "رقم استمارة المرور": formData.trafficPoliceApplicationId,
                "رقم وصل القبض": formData.receiptId,
                "اسم المواطن": formData.carOwnerName,
                "نوع الاستمارة": formData.vehicleType,
                "الاستخدام": formData.usage,
                "نوع المركبة": formData.carBrand,
                "طراز المركبة": formData.carName,
                "لون المركبة": formData.carColor,
                "الموديل": formData.carModel,
                "رقم اللوحة": formData.plateNumber,
                "رقم الشاصي": formData.chassisNumber,
                "نوع المحرك": formData.engineType,
                "عدد السلندر": formData.engineCylindersNumber,
                "عدد الركاب": formData.seatsNumber,
                "الحمولة": formData.loadWeight,
                "فئة المركبة": formData.category,
                "تاريخ الإصدار": formatDate(formData.issueDate),
                "الموقع": formData.location,
                "صورة السيارة": formData.cropedCarImagePath,
              }).map(([label, value]) =>
                label === "صورة السيارة" ? (
                  <div key={label} className="col-span-2 flex flex-col items-start">
                    <span className="font-semibold text-gray-600">{label}:</span>
                    <img
                      src={`http://localhost:5273${formData.cropedCarImagePath}`}
                      alt="Car Image"
                      className="w-48 mt-2 rounded-lg shadow-md border"
                    />
                  </div>
                ) : (
                  <div key={label} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="font-semibold text-gray-600">{label}:</span>
                    <span className="text-gray-800">{value || "---"}</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-green-700 text-center">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;