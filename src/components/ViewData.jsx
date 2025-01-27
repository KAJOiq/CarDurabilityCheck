import React, { useRef, useState, useEffect } from "react";
import CarForm from "./CarForm";
import TruckForm from "./TruckForm";
import BikeForm from "./BikeForm";
import CertificatesForm from "./CertificatesForm";

const ViewData = () => {
  const [formData, setFormData] = useState(null);
  
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    localStorage.removeItem("formData");
  }, []);

  if (!formData) {
    return (
      <p className="text-center text-lg text-gray-500 mt-10" dir="rtl">
        لا توجد بيانات متاحة.
      </p>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-300 p-10 rounded-lg shadow-xl w-full max-w-7xl mx-auto mt-10" dir="rtl">
      
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        عرض بيانات الاستمارة
      </h1>
      {formData.formType === "سيارة" && (
        <CarForm formData={formData} />
      )}
      {formData.formType === "شاحنة" && (
        <TruckForm formData={formData} />
      )}
      {formData.formType === "دراجة" && (
        <BikeForm formData={formData} />
      )}

      <hr className="my-8 border-gray-300" />
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">نوع الاستمارة:</dt>
          <dd className="w-1/2">{formData.formType}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">رقم استمارة المرور:</dt>
          <dd className="w-1/2">{formData.trafficFormNumber}</dd>
        </div>
        {!formData.isGovernment && (
          <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <dt className="font-bold w-1/2 text-right">رقم وصل القبض:</dt>
            <dd className="w-1/2">{formData.receiptNumber}</dd>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">اسم المواطن:</dt>
          <dd className="w-1/2">{formData.customerName}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">نوع المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleType}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">طراز المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleModel}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">رقم المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleNumber}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">لون المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleColor}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">فئة المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleCategory}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">رقم الشاصي:</dt>
          <dd className="w-1/2">{formData.chassisNumber}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">الموديل:</dt>
          <dd className="w-1/2">{formData.model}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">عدد الركاب:</dt>
          <dd className="w-1/2">{formData.numberOfPassengers}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">عدد السلندر:</dt>
          <dd className="w-1/2">{formData.cylinderCount}</dd>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">عدد المحاور:</dt>
          <dd className="w-1/2">{formData.numberOfAxes}</dd>
        </div>
        {formData.formType === "شاحنة" && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <dt className="font-bold w-1/2 text-right">الحمولة:</dt>
              <dd className="w-1/2">{formData.load}</dd>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <dt className="font-bold w-1/2 text-right">نوع الحمولة المرفقة:</dt>
              <dd className="w-1/2">{formData.attachedLoadType}</dd>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <dt className="font-bold w-1/2 text-right">شاصي الحمولة المرفقة:</dt>
              <dd className="w-1/2">{formData.attachedChassis}</dd>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <dt className="font-bold w-1/2 text-right">عدد المركبات المرفقة:</dt>
              <dd className="w-1/2">{formData.numberOfAttachedVehicles}</dd>
            </div>
          </>
        )}
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">حكومي؟:</dt>
          <dd className="w-1/2">{formData.isGovernment ? "نعم" : "لا"}</dd>
        </div>
{/*         <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">مكرر:</dt>
          <dd className="w-1/2">{formData.isRepeated ? "نعم" : "لا"}</dd>
        </div>
        {formData.isRepeated && (
          <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
            <dt className="font-bold w-1/2 text-right">سبب التكرار:</dt>
            <dd className="w-1/2">{formData.repeatReason}</dd>
          </div>
        )} */}
        <div className="row-span-1 lg:col-span-3 flex justify-center">
          <dt className="font-bold w-1/2 text-right">صورة الشاصي:</dt>
          <dd className="w-1/2">
            {formData.photo1 && (
              <img src={formData.photo1} alt="صورة الشاصي" className="w-full h-auto border rounded-2xl" />
            )}
          </dd>
        </div>
        <div className="row-span-1 lg:col-span-3 flex justify-center">
          <dt className="font-bold w-1/2 text-right">صورة مقدمة السيارة:</dt>
          <dd className="w-1/2">
            {formData.photo2 && (
              <img src={formData.photo2} alt="صورة مقدمة السيارة" className="w-full h-auto border rounded-2xl" />
            )}
          </dd>
        </div>
        <div className="row-span-1 lg:col-span-3 flex justify-center">
          <dt className="font-bold w-1/2 text-right">صورة وصل القبض:</dt>
          <dd className="w-1/2">
            {formData.photo3 && (
              <img src={formData.photo3} alt="صورة وصل القبض" className="w-full h-auto border rounded-2xl" />
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default ViewData;
