import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";
import QRCode from "qrcode";

const CertificatesForm = ({ formData, photo1 }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    const qrData = JSON.stringify({
      customerName: formData.carOwnerName,
      vehicleModel: formData.carModel,
      vehicleType: formData.vehicleType,
      vehicleColor: formData.carColor,
      vehicleNumber: formData.plateNumber,
      isGovernment: formData.governmental,
      chassisNumber: formData.chassisNumber,
      model: formData.carModel,
      engineType: formData.engineType,
      cylinderCount: formData.engineCylindersNumber,
      receiptNumber: formData.receiptId,
      trafficFormNumber: formData.trafficPoliceApplicationId,
      formType: formData.vehicleType,
      applicationId: formData.applicationId,
      issueDate: formData.issueDate,
      load: formData.loadWeight,
      nameOfLocation: formData.location,
      vehicleID: formData.vehicleID,
    });

    QRCode.toDataURL(qrData)
      .then((url) => {
        if (url !== qrCodeDataUrl) setQrCodeDataUrl(url);
      })
      .catch((error) => console.error("Error generating QR code:", error));
  }, [formData]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>شهادة فحص المركبة</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page {
            size: A5 landscape;
            margin: 8mm;
          }
          body {
            font-family: 'Arial Arabic', sans-serif;
            width: 210mm;
            height: 148mm;
            padding: 10mm;
            box-sizing: border-box;
          }
          .print-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .info-cell {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 5px;
          }
          .section-header {
            background-color: #f3f4f6;
            padding: 5px;
            text-align: center;
            font-weight: bold;
          }
          .section-content {
            padding: 10px;
            font-size: 14px;
          }
          .text-small {
            font-size: 12px;
          }
        </style>
      </head>
      <body class="bg-white">
        <!-- Header Section -->
        <div class="flex justify-between items-start border-b-2 border-gray-300 pb-2">
          <div class="w-24">
            <img src="${qrCodeDataUrl}" alt="QR Code" class="w-full h-auto">
          </div>
          <div class="text-center">
            <h1 class="text-xl font-bold">جمهورية العراق</h1>
            <h2 class="text-lg font-semibold">وزارة الداخلية</h2>
            <h3 class="text-base mt-1">شهادة فحص المركبة</h3>
          </div>
          <div class="w-24">
            <img src="${logo}" alt="Logo" class="w-full h-auto">
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid print-grid mt-4">
          <!-- Vehicle Data -->
          <div class="border border-gray-200 rounded p-3">
            <h3 class="section-header">بيانات المركبة</h3>
            <div class="section-content">
              ${[
                ["اسم المواطن", formData.carOwnerName],
                ["نوع المركبة", formData.carBrand],
                ["طراز المركبة", formData.carName],
                ["لون المركبة", formData.carColor],
                ["رقم المركبة", formData.plateNumber],
                ["رقم الشاصي", formData.chassisNumber],
                ["الموديل", formData.carModel],
                ["نوع المحرك", formData.engineType],
                ["عدد السلندر", formData.engineCylindersNumber],
                ["عدد المحاور", formData.numberOfAxes]
              ].map(([label, value]) => `
                <div class="info-cell text-small">
                  <span class="font-semibold">${label}</span>
                  <span>${value || '---'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Form Data -->
          <div class="border border-gray-200 rounded p-3">
            <h3 class="section-header">بيانات الاستمارة</h3>
            <div class="section-content">
              ${[
                ["رقم استمارة الفحص", formData.applicationId],
                ["رقم استمارة المرور", formData.trafficPoliceApplicationId],
                ["رقم وصل القبض", formData.receiptId],
                ["نوع الاستمارة", formData.vehicleType],
                ["اسم الموقع", formData.location],
                ["التاريخ", formData.issueDate]
              ].map(([label, value]) => `
                <div class="info-cell text-small">
                  <span class="font-semibold">${label}</span>
                  <span>${value || '---'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Footer Section -->
        <div class="mt-4 flex justify-between items-end">
          <div class="w-32 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm">
            ${formData.photo2 ? `<img src="${formData.photo2}" class="w-full h-full object-cover" />` : 'صورة المركبة'}
          </div>
          <div class="text-center text-sm">
            <div class="mb-2">مثبت الملصق</div>
            <div class="border-t-2 border-gray-400 w-32 mx-auto pt-1"></div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handlePrint}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg
               transition-colors duration-200 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
        </svg>
        طباعة شهادة الفحص
      </button>
    </div>
  );
};

export default CertificatesForm;
