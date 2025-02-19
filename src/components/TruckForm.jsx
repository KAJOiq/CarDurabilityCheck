import React, { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import imgStatic from "../assets/truck.png";
import QRCode from "qrcode"; // Import QRCode component


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
  
  
  const handlePrint = () => {
    if (!searchResults) return;
    const logoBase64 = logo;
    const imgStaticBase64 = imgStatic;
    const printWindow = window.open("_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طباعة الاستمارة</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              direction: rtl;
              text-align: right;
              margin: 0;
              font-size: 9px;
              padding: 0 5px;
            }
            h2 {
              text-align: center;
              font-size: 12px;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .field {
              margin-bottom: 6px;
              padding: 6px;
              border-radius: 6px;
            }
            .img {
              max-width: 90%;
              height: auto;
              margin-top: 10px;
              display: block;
              margin-left: auto;
              margin-right: auto;
            }
            .header {
              position: relative;
              width: 100%;
              height: 140px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo-container {
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              text-align: center;
            }
            .logo-container img {
              max-width: 100px;
            }
            .title-container {
              position: absolute;
              top: 20px;
              right: 15px;
              text-align: right;
            }
            .title-container .title {
              font-size: 24px;
              font-weight: bold;
            }
            .title-container .subtitle {
              font-size: 18px;
              font-weight: bold;
            }
            .form-data,
            .vehicle-data {
              padding: 8px;
              border-radius: 6px;
              margin-bottom: 12px;
              background-color: #f4f7fb;
              border: 1px solid #ccc;
              box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
            }
            .form-data h3,
            .vehicle-data h3 {
              margin-bottom: 6px;
              background-color: #e5e7eb;
              padding: 6px;
              border-radius: 4px;
              font-size: 16px;
              font-weight: bold;
              color: #333;
            }
            .form-data h3 strong,
            .vehicle-data h3 strong {
              font-size: 22px;
              font-weight: bold;
            }
            .form-data .info-container,
            .vehicle-data .info-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
            }
            .info {
              width: 48%;
              margin-bottom: 6px;
            }
            .info strong {
              font-size: 16px;
              font-weight: bold;
              color: rgb(0, 0, 0);
            }
            .footer-photo-container {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 8px;
            }
            .footer-photo-container img {
              margin: 0 10px;
            }
            .main-image {
              max-width: 65%;
              height: auto;
              margin-top: 15px;
              transform: translateX(-160px);
            }
            .bottom-images {
              display: flex;
              flex-direction: Row;
              gap: 20px;
              transform: translateX(300px);
            }
            .bottom-image {
              max-width: 160px;
              height: auto;
              margin-top: 15px;
              transform: translateY(255px);
            }
            .footer-text {
              display: flex;
              justify-content: space-between;
              width: 100%;
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
              font-weight: bold;
            }
            .footer-text div {
              width: 23%;
            }
            .qr-code-container {
              position: absolute;
              left: 15px;
              top: 10px;
            }
            .qr-code-container img {
              max-width: 100px;
              height: auto;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                font-size: 9px;
              }
              .header {
                height: 110px;
              }
              .logo-container img {
                max-width: 100px;
              }
              .form-data h3, .vehicle-data h3 {
                font-size: 11px;
              }
              .info {
                font-size: 10px;
              }
              .info strong {
                font-size: 12px;
                color:rgb(0, 0, 0);
              }
              .bottom-image {
                max-width: 130px;
              }
              .main-image {
                max-width: 95%;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title-container">
              <div class="title"><strong>جمهورية العراق</strong></div>
              <div class="subtitle"><strong>وزارة الداخلية</strong></div>
            </div>
            <div class="logo-container">
              <img src="${logoBase64}" alt="Logo" />
            </div>
            <div class="qr-code-container">
              <img src="${qrCodeDataUrl}" alt="QR Code" width="120" />
            </div>
          </div>
          <hr />
          <div class="grid">
            <div class="vehicle-data">
              <h3><strong>بيانات المركبة</strong></h3>
              <div class="info-container">
                <div class="info"><strong>اسم المواطن:</strong> <div><strong>${searchResults.carOwnerName}</strong></div></div>
                <div class="info"><strong>نوع المركبة:</strong> <div><strong>${searchResults.carBrand}</strong></div></div>
                <div class="info"><strong>طراز المركبة:</strong> <div><strong>${searchResults.carName}</strong></div></div>
                <div class="info"><strong>لون المركبة:</strong> <div><strong>${searchResults.carColor}</strong></div></div>
                <div class="info"><strong>رقم المركبة:</strong> <div><strong>${searchResults.plateNumber}</strong></div></div>
                <div class="info"><strong>رقم الشاصي:</strong> <div><strong>${searchResults.chassisNumber}</strong></div></div>
                <div class="info"><strong>الموديل:</strong> <div><strong>${searchResults.carModel}</strong></div></div>
                <div class="info"><strong>نوع المحرك:</strong> <div><strong>${searchResults.engineType}</strong></div></div>
                <div class="info"><strong>عدد السلندر:</strong> <div><strong>${searchResults.engineCylindersNumber}</strong></div></div>
                <div class="info"><strong>عدد المحاور:</strong> <div><strong>${searchResults.engineCylindersNumber}</strong></div></div>
              </div>
            </div>
            <div class="form-data">
              <h3><strong>بيانات الاستمارة</strong></h3>
              <div class="info-container">
               <div class="info"><strong>رقم استمارة الفحص:</strong> <div><strong>${searchResults.applicationId}</strong></div></div>
                <div class="info"><strong>رقم استمارة المرور:</strong> <div><strong>${searchResults.trafficPoliceApplicationId}</strong></div></div>
                <div class="info"><strong>رقم وصل القبض:</strong> <div><strong>${searchResults.receiptId}</strong></div></div>
                <div class="info"><strong>نوع الاستمارة:</strong> <div><strong>${searchResults.vehicleType}</strong></div></div>
                <div class="info"><strong>التاريخ:</strong> <div><strong>${searchResults.issueDate}</strong></div></div>
                <div class="info"><strong>نوع الحمل:</strong> <div><strong>${searchResults.category}</strong></div></div>
              </div>
            </div>
          </div>
          <div class="footer-photo-container">
            <img src="${imgStaticBase64}" alt="Car Image" class="main-image" />
              <div class="bottom-images">
                <img src="http://localhost:5273${searchResults.cropedChassisImagePath}" alt="Captured Chassis" class="bottom-image" />
                <img src="http://localhost:5273${searchResults.cropedCarImagePath}" alt="Captured Front" class="bottom-image" />
              </div>
            </div>
          </div>
          <div class="footer-text">
            <div>الفاحص الاول</div>
            <div>الفاحص الثاني</div>
            <div>الفاحص الثالث</div>
            <div>ضابط الكشف الفني</div>
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
