import React, { useState, useEffect } from "react";
import CarForm from "./CarForm";
import TruckForm from "./TruckForm";
import BikeForm from "./BikeForm";

const ViewData = ({ formData }) => {  
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
      {/* عرض البيانات هنا */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <dt className="font-bold w-1/2 text-right">نوع الاستمارة:</dt>
          <dd className="w-1/2">{formData.formType}</dd>
        </div>
        {/* ... باقي الحقول ... */}
      </dl>
    </div>
  );
};

export default ViewData;
