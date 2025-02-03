import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';


const CertificatesPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [applicationId, setApplicationId] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setApplicationId(searchInput);
  };

  useEffect(() => {
    if (!applicationId) return;

    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/getFormData/${applicationId}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError("فشل في جلب البيانات. الرجاء التحقق من الرقم والمحاولة مرة أخرى.");
        setFormData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [applicationId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Search Section */}
        <form onSubmit={handleSearch} className="group">
          <div className="flex gap-2 shadow-lg rounded-xl overflow-hidden">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="رقم الاستمارة"
              className="flex-1 p-4 text-lg border-0 focus:ring-2 focus:ring-blue-500 rounded-l-xl bg-white/95"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 
                        px-8 py-4 text-white font-semibold transition-all flex items-center gap-3"
            >
              <MagnifyingGlassIcon className="h-6 w-6 transform group-hover:scale-110 transition-transform" />
              بحث
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="text-center p-8 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-600 font-medium">جاري تحميل البيانات...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <p className="text-red-600 font-semibold text-center flex items-center justify-center gap-2">
              <MagnifyingGlassIcon className="h-5 w-5" />
              {error}
            </p>
          </div>
        )}

        {/* Data Display */}
        {formData && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-50 p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 justify-end">
                <MagnifyingGlassIcon className="h-8 w-8 text-blue-600" />
                شهادة الفحص
              </h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              {/* البيانات الأساسية */}
              <div className="space-y-2">
                <InfoItem label="👤 الاسم" value={formData.customerName} />
                <InfoItem label="🚗 نوع المركبة" value={formData.vehicleType} />
                <InfoItem label="🎨 لون المركبة" value={formData.vehicleColor} />
                <InfoItem label="🔢 رقم المركبة" value={formData.vehicleNumber} />
              </div>

              {/* البيانات الفنية */}
              <div className="space-y-2">
                <InfoItem label="🛠️ نوع المحرك" value={formData.engineType} />
                <InfoItem label="⚙️ عدد الأسطوانات" value={formData.cylinderCount} />
                <InfoItem label="📅 التاريخ" value={formData.date} />
                <InfoItem label="📍 الموقع" value={formData.nameOfLocation} />
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!formData && applicationId && !loading && !error && (
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
            <p className="text-yellow-700 font-medium text-center flex items-center justify-center gap-2">
              <MagnifyingGlassIcon className="h-5 w-5" />
              لا توجد نتائج للرقم المطلوب
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for reusable info items
const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
    <span className="font-semibold text-gray-600">{label}</span>
    <span className="text-gray-800">{value || '---'}</span>
  </div>
);

export default CertificatesPage;