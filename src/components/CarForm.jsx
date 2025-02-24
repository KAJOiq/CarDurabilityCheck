import React, { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import QRCode from "qrcode"; 
import imgStatic from "../assets/car.jpeg";
const CarForm = ({ searchResults }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    if (!searchResults) return;

    const qrData = JSON.stringify({
      ADDID: searchResults.applicationId, 
      ISSD: searchResults.issueDate, 
      TFPN: searchResults.trafficPoliceApplicationId,
      RID: searchResults.receiptId, 
      CON: searchResults.carOwnerName, 
      IG: searchResults.governmental, 
      CN: searchResults.chassisNumber, 
      PN: searchResults.plateNumber, 
      CYC: searchResults.engineCylindersNumber, 
      VAXN: searchResults.vehicleAxlesNumber,
      COM: searchResults.carModel,  
      SEAN: searchResults.seatsNumber,
      VN: searchResults.carName,
      VC: searchResults.carColor,
      VB: searchResults.carBrand,
      VT: searchResults.vehicleType, 
      USE: searchResults.usage,
      AGN: searchResults.agency, 
      LN: searchResults.location,
      VID: searchResults.vehicleID,
      ENT: searchResults.engineType, 
      IIC: searchResults.isInspectionCertified,
      SN: searchResults.stickerNumber,
      SP: searchResults.stickerProvider,
    });

    QRCode.toDataURL(qrData)
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
              <span>: ${searchResults.applicationId}-${searchResults.applicationId}</span>
              <span>: ${searchResults.receiptId}</span>
              <span>: ${searchResults.receiptId}</span>
              <span>: ${formatDate(searchResults.issueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Data Section -->
      <div class="border border-black rounded-lg p-1 mt-2">
        <h3 class="bg-gray-200 text-center font-bold py-1">بيانات المركبة</h3>
        <div class="grid grid-cols-2 gap-2 text-md">
          ${[
            ["اسم المالك", searchResults.carOwnerName],
            ["نوع المركبة", searchResults.carBrand],
            ["طراز المركبة", searchResults.carName],
            ["لون المركبة", searchResults.carColor],
            ["رقم المركبة", searchResults.plateNumber],
            ["رقم الشاصي", searchResults.chassisNumber],
            ["الموديل", searchResults.carModel],
            ["نوع المحرك", searchResults.engineType],
            ["عدد السلندر", searchResults.engineCylindersNumber],
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
      <div class="border border-black grid grid-cols-2 rounded-lg p-2" >
      <!-- Vehicle Image -->
        <div class="w-full max-w-100 h-auto p-0 dir="ltr"">
             <img src="${imgStaticBase64}" class="object-contain w-full h-full rounded-md p-0.5 border border-white" />
          </div>
         <div class="border border-white grid grid-rows-2 rounded-lg p-2" >
          <div class="w-full max-w-100 h-auto p-0" dir="rtl" >
            ${searchResults.cropedChassisImagePath
              ? `<img src="http://localhost:5273${searchResults.cropedChassisImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
              : "صورة الشاصي"}
             </div>  
             <div class="w-full max-w-100 h-auto p-0 dir="rtl"">
            ${searchResults.cropedCarImagePath
              ? `<img src="http://localhost:5273${searchResults.cropedCarImagePath}" class="object-contain w-full h-full rounded-md p-0.5 border border-black" />`
              : "صورة المركبة"}
          </div>
         
          </div>
 <div class="border border-black  rounded-lg p-2 min-h-40" >
      <span class="font-bold text-md text-center w-1/3">الفاحص : 
      </span> 
        </div>
        <div class="border border-black  rounded-lg p-2 min-h-40" >
       <span class="font-bold text-md text-center w-1/3">الفاحص :</span> 
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
    <div>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600"
        onClick={handlePrint}
      >
        طباعة الاستمارة
      </button>
    </div>
  );
};

export default CarForm;