import React, { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import imgStatic from "../assets/truck.png";
import QRCode from "qrcode"; 
import { PrinterIcon } from "@heroicons/react/24/outline";

const TruckForm = ({ searchResults }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const printFrameRef = useRef(null);

      const encryptData = (data) => {
        return btoa(JSON.stringify(data)); 
      };
    
      const decryptData = (encodedData) => {
        return JSON.parse(atob(encodedData));
      };
    
      useEffect(() => {
        if (!searchResults) return;
      
        const data = {
          ADDID: searchResults.applicationId,
          VID: searchResults.vehicleID,
        };
      
        const encodedData = encodeURIComponent(JSON.stringify(data));
      
        QRCode.toDataURL(encodedData)
          .then((url) => setQrCodeDataUrl(url))
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
              <span>: ${searchResults.governmental ? `حكومي ` : searchResults.receiptId}</span>
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
        ["اسم المالك", searchResults.ownerFirstName + " " + searchResults.fatherName + " " + searchResults.grandFatherName + " " + searchResults.surename],
        ["رقم المركبة", searchResults.plateNumber],
        ["رقم الشاصي", searchResults.chassisNumber],

         // بيانات الملحق الأول
         [
          `<div class="border-black">
            <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الأول</h3>
            ${[
              [
                `<div class="flex justify-between w-full py-0.5 border-black">
                  <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[0]?.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[0]?.chassisNumber || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[0]?.axlesNumber || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[0]?.loadWeight || "---"}</span>
                </div>`,
                null,
              ],
            ].map(([content]) => content).join('')}
          </div>`,
          null
        ],

        // بيانات الملحق الثاني
        [
          `<div class="border-black">
            <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الثاني</h3>
            ${[
              [
                `<div class="flex justify-between w-full py-0.5 border-black">
                  <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[1]?.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[1]?.chassisNumber || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[1]?.axlesNumber || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[1]?.loadWeight || "---"}</span>
                </div>`,
                null,
              ],
            ].map(([content]) => content).join('')}
          </div>`,
          null
        ],

        // بيانات الملحق الثالث
        [
          `<div class="border-black">
            <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الثالث</h3>
            ${[
              [
                `<div class="flex justify-between w-full py-0.5 border-black">
                  <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[2]?.category || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[2]?.chassisNumber || "---"}</span>
                </div>`,
                null,
              ],
              [
                `<div class="flex justify-between w-full border-black">
                  <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[2]?.axlesNumber || "---"}</span>
                  <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${searchResults.trailers[2]?.loadWeight || "---"}</span>
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
              <div class="w-full max-w-100 h-auto p-0 dir="rtl"">
                ${searchResults.cropedCarImagePath
                  ? `<img src="http://localhost:5273${searchResults.cropedCarImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
                  : "صورة المركبة"}
              </div>
                <div class="w-full max-w-100 h-auto p-0" dir="rtl" >
                ${searchResults.cropedChassisImagePath
                  ? `<img src="http://localhost:5273${searchResults.cropedChassisImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
                  : "صورة الشاصي"}
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
    doc.close();
    
    setTimeout(() => {
      printFrame.contentWindow.print();
    }, 500);
  };

  return (
    <div>
      <button
          className="group bg-gradient-to-r from-blue-500 to-blue-600 
                    hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3
                    rounded-xl shadow-lg hover:shadow-xl transition-all 
                    flex items-center gap-3 transform hover:scale-105"
          onClick={handlePrint}
        >
          <PrinterIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
          <span className="text-md font-semibold">طباعة الاستمارة</span>
      </button>
      <iframe ref={printFrameRef} style={{ display: "none" }} />
    </div>
  );
};
export default TruckForm;
