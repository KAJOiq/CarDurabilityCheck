import React, { useState } from "react";
import { MagnifyingGlassIcon, PencilIcon } from "@heroicons/react/24/outline";
import SearchModalForPrint from "./SearchModalForPrint";
import SearchModalForForm from "./SearchModalForForm";
import CarForm from "./CarForm";
import TruckForm from "./TruckForm";
import BikeForm from "./BikeForm";
import EditFormModal from "./EditFormModal";
import fetchData from "../utils/fetchData";

const ShowForms = () => {
  const [isSearchModalForPrintOpen, setIsSearchModalForPrintOpen] = useState(false);
  const [isSearchModalForFormOpen, setIsSearchModalForFormOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState(null);
  const [trailerToEdit, setTrailerToEdit] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isSuperAdmin = localStorage.getItem("role") === "superadmin";
  const isAdmin = localStorage.getItem("role") === "admin";
  const isUser = localStorage.getItem("role") === "user";

  const handleSearch = (formData) => {
    setSearchResults(formData);
  };

  const formatArabicDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  const handleEditField = (label) => {
    if (label === "رقم الاستمارة" || label === "تاريخ الإصدار" || label === "المديرية" || label === "الموقع") return;
    setFieldToEdit(label);
    setIsEditModalOpen(true);
  };

  const handleEditTrailer = (trailerId) => {
    setFieldToEdit("المقطورات");
    setTrailerToEdit(trailerId);
    setIsEditModalOpen(true);
  };

  const searchTypes = {
    form: {
      label: "بحث عبر رقم الاستمارة",
      placeholder: "أدخل رقم الاستمارة",
      param: "applicationId",
    },
  };

  const handleReloadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const applicationId = searchResults?.applicationId;
      if (!applicationId) return;

      const paramKey = searchTypes.form.param;
      const url = `user/application/print-application?${paramKey}=${encodeURIComponent(applicationId)}`;

      const result = await fetchData(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (result.isSuccess) {
        setSearchResults(result.results);
      } else {
        throw new Error("فشل في استرجاع البيانات");
      }
    } catch (error) {
      setError(error.message || "فشل في إعادة تحميل البيانات، يرجى المحاولة مرة أخرى");
      console.error("Error reloading data:", error);
    } finally {
      setIsLoading(false);
    }
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
        {isUser && 
        <button
          className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 
                    text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all
                    flex items-center gap-3 transform hover:scale-105"
          onClick={() => {
            setSearchResults(null); 
            setIsSearchModalForFormOpen(true);
          }}
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-white/90 group-hover:text-white" />
          <span className="text-md font-semibold">إنشاء استمارة جديدة</span>
        </button>
        }
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
                </div>
              )}
              {searchResults?.vehicleType === "شاحنة" && (
                <div className="flex items-center gap-4">
                  <TruckForm searchResults={searchResults} />
                </div>
              )}
              {searchResults?.vehicleType === "دراجة" && (
                <div className="flex items-center gap-4">
                  <BikeForm searchResults={searchResults} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries({
                "رقم الاستمارة": searchResults.applicationId,
                "رقم استمارة المرور": searchResults.trafficPoliceApplicationId,
                "رقم وصل القبض": searchResults.governmental ? `حكومي ` : searchResults.receiptId,
                "اسم المواطن": searchResults.ownerFirstName + " " + searchResults.fatherName + " " + searchResults.grandFatherName + " " + searchResults.surename,
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
                "حكومي ؟": searchResults.governmental ? "نعم" : "لا",
                "تاريخ الإصدار": formatArabicDate(searchResults.issueDate),
                "المديرية": searchResults.agency,
                "الموقع": searchResults.location,
              }).map(([label, value]) => (
                <div key={label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                  <span className="block text-sm font-medium text-gray-500 mb-1">{label}</span>
                  <span className="block text-md font-semibold text-gray-800">{value}</span>
                  {label !== "رقم الاستمارة" && label !== "تاريخ الإصدار" && label !== "المديرية" && label !== "الموقع" && (
                    <button
                      onClick={() => handleEditField(label)}
                      className="absolute top-2 left-2 p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                      title="تعديل الحقل"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  )}
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
                  <div key={trailer.trailerId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
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
                    <button
                      onClick={() => handleEditTrailer(trailer.trailerId)}
                      className="absolute top-2 left-2 p-1 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                      title="تعديل المقطورة"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
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

          {/* Edit Modal */}
          <EditFormModal
            isOpen={isEditModalOpen}
            onClose={(reload) => {
              setIsEditModalOpen(false);
              setFieldToEdit(null);
              // setTrailerToEdit(null); 
              if (reload) handleReloadData();
            }}
            formData={searchResults}
            fieldToEdit={fieldToEdit}
            trailerToEdit={trailerToEdit} 
          />
        </div>
      )}
    </div>
  );
};

export default ShowForms;