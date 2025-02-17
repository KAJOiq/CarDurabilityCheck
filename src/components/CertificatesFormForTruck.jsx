import React, { useEffect, useState } from "react";
import logo from "../assets/logo.jpg";
import QRCode from "qrcode";
import fetchData from "../utils/fetchData";

const CertificatesFormForTruck = ({ formData }) => {
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
  <div class="flex items-center justify-between border-b-2 border-black pb-2 w-full" dir="rtl">
    <!-- Left-side Titles -->
    <div class="flex flex-col items-center w-1/4 text-sm space-y-2">
      <h1 class="text-2xl font-bold text-black-800">جمهورية العراق</h1>
      <h1 class="text-xl font-bold text-black-800">وزارة الداخلية</h1>
    </div>
  
    <!-- Centered Section (QR Code and Logo) -->
    <div class="relative flex items-center justify-center w-1/2">
      <!-- QR Code (Left) -->
      <div class="w-24 mb-2 absolute right-0 mr-4">
        <img src="${qrCodeDataUrl}" alt="QR Code" class="w-auto h-auto" />
      </div>
  
      <!-- Logo (Centered) -->
      <div class="mb-2 mx-auto absolute left-6 ml-10">
        <img src="${logo}" alt="Logo" class="w-24 h-auto" />
      </div>
    </div>
  
    <!-- Right-side Details -->
    <div class="flex flex-col items-start w-2/5 text-sm text-right font-semibold">
      <!-- كل سطر راح يكون grid مكون من عمودين -->
      <div class="grid grid-cols-2 w-full"> <!-- زيادة المسافة الأفقية هنا -->
        <!-- العمود الأول للنصوص الثابتة -->
        <div class="flex flex-col text-black-800"> <!-- زيادة المسافة الجانبية هنا -->
          <span>رقم استمارة الفحص</span> 
          <span>رقم وصل القبض</span>
          <span>اسم الموقع</span>
          <span>تاريخ الاصدار</span>
          <span>تاريخ النفاذ</span>
        </div>
  
        <!-- العمود الثاني للقيم المتغيرة -->
        <div class="flex flex-col text-black-800 font-bold text-right">
          <span>: ${formData.location}-${formData.applicationId}</span>
          <span>: ${formData.receiptId}</span>
          <span>: ${formData.agency}</span>
          <span>: ${formatDate(formData.issueDate)}</span>
          <span>: ${formatDate(formData.expiryDate)}</span>
        </div>
      </div>
    </div>
  
  </div>

<!-- Main Content with Grid -->
<div class="grid grid-cols-3 gap-2 mt-2">
  <!-- Vehicle Data (Left) -->
  <div class="border border-black rounded-lg p-1 relative col-span-2" dir="rtl">
    <h3 class="bg-gray-200 text-center font-bold">بيانات المركبة</h3>
    <div class="text-sm">
      ${[
        [
          `<div class="flex justify-between w-full py-0.5 border-black">
            <span class="font-bold text-center text-md w-1/3">نوع المركبة</span>
            <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.carBrand || "---"}</span>
            <span class="font-bold text-center text-md w-1/3">طراز المركبة</span>
            <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.carName || "---"}</span>
          </div>`,
          null,
        ],

        [
          `<div class="flex justify-between w-full py-0.5 border-black">
            <span class="font-bold text-center text-md w-1/3">لون المركبة</span>
            <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.carColor || "---"}</span>
            <span class="font-bold text-center text-md w-1/3">نوع المحرك</span>
            <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.engineType || "---"}</span>
          </div>`,
          null,
        ],
        [
          `<div class="flex justify-between w-full py-0.5 border-black">
            <span class="font-bold text-center text-md w-1/3">الاستخدام</span>
            <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${formData.usage || "---"}</span>
            <span class="font-bold text-center text-md w-1/3">الموديل</span>
            <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${formData.carModel || "---"}</span>
            <span class="font-bold text-center text-md w-1/3">عدد السلندر</span>
            <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${formData.engineCylindersNumber || "---"}</span>
          </div>`,
          null,
        ],
        
        ["رقم المركبة", formData.plateNumber],
        ["رقم الشاصي", formData.chassisNumber],

        /* [
          `<div class="flex justify-between w-full py-0.5 border border-black">
            <span class="font-extrabold text-sm text-center w-1/4 border border-black">رقم المركبة</span>
            <span class="font-semibold text-sm w-2/4 px-1 border border-black">${formData.plateNumber || "---"}</span>
            <span class="font-extrabold text-center text-sm w-1/4 border border-black">رقم الشاصي</span>
            <span class="font-semibold text-sm w-2/4 px-1 border border-black">${formData.chassisNumber || "---"}</span>
          </div>`,
          null,
        ],
 */
        [
          `<div class="border-black">
            <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الأول</h3>
            ${[
              [
                `<div class="flex justify-between w-full py-0.5 border-black">
                  <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.chassisNumbertrailer || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.numberOfAxes || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.loadWeight || "---"}</span>
                </div>`,
                null,
              ],
            ].map(([content]) => content).join('')}
          </div>`,
          null
        ],
        [
          `<div class="border-black">
            <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الثاني</h3>
            ${[
              [
                `<div class="flex justify-between w-full py-0.5 border-black">
                  <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.chassisNumbertrailer || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.numberOfAxes || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.loadWeight || "---"}</span>
                </div>`,
                null,
              ],
            ].map(([content]) => content).join('')}
          </div>`,
          null
        ],
        [
          `<div class="border-black">
            <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الثالث</h3>
            ${[
              [
                `<div class="flex justify-between w-full py-0.5 border-black">
                  <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.chassisNumbertrailer || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.numberOfAxes || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.loadWeight || "---"}</span>
                </div>`,
                null,
              ],
            ].map(([content]) => content).join('')}
          </div>`,
          null
        ],
      ]
        .map(([label, value]) =>
          value !== null
            ? `
              <div class="flex justify-between items-center py-0.5 border-black">
                <span class="font-bold text-center text-md w-1/3">${label} :</span>
                <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${value || "---"}</span>
              </div>
            `
            : label
        )
        .join("")}
    </div>

  </div>
  <!-- Form Data (Right) -->
  <div class="border border-black rounded-lg p-1 w-md" dir="rtl">
    <h3 class="bg-gray-200 text-center font-bold">بيانات الاستمارة</h3>
    <div class="text-sm">
      ${[
        ["اسم المواطن", formData.carOwnerName],
        ["رقم الملصق", stickerNumber],
      ]
        .map(
          ([label, value]) => `
        <div class="flex justify-between items-center py-0.5 border-black">
          <span class="font-bold text-center text-md w-1/3">${label}</span>
          <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${value || "---"}</span>
        </div>
      `
        )
        .join("")}
      <!-- Vehicle Image -->
      <div class="flex justify-center mt-4">
        <div class="w-full max-w-56 h-auto p-2">
          ${
            formData.cropedCarImagePath
              ? `<img src="http://localhost:5273${formData.cropedCarImagePath}"  class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
              : "صورة المركبة"
          }
        </div>
      </div>
      <!-- Sticker Information -->
      <div class="flex justify-between items-center py-0.5">
        <span class="font-bold text-center text-md w-1/3">مثبت الملصق :</span>
        <span class="font-semibold text-sm w-2/3 px-1 rounded">${stickerProvider || "---"}</span>
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
        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-lg 
                      hover:from-green-600 hover:to-green-700 transition-all duration-300
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

export default CertificatesFormForTruck;