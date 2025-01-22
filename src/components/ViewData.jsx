import React, { useRef, useState, useEffect } from "react";
import CarForm from "./CarForm";
import TruckForm from "./TruckForm";
import BikeForm from "./BikeForm";

const ViewData = () => {
  const [formData, setFormData] = useState(null);
  
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  if (!formData) {
    return (
      <p className="text-center text-lg text-gray-500 mt-10" dir="rtl">
        لا توجد بيانات متاحة.
      </p>
    );
  }

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-5xl mx-auto mt-10" dir="rtl">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
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

      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">نوع الاستمارة:</dt>
          <dd className="w-1/2">{formData.formType}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">رقم استمارة المرور:</dt>
          <dd className="w-1/2">{formData.trafficFormNumber}</dd>
        </div>
        {!formData.isGovernment && (
          <div className="flex justify-end">
            <dt className="font-bold w-1/2 text-right">رقم وصل القبض:</dt>
            <dd className="w-1/2">{formData.receiptNumber}</dd>
          </div>
        )}
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">اسم المواطن:</dt>
          <dd className="w-1/2">{formData.customerName}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">نوع المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleType}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">طراز المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleModel}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">رقم المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleNumber}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">لون المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleColor}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">فئة المركبة:</dt>
          <dd className="w-1/2">{formData.vehicleCategory}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">رقم الشاصي:</dt>
          <dd className="w-1/2">{formData.chassisNumber}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">الموديل:</dt>
          <dd className="w-1/2">{formData.model}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">عدد الركاب:</dt>
          <dd className="w-1/2">{formData.numberOfPassengers}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">عدد السلندر:</dt>
          <dd className="w-1/2">{formData.cylinderCount}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">عدد المحاور:</dt>
          <dd className="w-1/2">{formData.numberOfAxes}</dd>
        </div>
        {formData.formType === "شاحنة" && (
          <>
            <div className="flex justify-end">
              <dt className="font-bold w-1/2 text-right">الحمولة:</dt>
              <dd className="w-1/2">{formData.load}</dd>
            </div>
            <div className="flex justify-end">
              <dt className="font-bold w-1/2 text-right">نوع الحمولة المرفقة:</dt>
              <dd className="w-1/2">{formData.attachedLoadType}</dd>
            </div>
            <div className="flex justify-end">
              <dt className="font-bold w-1/2 text-right">شاصي الحمولة المرفقة:</dt>
              <dd className="w-1/2">{formData.attachedChassis}</dd>
            </div>
            <div className="flex justify-end">
              <dt className="font-bold w-1/2 text-right">عدد المركبات المرفقة:</dt>
              <dd className="w-1/2">{formData.numberOfAttachedVehicles}</dd>
            </div>
          </>
        )}
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">حكومي؟:</dt>
          <dd className="w-1/2">{formData.isGovernment ? "نعم" : "لا"}</dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">مكرر:</dt>
          <dd className="w-1/2">{formData.isRepeated ? "نعم" : "لا"}</dd>
        </div>
        {formData.isRepeated && (
          <div className="flex justify-end">
            <dt className="font-bold w-1/2 text-right">سبب التكرار:</dt>
            <dd className="w-1/2">{formData.repeatReason}</dd>
          </div>
        )}
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">صورة الشاصي:</dt>
          <dd className="w-1/2">
            {formData.photo1 && (
              <img src={formData.photo1} alt="Photo 1" className="w-32 h-32 object-cover" />
            )}
          </dd>
        </div>
        <div className="flex justify-end">
          <dt className="font-bold w-1/2 text-right">صورة مقدمة السيارة:</dt>
          <dd className="w-1/2">
            {formData.photo2 && (
              <img src={formData.photo2} alt="Photo 2" className="w-32 h-32 object-cover" />
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default ViewData;
