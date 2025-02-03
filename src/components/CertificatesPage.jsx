import React, { useState, useEffect } from "react";

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
    <div className="p-4 relative">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ادخل رقم الاستمارة"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 backdrop-blur-lg flex items-center justify-center p-4 rounded-lg text-white hover:bg-blue-600 transition-colors gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            بحث عن استمارة
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      )}

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {formData && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-right">شهادة الفحص</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <tbody>
              {/* Table rows remain the same as before */}
              <tr><td className="border px-4 py-2">الاسم</td><td className="border px-4 py-2">{formData.customerName}</td></tr>
              <tr><td className="border px-4 py-2">نوع المركبة</td><td className="border px-4 py-2">{formData.vehicleType}</td></tr>
              {/* ... rest of the table rows ... */}
            </tbody>
          </table>
        </div>
      )}

      {!formData && applicationId && !loading && !error && (
        <p className="text-center text-gray-500 mt-4">لا توجد نتائج للرقم المطلوب</p>
      )}
    </div>
  );
};

export default CertificatesPage;