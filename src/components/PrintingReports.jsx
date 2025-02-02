import React from 'react';

const PrintingReports = ({ data }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Printing Report</title></head><body>');
    printWindow.document.write('<h1>تقرير</h1>');
    printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
    printWindow.document.write('<thead><tr><th>نوع الاستمارة</th><th>نوع المحرك</th><th>عدد الاستمارات الحكومية</th><th>عدد شهادات الفحص</th><th>مجموع عدد الاستمارات</th></tr></thead><tbody>');
    
    data.forEach(item => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${item.formType}</td>`);
      printWindow.document.write(`<td>${item.engineType}</td>`);
      printWindow.document.write(`<td>${item.governmentForms}</td>`);
      printWindow.document.write(`<td>${item.inspectionCertificates}</td>`);
      printWindow.document.write(`<td>${item.totalForms}</td>`);
      printWindow.document.write('</tr>');
    });

    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="relative flex flex-col items-center bg-slate-50 min-h-screen pt-10 px-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        {/* Print Button */}
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mb-8"
          onClick={handlePrint}
        >
          طباعة التقرير
        </button>

        {/* Report Table */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">نوع الاستمارة</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">نوع المحرك</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">عدد الاستمارات الحكومية</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">عدد شهادات الفحص</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-700">مجموع عدد الاستمارات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2 text-sm text-gray-700">{item.formType}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{item.engineType}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{item.governmentForms}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{item.inspectionCertificates}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{item.totalForms}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintingReports;
