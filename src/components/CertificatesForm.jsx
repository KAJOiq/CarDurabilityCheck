import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";
import QRCode from "qrcode";
import fetchData from "../utils/fetchData";

const CertificatesForm = ({ formData }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [stickerNumber, setStickerNumber] = useState("");
  const [stickerProvider, setStickerProvider] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [certifying, setCertifying] = useState(false);

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
    return date.toISOString().split("T")[0];
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
<div class="flex items-center justify-between border-b-2 border-black pb-4 w-full" dir="rtl">
  <!-- Left-side Titles -->
  <div class="flex flex-col items-start w-1/4 text-sm space-y-2">
    <h1 class="text-2xl font-bold text-black-800">جمهورية العراق</h1>
    <h1 class="text-xl font-bold text-black-800">وزارة الداخلية</h1>
  </div>

  <!-- Centered Section (QR Code and Logo) -->
  <div class="flex items-center justify-center space-x-12 w-1/2">
    <!-- QR Code -->
    <div class="w-24 mb-2">
      <img src="${qrCodeDataUrl}" alt="QR Code" class="w-auto h-auto" />
    </div>

    <!-- Logo in the center -->
    <div class="mb-2">
      <img src="${logo}" alt="Logo" class="w-24 h-auto" />
    </div>
  </div>

  <!-- Right-side Details -->
  <div class="flex flex-col items-end w-1/4 text-sm text-center">
    <!-- Form Data -->
    <p class="flex justify-between w-full">
      <strong class="text-black-800">رقم استمارة الفحص:</strong>
      <span class="text-gray-600">${formData.applicationId}</span>
    </p>
    <p class="flex justify-between w-full">
      <strong class="text-black-800">رقم وصل القبض:</strong>
      <span class="text-gray-600">${formData.receiptId}</span>
    </p>
    <p class="flex justify-between w-full">
      <strong class="text-black-800">اسم الموقع:</strong>
      <span class="text-gray-600">${formData.location}</span>
    </p>
    <p class="flex justify-between w-full">
      <strong class="text-black-800">تاريخ الاصدار:</strong>
      <span class="text-gray-600">${formatDate(formData.issueDate)}</span>
    </p>
    <p class="flex justify-between w-full">
      <strong class="text-black-800">تاريخ النفاذ:</strong>
      <span class="text-gray-600">${formatDate(formData.expiryDate)}</span>
    </p>
  </div>
</div>

<!-- Main Content with Grid -->
<div class="grid grid-cols-2 gap-4 mt-4">
  <!-- Vehicle Data (Left) -->
  <div class="border border-black rounded-lg p-2" dir="rtl">
    <h3 class="bg-gray-200 text-center font-bold py-1">بيانات المركبة</h3>
    <div class="text-sm">
      ${[
        ["نوع المركبة", formData.carBrand],
        ["طراز المركبة", formData.carName],
        ["لون المركبة", formData.carColor],
        ["رقم المركبة", formData.plateNumber],
        ["رقم الشاصي", formData.chassisNumber],

        [
          `<div class="flex justify-between w-full py-1 border-b border-black">
            <span class="font-semibold text-xs text-center w-1/4">الاستخدام:</span>
            <span class="text-xs w-1/4 p-1 border border-black rounded">${formData.usage || "---"}</span>
            <span class="font-semibold text-xs text-center w-1/4">عدد الركاب:</span>
            <span class="text-xs w-1/4 p-1 border border-black rounded">${formData.seatsNumber || "---"}</span>
          </div>`,
          null
        ],
        [
          `<div class="flex justify-between w-full py-1 border-b border-black">
            <span class="text-center font-semibold text-xs w-1/4">الموديل:</span>
            <span class="text-xs w-1/4 p-1 border border-black rounded">${formData.carModel || "---"}</span>
            <span class="font-semibold text-xs text-center w-1/4">عدد السلندر:</span>
            <span class="text-xs w-1/4 p-1 border border-black rounded">${formData.engineCylindersNumber || "---"}</span>
          </div>`,
          null
        ],

        [
          `<div class="flex justify-between w-full py-1 border-b border-black">
            <span class="font-semibold text-center text-xs w-1/4">نوع المحرك:</span>
            <span class="text-xs w-1/4 p-1 border border-black rounded">${formData.engineType || "---"}</span>
            <span class="font-semibold text-xs text-center w-1/4">عدد المحاور:</span>
            <span class="text-xs w-1/4 p-1 border border-black rounded">${formData.numberOfAxes || "---"}</span>
          </div>`,
          null
        ],

        [
          `<div class="flex justify-between w-full py-1 border-b border-black">
            <span class="font-semibold text-center text-xs w-1/4">فئة المركبة:</span>
            <span class="text-xs w-1/4 p-1 border border-black rounded">${formData.category || "---"}</span>
            <span class="font-semibold text-center text-xs w-1/4">الحمولة:</span>
            <span class="text-xs w-1/4 p-1 border border-black rounded">${formData.loadWeight || "---"}</span>
          </div>`,
          null
        ]   
      ]
        .map(([label, value]) => 
          value !== null
            ? `
              <div class="flex justify-between items-center py-1 border-b border-black">
                <span class="font-semibold text-center text-xs w-1/3">${label}:</span>
                <span class="text-xs w-2/3 p-1 border border-black rounded">${value || "---"}</span>
              </div>
            `
            : label 
        )
        .join("")}
    </div>
  </div>

  <!-- Form Data (Right) -->
  <div class="border border-black rounded-lg p-2" dir="rtl">
    <h3 class="bg-gray-200 text-center font-bold py-1">بيانات الاستمارة</h3>
    <div class="text-sm">
      ${[
        ["اسم المواطن", formData.carOwnerName],
        ["رقم الملصق", stickerNumber],
      ]
        .map(
          ([label, value]) => `
        <div class="flex justify-between items-center py-1 border-b border-black">
          <span class="font-semibold text-xs text-center w-1/3">${label}:</span>
          <span class="text-xs w-2/3 p-1 border border-black rounded">${value || "---"}</span>
        </div>
      `
        )
        .join("")}

      <!-- Vehicle Image -->
      <div class="flex justify-center mt-4">
        <div class="w-full max-w-48 h-auto p-2">
          ${formData.cropedCarImagePath
            ? `<img src="http://localhost:5273${formData.cropedCarImagePath}" class="object-contain w-full h-full rounded-md" />`
            : "صورة المركبة"}
        </div>
      </div>

      <!-- Sticker Information -->
      <div class="flex justify-between items-center py-1">
        <span class="font-semibold text-xs text-center w-1/3">مثبت الملصق:</span>
        <span class="text-xs w-2/3 p-1 border border-black rounded">${stickerProvider || "---"}</span>
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

  const handleBoth = async () => {
    await Promise.all([handleCertify(), handlePrint()]);
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg 
                      hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
            clipRule="evenodd"
          />
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
                  className="mt-1 p-2 w-full border border-black rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">مثبت الملصق</label>
                <input
                  type="text"
                  value={stickerProvider}
                  onChange={(e) => setStickerProvider(e.target.value)}
                  className="mt-1 p-2 w-full border border-black rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button 
                onClick={handleBoth}
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