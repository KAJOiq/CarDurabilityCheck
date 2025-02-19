import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SearchModalForPrint from "./SearchModalForPrint";
import SearchModalForForm from "./SearchModalForForm";
import CarForm from "./CarForm";
import TruckForm from "./TruckForm";
import BikeForm from "./BikeForm";

const Form = ({ vehicleType, setFormType }) => {
  const [isSearchModalForFormOpen, setIsSearchModalForFormOpen] = useState(false);
  const [isSearchModalForPrintOpen, setIsSearchModalForPrintOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (formData) => {
    setSearchResults(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        {/* أزرار البحث */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-end">
          <button
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl 
                      hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            onClick={() => setIsSearchModalForPrintOpen(true)}
          >
            <MagnifyingGlassIcon className="h-5 w-5 transform group-hover:scale-125 transition-transform" />
            <span className="text-lg">البحث عن استمارة لطباعتها</span>
          </button>

          <button
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl 
                      hover:from-green-600 hover:to-green-700 transition-all duration-300
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            onClick={() => setIsSearchModalForFormOpen(true)}
          >
            <MagnifyingGlassIcon className="h-5 w-5 transform group-hover:scale-125 transition-transform" />
            <span className="text-lg">إنشاء استمارة</span>
          </button>
        </div>

        <SearchModalForForm
          isOpen={isSearchModalForFormOpen}
          onClose={() => setIsSearchModalForFormOpen(false)}
          onSearch={handleSearch}
        />

        <SearchModalForPrint
          isOpen={isSearchModalForPrintOpen}
          onClose={() => setIsSearchModalForPrintOpen(false)}
          onSearch={handleSearch}
        />

        {/* عرض نتائج البحث */}
        {searchResults && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-right" dir="rtl">
            {Object.entries({
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

              
            }).map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <span className="font-semibold text-gray-600">{label}:</span>
                <span className="text-gray-800">{value || "---"}</span>
              </div>
            ))}

            {/* عرض صور المركبة */}
            {searchResults.cropedCarImagePath && (
              <div className="col-span-2">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-600 mb-3">صورة السيارة</h3>
                  <div className="flex justify-center">
                    <img
                      src={`http://localhost:5273${searchResults.cropedCarImagePath}`}
                      alt="Car"
                      className="w-64 h-48 object-contain rounded-lg shadow-md border-2 border-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {searchResults.cropedChassisImagePath && (
              <div className="col-span-2">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-600 mb-3">صورة الشاصي</h3>
                  <div className="flex justify-center">
                    <img
                      src={`http://localhost:5273${searchResults.cropedChassisImagePath}`}
                      alt="Chassis"
                      className="w-64 h-48 object-contain rounded-lg shadow-md border-2 border-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* تضمين النموذج المناسب بناءً على نوع المركبة */}
        {searchResults && searchResults.vehicleType === "سيارة" && <CarForm searchResults={searchResults} />}
        {searchResults && searchResults.vehicleType === "شاحنة" && <TruckForm searchResults={searchResults} />}
        {searchResults && searchResults.vehicleType === "دراجة نارية" && <BikeForm searchResults={searchResults} />}
      </div>
    </div>
  );
};

export default Form;
