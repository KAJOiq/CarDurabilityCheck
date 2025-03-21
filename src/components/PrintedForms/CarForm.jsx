import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.jpg";
import QRCode from "qrcode";
import imgStatic from "../../assets/car.jpeg";
import { PrinterIcon } from "@heroicons/react/24/outline";

const CarForm = ({ searchResults }) => {
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
        <div class="flex flex-col items-center w-1/4 text-sm space-y-2">
          <h1 class="text-2xl font-bold text-black-800">جمهورية العراق</h1>
          <h1 class="text-xl font-bold text-black-800">وزارة الداخلية</h1>
        </div>

        <!-- Center QR and Logo -->
        <div class="relative flex items-center justify-center w-1/2">
          <div class="w-24 mb-2 absolute right-0 mr-4">
            <img src="${qrCodeDataUrl}" alt="QR Code" class="w-auto h-auto" />
          </div>
          <div class="mb-2 mx-auto absolute left-6 ml-10">
            <img src="${logo}" alt="Logo" class="w-24 h-auto" />
          </div>
        </div>

        <!-- Right-side Details -->
        <div class="flex flex-col items-start w-2/5 text-sm text-right font-semibold">
          <div class="grid grid-cols-2 w-full">
            <div class="flex flex-col text-black-800">
              <span>رقم استمارة الفحص</span> 
              <span>رقم وصل القبض</span>
              <span>اسم الموقع</span>
              <span>تاريخ الاصدار</span>
            </div>
            <div class="flex flex-col text-black-800 font-bold text-right">
              <span>: ${searchResults.location}-${searchResults.applicationId}</span>
              <span>: ${searchResults.governmental ? `حكومي ` : searchResults.receiptId}</span>
              <span>: ${searchResults.agency}</span>
              <span>: ${formatDate(searchResults.issueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Data Section -->
      <div class="border border-black rounded-lg p-1 mt-1">
        <h3 class="bg-gray-200 text-center font-bold py-0.5">بيانات المركبة</h3>
        <div class="grid grid-cols-2 gap-2 text-md">
          ${[
            ["اسم المالك", searchResults.ownerFirstName + " " + searchResults.fatherName + " " + searchResults.grandFatherName + " " + searchResults.surename],
            ["نوع المركبة", searchResults.carBrand],
            ["طراز المركبة", searchResults.carName],
            ["لون المركبة", searchResults.carColor],
            ["رقم المركبة", searchResults.plateNumber],
            ["رقم الشاصي", searchResults.chassisNumber],
            ["الموديل", searchResults.carModel],
            ["نوع المحرك", searchResults.engineType],
            ["عدد السلندر", searchResults.engineCylindersNumber],
            ["عدد المحاور", searchResults.vehicleAxlesNumber],
            ["عدد الركاب", searchResults.seatsNumber],
          ]
            .map(
              ([label, value]) =>
                `
                <div class="flex items-center py-0.5 border-black">
                  <span class="font-bold text-md w-1/3">${label} :</span>
                  <span class="font-bold text-md w-2/3 px-1 border border-black rounded">${value || "---"}</span>
                </div>
                `
            )
            .join("")}
        </div>
      </div>
      <div class="border border-black grid grid-cols-3 rounded-lg p-1">
        <!-- Vehicle Image Enlarged -->
          <div class="border border-white grid grid-cols-1 col-span-2 rounded-lg p-4 flex items-center justify-center">
            <div class="max-w-full h-auto p-0" dir="ltr">
              <img src="${imgStaticBase64}" class="object-contain w-full h-full rounded-md p-0.5 border border-white" />
            </div>
          </div>
        <div class="border border-white grid grid-rows-5 rounded-lg p-2">
        <div class="w-full max-w-56 h-auto p-0" dir="rtl">
            ${searchResults.cropedCarImagePath
              ? `<img src="http://localhost:5273${searchResults.cropedCarImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
              : "صورة المركبة"}
          </div>
          <div class="w-full max-w-56 h-auto p-0" dir="rtl">
            ${searchResults.cropedChassisImagePath
              ? `<img src="http://localhost:5273${searchResults.cropedChassisImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
              : "صورة الشاصي"}
          </div>
            <div class="border border-black rounded-lg p-2 min-h-35">
            <span class="font-bold text-md text-center w-1/3">الفاحص الأول :</span> 
          </div>
          <div class="border border-black rounded-lg p-2 min-h-35">
            <span class="font-bold text-md text-center w-1/3">الفاحص الثاني :</span> 
          </div>
          <div class="border border-black rounded-lg p-2 min-h-35">
            <span class="font-bold text-md text-center w-1/3">ضابط الكشف الفني :</span> 
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

export default CarForm;