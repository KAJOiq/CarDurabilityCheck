import React, { useState, useEffect } from "react";
import fetchData from "../utils/fetchData";
import { MagnifyingGlassIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import CertificatesFormForCar from "./CertificatesFormForCar";  
import CertificatesFormForTruck from "./CertificatesFormForTruck";
import CertificatesFormForBike from "./CertificatesFormForBike";
import CertifyButton from "./CertifyButton";
import { QrReader } from "react-qr-reader";
const CertificatesPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showQrReader, setShowQrReader] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setApplicationId(searchInput);
    setSuccessMessage("");
  };

  const fetchCertificate = async () => {
    if (!applicationId) return;
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

  useEffect(() => {
    fetchCertificate();
  }, [applicationId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleScan = (data) => {
    if (data) {
      setSearchInput(data);
      setApplicationId(data);
      setShowQrReader(false);
    }
  };

  const handleError = (err) => {
    console.error("Error scanning QR code:", err);
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
            <button
              type="button"
              onClick={() => setShowQrReader(!showQrReader)}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 px-8 py-4 text-white font-semibold transition-all flex items-center gap-3"
            >
              البحث من خلال مسح الكود ضوئيًا
            </button>
          </div>
        </form>

        {showQrReader && (
          <div className="flex justify-center">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%", maxWidth: "300px" }}
            />
          </div>
        )}

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

              <CertifyButton 
                formData={formData} 
                disabled={formData.isInspectionCertified}
                onCertificationSuccess={fetchCertificate}
                className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                  formData.isInspectionCertified ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              />

              <div className={`transition ${formData.isInspectionCertified ? "" : "opacity-50 cursor-not-allowed"}`}>
                {formData.vehicleType === "سيارة" &&
                 <CertificatesFormForCar 
                    formData={formData} 
                    disabled={!formData.isInspectionCertified}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                      formData.isInspectionCertified ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                />}

                {formData.vehicleType === "شاحنة" &&
                 <CertificatesFormForTruck 
                    formData={formData} 
                    disabled={!formData.isInspectionCertified}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                      formData.isInspectionCertified ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                />}

                {formData.vehicleType === "دراجة" && 
                <CertificatesFormForBike 
                    formData={formData} 
                    disabled={!formData.isInspectionCertified}
                    className={`px-4 py-2 rounded-lg font-semibold text-white transition ${
                      formData.isInspectionCertified ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                />}
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              {Object.entries({
                  "رقم استمارة المرور": formData.trafficPoliceApplicationId,
                  "رقم وصل القبض": formData.governmental ? `حكومي ` : formData.receiptId,
                  "اسم المواطن": formData.ownerFirstName + " " + formData.fatherName + " " + formData.grandFatherName + " " + formData.surename,
                  "نوع الاستمارة": formData.vehicleType,
                  "حكومي؟": formData.governmental ? "نعم" : "لا",
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
                  "تاريخ الإصدار": formatDate(formData.issueDate),
                  "المديرية" : formData.agencyName,
                  "الموقع": formData.locationName,
                  "هل صدرت لها شهادة ؟" : formData.isInspectionCertified ? "نعم" : "لا",
                  "رقم الملصق" : formData.stickerNumber,
                  "مثبت الملصق" : formData.stickerProvider,
                  "صورة السيارة": formData.cropedCarImagePath,
                }).map(([label, value]) =>
                  label === "صورة السيارة" ? (
                    <div key={label} className="col-span-2">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-600 mb-3">{label}</h3>
                        <div className="flex justify-center">
                          <img
                            src={`http://localhost:5273${formData.cropedCarImagePath}`}
                            alt="Car Image"
                            className="w-64 h-48 object-contain rounded-lg shadow-md border-2 border-gray-200"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={label} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <span className="font-semibold text-gray-600">{label}:</span>
                      <span className="text-gray-800">{value || "---"}</span>
                    </div>
                  )
                )}
            </div>
            {formData.trailers?.length > 0 && (
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-md font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-4">
                      تفاصيل المقطورات
                    </h3>
                    <div className="grid grid-cols-1 md:grid-rows-1 gap-4">
                      {formData.trailers.map((trailer) => (
                        <div key={trailer.trailerId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries({
                              "رقم الشاصي": trailer.chassisNumber,
                              "عدد المحاور": trailer.axelsNumber,
                              "الحمولة": trailer.loadWeight,
                              "الفئة": trailer.category,
                            }).map(([label, value]) => (
                              <div key={label}>
                                <span className="block text-sm font-medium text-gray-500">{label}</span>
                                <span className="block text-md font-semibold text-gray-800">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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