import React from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';

const PrintingReports = ({ data }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>تقرير</title>');

    // Add custom styles for the print version
    printWindow.document.write(`
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.5;
          padding: 20px;
          direction: rtl; /* Right-to-left for Arabic text */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          text-align: center;
          padding: 12px;
          border: 1px solid #ddd;
        }
        th {
          background-color: #f5f7fb;
          color: #444;
        }
        td {
          color: #333;
        }
        h2 {
          text-align: center;
          font-size: 20px;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    `);

    // Print Header Section
    printWindow.document.write('<body>');
    printWindow.document.write('<h2>تقرير فحص المتانة</h2>');
    printWindow.document.write('<p style="font-size: 18px; text-align: center; color: #555;">');
    printWindow.document.write(`${data[0]?.location || '--'} <br />`);
    printWindow.document.write(`<strong>نوع الاستمارة:</strong> ${data[0]?.formType || '--'} <br />`);
    printWindow.document.write(`<strong>نوع المحرك:</strong> ${data[0]?.engineType || '--'} <br />`);
    printWindow.document.write(`<strong>النطاق الزمني:</strong> ${data[0]?.dateRange || '--'} <br />`);
    printWindow.document.write('</p>');

    // Table Section for Print (Single Row Display)
    printWindow.document.write('<table>');
    printWindow.document.write(
      '<thead><tr><th>عدد الاستمارات الحكومية</th><th>عدد شهادات الفحص</th><th>مجموع عدد الاستمارات</th></tr></thead>'
    );
    printWindow.document.write('<tbody><tr>');
    
    data.forEach((item) => {
      printWindow.document.write(
        `<td>${item.value || '--'}</td>`
      );
    });

    printWindow.document.write('</tr></tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="relative flex flex-col items-center bg-gradient-to-r from-blue-50 via-white to-blue-100 min-h-screen pt-8 px-6 rounded-xl shadow-lg">
      <div className="w-full max-w-5xl space-y-8">
        {/* Print Button */}
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-xl font-semibold flex items-center justify-center gap-3"
          onClick={handlePrint}
        >
          <PrinterIcon className="w-6 h-6 text-white" />
          <span>طباعة التقرير</span>
        </button>

        {/* Displaying the Results in the UI - Single Row Layout */}
        <div className="mt-8 overflow-x-auto bg-white rounded-lg shadow-lg p-6">
          <table className="min-w-full border-collapse table-auto">
            <thead className="bg-blue-200">
              <tr>
                <th className="border px-6 py-3 text-center text-sm font-medium text-gray-700">عدد الاستمارات الحكومية</th>
                <th className="border px-6 py-3 text-center text-sm font-medium text-gray-700">عدد شهادات الفحص</th>
                <th className="border px-6 py-3 text-center text-sm font-medium text-gray-700">مجموع عدد الاستمارات</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                {/* Displaying each value in one row */}
                {data.map((item, index) => (
                  <td key={index} className="border px-6 py-4 text-center text-sm text-gray-700">
                    {item.value || '--'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrintingReports;
