import React from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';

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
    <div className="relative flex flex-col items-center bg-white min-h-screen pt-8 px-4 rounded-xl shadow-lg">
      <div className="w-full max-w-4xl space-y-6">
        {/* زر الطباعة */}
        <button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl
                    hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg
                    font-semibold flex items-center justify-center gap-2"
          onClick={handlePrint}
        >
          <PrinterIcon className="w-6 h-6 text-white" />
          طباعة التقرير
        </button>

        {/* جدول التقرير */}
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-5 py-4 text-right text-sm font-semibold text-blue-700">عدد الاستمارات الحكومية</th>
                <th className="px-5 py-4 text-right text-sm font-semibold text-blue-700">عدد شهادات الفحص</th>
                <th className="px-5 py-4 text-right text-sm font-semibold text-blue-700">مجموع عدد الاستمارات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-right text-sm text-gray-700 font-medium">{item.governmentForms}</td>
                  <td className="px-5 py-3.5 text-right text-sm text-gray-700 font-medium">{item.inspectionCertificates}</td>
                  <td className="px-5 py-3.5 text-right text-sm text-gray-700 font-medium">{item.totalForms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default PrintingReports;
