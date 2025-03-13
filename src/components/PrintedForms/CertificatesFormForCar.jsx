import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.jpg";
import QRCode from "qrcode";

const CertificatesFormForCar = ({ formData, disabled }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const printFrameRef = useRef(null);

  const encryptData = (data) => {
    return btoa(JSON.stringify(data));
  };

  const decryptData = (encodedData) => {
    return JSON.parse(atob(encodedData));
  };

  useEffect(() => {
    const qrData = JSON.stringify({
      ADDID: formData.applicationId,
      VID: formData.vehicleID,
    });

    const encodedData = encodeURIComponent(JSON.stringify(qrData));

    QRCode.toDataURL(encodedData)
      .then((url) => setQrCodeDataUrl(url))
      .catch((error) => console.error("Error generating QR code:", error));
  }, [formData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handlePrint = () => {
    if (!formData) return;
    const printFrame = printFrameRef.current;
    if (!printFrame) return;

    const doc = printFrame.contentDocument || printFrame.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>شهادة فحص المركبة</title>
        <link href="/tailwind.css" rel="stylesheet">
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
                <span>: ${formData.locationName}-${
      formData.applicationId
    }</span>
                <span>: ${
                  formData.governmental ? `حكومي ` : formData.receiptId
                }</span>
                <span>: ${formData.agencyName}</span>
                <span>: ${formatDate(formData.issueDate)}</span>
                <span>: ${formatDate(formData.expiryDate)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main Content with Grid -->
        <div class="grid grid-cols-2 gap-2 mt-2">
          <!-- Vehicle Data (Left) -->
          <div class="border border-black rounded-lg p-1" dir="rtl">
            <h3 class="bg-gray-200 text-center font-bold py-1">بيانات المركبة</h3>
            <div class="text-md">
              ${[
                ["نوع المركبة", formData.carBrand],
                ["طراز المركبة", formData.carName],
                ["لون المركبة", formData.carColor],
                ["رقم المركبة", formData.plateNumber],
                ["رقم الشاصي", formData.chassisNumber],
                ["الموديل", formData.carModel],
                ["نوع المحرك", formData.engineType],
                ["عدد السلندر", formData.engineCylindersNumber],
                ["عدد الركاب", formData.seatsNumber],
                ["الاستخدام", formData.usage],
                //["نوع الحمل", formData.category],
              ]
                .map(
                  ([label, value]) =>
                    `
                      <div class="flex justify-between items-center py-0.5 border-black">
                        <span class="font-bold text-center text-md w-1/3">${label} :</span>
                        <span class="font-bold text-md w-5/6 px-1 border border-black rounded">${
                          value || "---"
                        }</span>
                      </div>
                    `
                )
                .join("")}
            </div>
          </div>

          <!-- Form Data (Right) -->
          <div class="border border-black rounded-lg p-2" dir="rtl">
            <h3 class="bg-gray-200 text-center font-bold py-1">بيانات الاستمارة</h3>
            <div class="text-md">
              ${[
                [
                  "اسم المواطن",
                  formData.ownerFirstName +
                    " " +
                    formData.fatherName +
                    " " +
                    formData.grandFatherName +
                    " " +
                    formData.surename,
                ],
                ["رقم الملصق", formData.stickerNumber],
              ]
                .map(
                  ([label, value]) => `
                <div class="flex justify-between items-center py-0.5 border-black">
                  <span class="font-bold text-md text-center w-1/3">${label} :</span>
                  <span class="font-bold text-md w-5/6 px-1 border border-black rounded">${
                    value || "---"
                  }</span>
                </div>
              `
                )
                .join("")}
              <!-- Vehicle Image -->
              <div class="flex justify-center mt-4">
                <div class="w-full max-w-56 h-auto p-0">
                  ${
                    formData.cropedCarImagePath
                      ? `<img src="http://localhost:5273${formData.cropedCarImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
                      : "صورة المركبة"
                  }
                </div>
              </div>
              <!-- Sticker Information -->
              <div class="flex justify-between items-center py-2">
                <span class="font-bold text-md text-center w-1/3">مثبت الملصق :</span>
                <span class="font-bold text-md w-5/6 px-1">${
                  formData.stickerProvider || "---"
                }</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printFrame.contentWindow.print();
    }, 500);
  };

  return (
    <div>
      <button
        onClick={handlePrint}
        disabled={disabled}
        className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg 
                    hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                    flex items-center justify-center gap-3 shadow-lg hover:shadow-xl
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
      <iframe ref={printFrameRef} style={{ display: "none" }} />
    </div>
  );
};

export default CertificatesFormForCar;
