import React, { useState } from "react";
import { MagnifyingGlassIcon, PencilIcon } from "@heroicons/react/24/outline";
import SearchModalForPrint from "./SearchModalForPrint";
import SearchModalForForm from "./SearchModalForForm";
import CarForm from "./CarForm";
import TruckForm from "./TruckForm";
import BikeForm from "./BikeForm";
import EditFormModal from "./EditFormModal";

const ShowForms = () => {
  const [isSearchModalForPrintOpen, setIsSearchModalForPrintOpen] = useState(false);
  const [isSearchModalForFormOpen, setIsSearchModalForFormOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 

  const handleSearch = (formData) => {
    setSearchResults(formData);
  };

  const formatArabicDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
      
      {/* Buttons for both functionalities */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-center mb-8">
        <button
          className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                    text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all
                    flex items-center gap-3 transform hover:scale-105"
          onClick={() => setIsSearchModalForPrintOpen(true)}
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
          <span className="text-md font-semibold">البحث عن استمارة لطباعتها</span>
        </button>

        <button
          className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                    text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all
                    flex items-center gap-3 transform hover:scale-105"
                    onClick={() => {
                      setSearchResults(null); // Clear previous form data
                      setIsSearchModalForFormOpen(true);
                    }}
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
          <span className="text-md font-semibold">إنشاء استمارة جديدة</span>
        </button>
      </div>
      
      {/* Modal for searching and printing forms */}
      <SearchModalForPrint
        isOpen={isSearchModalForPrintOpen}
        onClose={() => setIsSearchModalForPrintOpen(false)}
        onSearch={handleSearch}
      />

      {/* Modal for creating new forms */}
      <SearchModalForForm
        isOpen={isSearchModalForFormOpen}
        onClose={() => setIsSearchModalForFormOpen(false)}
        onSearch={handleSearch}
      />

      {/* Display the search results */}
      {searchResults && (
        <div className="space-y-8" dir="rtl">
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 shadow-lg">
            <h2 className="text-md font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-4">
              تفاصيل الاستمارة
            </h2>
            <div className="mt-4 py-4" dir="rtl">
              {searchResults?.vehicleType === "سيارة" && (
                <div className="flex items-center gap-4">
                  <CarForm searchResults={searchResults} />
                  <button
                    className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 
                              text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all
                              flex items-center gap-3 transform hover:scale-105"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <PencilIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
                    <span className="text-md font-semibold">تعديل الاستمارة</span>
                  </button>
                </div>
              )}
              {searchResults?.vehicleType === "شاحنة" && (
                <div className="flex items-center gap-4">
                  <TruckForm searchResults={searchResults} />
                  <button
                    className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 
                              text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all
                              flex items-center gap-3 transform hover:scale-105"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <PencilIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
                    <span className="text-md font-semibold">تعديل الاستمارة</span>
                  </button>
                </div>
              )}
              {searchResults?.vehicleType === "دراجة" && (
                <div className="flex items-center gap-4">
                  <BikeForm searchResults={searchResults} />
                  <button
                    className="group bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 
                              text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all
                              flex items-center gap-3 transform hover:scale-105"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <PencilIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
                    <span className="text-md font-semibold">تعديل الاستمارة</span>
                  </button>
                </div>
              )}
            </div>    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries({
                "رقم الاستمارة": searchResults.applicationId,
                "رقم استمارة المرور": searchResults.trafficPoliceApplicationId,
                "رقم الوصل": searchResults.receiptId || "---",
                "اسم المواطن": searchResults.ownerFirstName+" "+searchResults.fatherName+" "+searchResults.grandFatherName+" "+searchResults.surename,
                "نوع الاستمارة": searchResults.vehicleType,
                "نوع التسجيل": searchResults.usage,
                "الماركة": searchResults.carBrand,
                "الطراز": searchResults.carName,
                "اللون": searchResults.carColor,
                "الموديل": searchResults.carModel,
                "رقم اللوحة": searchResults.plateNumber,
                "رقم الشاصي": searchResults.chassisNumber,
                "نوع المحرك": searchResults.engineType,
                "عدد السلندر": searchResults.engineCylindersNumber,
                "عدد المحاور": searchResults.vehicleAxlesNumber,
                "عدد الركاب": searchResults.seatsNumber,
                //"الحمولة": searchResults.loadWeight,
                "الحكومية": searchResults.governmental ? "نعم" : "لا",
                //"الفئة": searchResults.category,
                "تاريخ الإصدار": formatArabicDate(searchResults.issueDate),
                "المديرية": searchResults.agency,
                "الموقع": searchResults.location,
              }).map(([label, value]) => (
                <div key={label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <span className="block text-sm font-medium text-gray-500 mb-1">{label}</span>
                  <span className="block text-md font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {searchResults.trailers?.length > 0 && (
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-md font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-4">
                تفاصيل المقطورات
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.trailers.map((trailer) => (
                  <div key={trailer.trailerId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries({
                        "رقم الشاصي": trailer.chassisNumber,
                        "عدد المحاور": trailer.axlesNumber,
                        "الحمولة": trailer.loadWeight,
                        "الفئة": trailer.category,
                      }).map(([label, value]) => (
                        <div key={label}>
                          <span className="block text-sm font-medium text-gray-500">{label}</span>
                          <span className="block text-md font-semibold text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.cropedCarImagePath && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">صورة المركبة</h3>
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={`http://localhost:5273${searchResults.cropedCarImagePath}`}
                    alt="Car"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}

            {searchResults.cropedChassisImagePath && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">صورة الشاصي</h3>
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={`http://localhost:5273${searchResults.cropedChassisImagePath}`}
                    alt="Chassis"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                  />
                </div>
              </div>
            )}
          </div>
          {/*Edit button*/}
          <EditFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            formData={{
              ...searchResults,
              TrailerData: searchResults.trailers || [], // تأكد من تمرير بيانات المقطورات
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ShowForms;
