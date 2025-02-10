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
  const [certifying, setCertifying] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stickerNumber, setStickerNumber] = useState("");
  const [stickerProvider, setStickerProvider] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      } else {
        if (response.errors) {
          const errorMessage = response.errors[0].message;
          if (response.errors[0].code === "400") {
            setError("رقم الملصق مسجل بالفعل, يرجى التأكد من رقم الملصق مرة اخرى.");
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
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <CheckBadgeIcon className="h-5 w-5" />
                توثيق
              </button>
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
                "تاريخ الإصدار": formData.issueDate,
                "الموقع": formData.location,
              }).map(([label, value]) => (
                <InfoItem key={label} label={label} value={value} />
              ))}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-green-700 text-center">
            {successMessage}
          </div>
        )}
      </div>

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
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">مثبت الملصق</label>
                <input
                  type="text"
                  value={stickerProvider}
                  onChange={(e) => setStickerProvider(e.target.value)}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleCertify}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                توثيق
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
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

      {/* Certificates Form */}
      {formData && (
        <CertificatesForm formData={formData} />
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
    <span className="font-semibold text-gray-600">{label}</span>
    <span className="text-gray-800">{value || "---"}</span>
  </div>
);

export default CertificatesPage;