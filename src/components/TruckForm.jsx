import React, { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import imgStatic from "../assets/Truck.png";
// import imgStatic2 from "../assets/car2.png";
import QRCode from "qrcode"; // Import QRCode component


const TruckForm = ({ formData, photo1, photo2 }) => {
  const [apiData, setApiData] = useState({
    inspectionFormNumber: "12345", // Replace with actual form number if necessary
    date: new Date().toLocaleDateString("ar-IQ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  });
  
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

    useEffect(() => {
      const qrData = JSON.stringify({
        customerName: formData.customerName,
        vehicleModel: formData.vehicleModel,
        vehicleType: formData.vehicleType,
        vehicleColor: formData.vehicleColor,
        vehicleNumber: formData.vehicleNumber,
        isGovernment: formData.isGovernment,
        chassisNumber: formData.chassisNumber,
        repeatReason: formData.repeatReason,
        model: formData.model,
        cylinderCount: formData.cylinderCount,
        receiptNumber: formData.receiptNumber,
        trafficFormNumber: formData.trafficFormNumber,
        formType: formData.formType,
        inspectionFormNumber: apiData.inspectionFormNumber,
        date: apiData.date,
        load: formData.load, // Truck-specific
        attachedLoadType: formData.attachedLoadType, // Truck-specific
        attachedChassis: formData.attachedChassis, // Truck-specific
        numberOfAttachedVehicles: formData.numberOfAttachedVehicles, // Truck-specific
        numberOfAxes: formData.numberOfAxes, // Truck-specific
      });
  
      QRCode.toDataURL(qrData)
        .then((url) => {
          if (url !== qrCodeDataUrl) {
            setQrCodeDataUrl(url); // Set the QR code URL only if it has changed
          }
        })
        .catch((error) => console.error("Error generating QR code:", error));
    }, [formData, apiData.inspectionFormNumber, apiData.date]); // Keep dependencies minimal and specific
  
  
  const handlePrint = () => {
    const logoBase64 = logo;
    const imgStaticBase64 = imgStatic;
    // const imgStaticBase64_2 = imgStatic2;
    const printWindow = window.open("_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>طباعة الاستمارة</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              direction: rtl;
              text-align: right;
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
              margin-bottom: 1px;
              padding: 6px;
              border-radius: 6px;
            }
            img {
              max-width: 100%;
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
            }
            .footer-photo-container img {
              margin: 1 30px;
            }
            .main-image {
              max-width: 50%;
              height: auto;
              margin-top: 30px;
              transform: translateX(-175px);
            }
            .right-images {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            }
            .top-image {
              max-width: 200px;
              margin-top: 15px;
              transform: translateY(-40px);
            }
            .bottom-images {
              display: flex;
              height: auto;
              flex-direction: Row;
              transform: translateX(250px);
            }
            .bottom-image {
              max-width: 160px;
              transform: translateY(237px);
            }
            .footer-text {
              display: flex;
              justify-content: space-between;
              width: 100%;
              margin-top: 65px;
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
                height: 120px;
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
              .top-image, .bottom-image {
                max-width: 120px;
              }
              .main-image {
                max-width: 90%;
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
            <div class="form-data">
              <h3><strong>بيانات الاستمارة</strong></h3>
              <div class="info-container">
                <div class="info"><strong>رقم استمارة الفحص:</strong> <div>${apiData.inspectionFormNumber}</div></div>
                <div class="info"><strong>رقم استمارة المرور:</strong> <div>${formData.trafficFormNumber}</div></div>
                <div class="info"><strong>رقم وصل القبض:</strong> <div>${formData.receiptNumber}</div></div>
                <div class="info"><strong>نوع الاستمارة:</strong> <div>${formData.formType}</div></div>
                <div class="info"><strong>التاريخ:</strong> <div>${apiData.date}</div></div>
              </div>
            </div>
            <div class="vehicle-data">
              <h3><strong>بيانات المركبة</strong></h3>
              <div class="info-container">
                <div class="info"><strong>اسم المواطن:</strong> <div>${formData.customerName}</div></div>
                <div class="info"><strong>نوع المركبة:</strong> <div>${formData.vehicleType}</div></div>
                <div class="info"><strong>طراز المركبة:</strong> <div>${formData.vehicleModel}</div></div>
                <div class="info"><strong>لون المركبة:</strong> <div>${formData.vehicleColor}</div></div>
                <div class="info"><strong>رقم المركبة:</strong> <div>${formData.vehicleNumber}</div></div>
                <div class="info"><strong>رقم الشاصي:</strong> <div>${formData.chassisNumber}</div></div>
                ${formData.isRepeated ? `<div class="info"><strong>سبب التكرار:</strong> <div>${formData.repeatReason}</div></div>` : ''}
                <div class="info"><strong>الموديل:</strong> <div>${formData.model}</div></div>
                <div class="info"><strong>عدد السلندر:</strong> <div>${formData.cylinderCount}</div></div>
                <div class="info"><strong>الحمولة:</strong> <div>${formData.load}</div></div>
                <div class="info"><strong>نوع الحمولة المرفقة:</strong> <div>${formData.attachedLoadType}</div></div>
                <div class="info"><strong>الشاصي المرفق:</strong> <div>${formData.attachedChassis}</div></div>
                <div class="info"><strong>عدد المركبات المرفقة:</strong> <div>${formData.numberOfAttachedVehicles}</div></div>
                <div class="info"><strong>عدد المحاور:</strong> <div>${formData.numberOfAxes}</div></div>
              </div>
            </div>
          </div>
          <div class="footer-photo-container">
            <img src="${imgStaticBase64}" alt="Car Image" class="main-image" />
              <div class="bottom-images">
                <img src="${photo1}" alt="Captured Chassis" class="bottom-image" />
                <img src="${photo2}" alt="Captured Front" class="bottom-image" />
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
    printWindow.print();
  };


  return (
    <div>
      <button
 
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
        onClick={handlePrint}
      >
        طباعة الاستمارة
      </button>

    </div>
  );
};

export default TruckForm;
