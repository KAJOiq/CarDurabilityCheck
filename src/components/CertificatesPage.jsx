import React, { useState, useEffect } from "react";

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch certificates data from the API
    const fetchCertificates = async () => {
      try {
        const response = await fetch("YOUR_API_ENDPOINT"); // Replace with the actual API endpoint
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCertificates(data);
      } catch (err) {
        setError("Failed to fetch certificates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">شهادات الفحص</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">الاسم</th>
            <th className="border border-gray-300 px-4 py-2">التاريخ</th>
            <th className="border border-gray-300 px-4 py-2">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate, index) => (
            <tr key={certificate.id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{certificate.name}</td>
              <td className="border border-gray-300 px-4 py-2">{certificate.date}</td>
              <td className="border border-gray-300 px-4 py-2">{certificate.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificatesPage;
