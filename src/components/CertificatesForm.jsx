import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";
import QRCode from "qrcode";

const CertificatesForm = ({ formData }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [stickerNumber, setStickerNumber] = useState("");
  const [stickerProvider, setStickerProvider] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

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
    @media print {
      @page {
        size: A5 landscape;
      }
      body {
        font-family: Arial, sans-serif;
        direction: rtl;
      }
    }
  </style>
</head>
<body class="bg-white w-[210mm] h-[148mm] p-6 text-right">

<!-- Header -->
<div class="flex items-center border-b-2 border-gray-300 pb-4" dir="rtl">
  <!-- Logo on the left -->
  <div class="w-24 flex items-center justify-start">
    <img src="${logo}" alt="Logo" class="w-auto h-auto">
  </div>

  <!-- Centered Titles -->
  <div class="flex flex-col items-center justify-center flex-grow mx-4">
    <h1 class="text-2xl font-bold mb-1 text-gray-800">جمهورية العراق</h1>
    <h2 class="text-xl font-semibold text-gray-700">وزارة الداخلية</h2>
    <h3 class="text-lg mt-2 font-bold text-black-600">شهادة فحص المركبة</h3>
  </div>

  <!-- QR Code Container -->
  <div class="w-24 flex items-center justify-end">
    <img src="${qrCodeDataUrl}" alt="QR Code" class="w-auto h-auto">
  </div>

  <!-- Right-side Details -->
  <div class="flex flex-col items-end w-1/4">
    <!-- Additional Information -->
    <div class="text-sm mb-4 space-y-2">
      <p class="whitespace-normal">
        <strong>رقم استمارة الفحص:</strong>
        <span class="text-gray-600">${formData.applicationId}</span>
      </p>
      <p class="whitespace-normal">
        <strong>اسم الموقع:</strong>
        <span class="text-gray-600">${formData.location}</span>
      </p>
      <p class="whitespace-normal">
        <strong>تاريخ الاصدار:</strong>
        <span class="text-gray-600">${formatDate(formData.issueDate)}</span>
      </p>
      <p class="whitespace-normal">
        <strong>تاريخ النفاذ:</strong>
        <span class="text-gray-600">${formatDate(formData.expiryDate)}</span>
      </p>
    </div>
  </div>
</div>

   <!-- Main Content with Grid -->
<div class="grid grid-cols-2 gap-6 mt-4">
  <!-- Vehicle Data (Left) -->
  <div class="border border-gray-300 rounded-lg p-4" dir="rtl">
    <h3 class="bg-gray-200 text-center font-bold py-2">بيانات المركبة</h3>
    <div class="text-sm">
      ${[
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
        <div class="flex justify-start py-1">
          <span class="font-semibold w-1/3">${label}:</span>
          <span class="w-2/3">${value || '---'}</span>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Form Data (Right) -->
  <div class="border border-gray-300 rounded-lg p-4" dir="rtl">
    <h3 class="bg-gray-200 text-center font-bold py-2">بيانات الاستمارة</h3>
    <div class="text-sm">
      ${[
        ["اسم المواطن", formData.carOwnerName],
        ["رقم وصل القبض", formData.receiptId],
        ["رقم الملصق", stickerNumber]
      ].map(([label, value]) => `
        <div class="flex justify-start py-1">
          <span class="font-semibold w-1/3">${label}:</span>
          <span class="w-2/3">${value || '---'}</span>
        </div>
      `).join('')}

      <!-- Sticker Information -->
      <div class="flex justify-start py-1">
        <span class="font-semibold w-1/3">مثبت الملصق:</span>
        <span class="w-2/3">${stickerProvider || '---'}</span>
      </div>

      <!-- Vehicle Image -->
      <div class="flex justify-center mt-4">
        <div class="border-2 border-dashed flex items-center justify-center text-gray-500 text-xs">
          ${formData.photo2 ? `<img src="${formData.photo2}" class="object-contain" />` : 'صورة المركبة'}
        </div>
      </div>
    </div>
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
        onClick={() => setIsModalOpen(true)} // Open modal on button click
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg 
                      hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
        </svg>
        طباعة شهادة الفحص
      </button>

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
                onClick={() => {
                  if (stickerNumber && stickerProvider) {
                    handlePrint();
                    setIsModalOpen(false); // Close modal after printing
                  } else {
                    setError("يرجى ملء جميع الحقول."); // Error message if fields are empty
                  }
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg 
                      hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                طباعة
            </button>
            <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
    </div>
  );
};

export default CertificatesForm;