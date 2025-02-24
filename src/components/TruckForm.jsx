import React, { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import imgStatic from "../assets/truck.png";
import QRCode from "qrcode"; 


const TruckForm = ({ searchResults }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

    useEffect(() => {
      if (!searchResults ) return;
      const qrData = JSON.stringify({
        "رقم استمارة الفحص": searchResults.applicationId,
              "رقم استمارة المرور": searchResults.trafficPoliceApplicationId,
              "رقم وصل القبض": searchResults.receiptId,
              "اسم المواطن": searchResults.carOwnerName,
              "نوع الاستمارة": searchResults.vehicleType,
              "الاستخدام": searchResults.usage,
              "نوع المركبة": searchResults.carBrand,
              "طراز المركبة": searchResults.carName,
              "لون المركبة": searchResults.carColor,
              "الموديل": searchResults.carModel,
              "رقم اللوحة": searchResults.plateNumber,
              "رقم الشاصي": searchResults.chassisNumber,
              "نوع المحرك": searchResults.engineType,
              "عدد السلندر": searchResults.engineCylindersNumber,
              "عدد المحاور": searchResults.vehicleAxlesNumber,
              "عدد الركاب": searchResults.seatsNumber,
              "الحمولة": searchResults.loadWeight,
              "حكومي ؟": searchResults.governmental,
              "فئة المركبة": searchResults.category,
              "تاريخ الإصدار": searchResults.issueDate,
              "المديرية": searchResults.agency,
              "الموقع": searchResults.location,
      });
  
      QRCode.toDataURL(qrData)
        .then((url) => {
          if (url !== qrCodeDataUrl) {
            setQrCodeDataUrl(url); 
          }
        })
        .catch((error) => console.error("Error generating QR code:", error));
    }, [searchResults]); 
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    };
  const handlePrint = () => {
    if (!searchResults) return;
    const logoBase64 = logo;
    const imgStaticBase64 = imgStatic;
    const printWindow = window.open("_blank");
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
            size: A4 portrait;
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
            <img src="${logoBase64}" alt="Logo" class="w-24 h-auto" />
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
            </div>
      
            <!-- العمود الثاني للقيم المتغيرة -->
            <div class="flex flex-col text-black-800 font-bold text-right">
              <span>: ${searchResults.location}-${searchResults.applicationId}</span>
              <span>: ${searchResults.receiptId}</span>
              <span>: ${searchResults.agency}</span>
              <span>: ${formatDate(searchResults.issueDate)}</span>
           
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
            <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.carBrand || "---"}</span>
            <span class="font-bold text-center text-md w-1/3">طراز المركبة</span>
            <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.carName || "---"}</span>
          </div>`,
          null,
        ],

        [
          `<div class="flex justify-between w-full py-0.5 border-black">
            <span class="font-bold text-center text-md w-1/3">لون المركبة</span>
            <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.carColor || "---"}</span>
            <span class="font-bold text-center text-md w-1/3">نوع المحرك</span>
            <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.engineType || "---"}</span>
          </div>`,
          null,
        ],
        [
          `<div class="flex justify-between w-full py-0.5 border-black">
            <span class="font-bold text-center text-md w-1/3">الاستخدام</span>
            <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${searchResults.usage || "---"}</span>
            <span class="font-bold text-center text-md w-1/3">الموديل</span>
            <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${searchResults.carModel || "---"}</span>
            <span class="font-bold text-center text-md w-1/3">عدد السلندر</span>
            <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${searchResults.engineCylindersNumber || "---"}</span>
          </div>`,
          null,
        ],
        
        ["رقم المركبة", searchResults.plateNumber],
        ["رقم الشاصي", searchResults.chassisNumber],

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
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.chassisNumbertrailer || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.numberOfAxes || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.loadWeight || "---"}</span>
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
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.chassisNumbertrailer || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.numberOfAxes || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.loadWeight || "---"}</span>
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
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.chassisNumbertrailer || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.numberOfAxes || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.loadWeight || "---"}</span>
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
          <!-- Vehicle Image -->
            
             <div class="border border-black grid grid-rows-2 rounded-lg p-2" >
              <div class="w-full max-w-100 h-auto p-0" dir="rtl" >
                ${searchResults.cropedCarImagePath
                  ? `<img src="http://localhost:5273${searchResults.cropedCarImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
                  : "صورة المركبة"}
                 </div>  
                 <div class="w-full max-w-100 h-auto p-0 dir="rtl"">
                ${searchResults.cropedCarImagePath
                  ? `<img src="http://localhost:5273${searchResults.cropedCarImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
                  : "صورة المركبة"}
              </div>

            </div>
           

          </div>
    <div class="border border-black rounded-lg p-2 w-full mt-4 mx-auto">
    <div class="h-auto p-0 w-full">
        <img src="${imgStaticBase64}" 
             class="w-full h-auto object-scale-down mx-auto" 
             style="max-width: 90% !important;
                    display: block !important;
                    margin: 0 auto !important;" />
    </div>
</div>
        </body>
        </html>
    `);
    printWindow.document.close();

    // Add a delay of 500 milliseconds (0.5 seconds) before calling print()
    setTimeout(() => {
      printWindow.print();
    }, 500);  // Adjust the 500 milliseconds as needed
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-700"
        onClick={handlePrint}
      >
        طباعة الاستمارة
      </button>

    </div>
  );
};

export default TruckForm;
