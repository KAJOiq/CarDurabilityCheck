import React, { useRef, useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import imgStatic from "../assets/car1.png";
import imgStatic2 from "../assets/car2.png";

const CarForm = ({ formData, photo1, photo2 }) => {
  const [apiData, setApiData] = useState({
    inspectionFormNumber: "",
    date: "",
  });

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("ar-IQ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setApiData({
      inspectionFormNumber: "12345", // Replace with actual form number if necessary
      date: currentDate, // Setting current date
    });
  }, []);

  const handlePrint = () => {
    const logoBase64 = logo;
    const imgStaticBase64 = imgStatic;
    const imgStaticBase64_2 = imgStatic2;
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
              margin: 0;
              font-size: 9px;
              padding: 0 20px;
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
            img {
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
              margin-top: 30px;
            }
            .footer-photo-container img {
              margin: 0 15px;
            }
            .main-image {
              max-width: 65%;
              height: auto;
              margin-top: 15px;
              transform: translateY(-30px);
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
              flex-direction: column;
              gap: 20px;
            }
            .bottom-image {
              max-width: 160px;
              height: auto;
              margin-top: 15px;
              transform: translateY(-30px);
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
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                font-size: 9px;
              }
              .header {
                height: 150px;
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
                max-width: 200px;
              }
              .main-image {
                max-width: 55%;
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
              </div>
            </div>
          </div>
          <div class="footer-photo-container">
            <img src="${imgStaticBase64}" alt="Car Image" class="main-image" />
            <div class="right-images">
              <img src="${imgStaticBase64_2}" alt="Car Image Top" class="top-image" />
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

export default CarForm;
