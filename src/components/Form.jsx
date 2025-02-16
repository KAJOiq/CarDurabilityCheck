import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SearchModalForPrint from "./SearchModalForPrint";
import SearchModalForForm from "./SearchModalForForm";

const Form = ({ formType, setFormType }) => {
  const [isSearchModalForFormOpen, setIsSearchModalForFormOpen] = useState(false);
  const [isSearchModalForPrintOpen, setIsSearchModalForPrintOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null); // State to hold search results

  const handleSearch = (formData) => {
    setSearchResults(formData); // Store the search results in the state
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
        {/* Action Buttons */}
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

        {/* Modals */}
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

        {/* Display Search Results */}
        {searchResults && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-right" dir="rtl">
            {Object.entries({
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
              "عدد الركاب": searchResults.seatsNumber,
              "الحمولة": searchResults.loadWeight,
              "فئة المركبة": searchResults.category,
              "تاريخ الإصدار":  formatDate(searchResults.issueDate),
              "الموقع": searchResults.location,
              "صورة السيارة": searchResults.cropedCarImagePath,
            }).map(([label, value]) =>
              label === "صورة السيارة" ? (
                <div key={label} className="col-span-2 flex flex-row items-end">
                  <span className="font-semibold text-gray-600">{label}:</span>
                  <img
                    src={`http://localhost:5273${searchResults.cropedCarImagePath}`}
                    alt="Car Image"
                    className="w-48 mt-2 rounded-lg shadow-md border"
                  />
                  <span className="font-semibold text-gray-600">{label}:</span>
                  <img
                    src={`http://localhost:5273${searchResults.cropedCarImagePath}`}
                    alt="Car Image"
                    className="w-48 mt-2 rounded-lg shadow-md border"
                  />
                  <span className="font-semibold text-gray-600">{label}:</span>
                  <img
                    src={`http://localhost:5273${searchResults.cropedCarImagePath}`}
                    alt="Car Image"
                    className="w-48 mt-2 rounded-lg shadow-md border"
                  />
                </div>
              ) : (
                <div key={label} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="font-semibold text-gray-600">{label}:</span>
                  <span className="text-gray-800">{value || "---"}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
