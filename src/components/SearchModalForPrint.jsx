import React from "react";
import fetchData from "../utils/fetchData";
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const SearchModalForPrint = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSearchType, setSelectedSearchType] = React.useState("chassis");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (!isOpen) return null;

  const searchTypes = {
    chassis: {
      label: "بحث برقم الشاصي",
      placeholder: "أدخل رقم الشاصي",
      endpoint: "vehicles/search"
    },

    form: {
      label: "بحث برقم الاستمارة",
      placeholder: "أدخل رقم الاستمارة",
      endpoint: "forms/search"
    },
    citizen: {
      label: "بحث بإسم المواطن",
      placeholder: "أدخل اسم المواطن",
      endpoint: "citizens/search"
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { endpoint } = searchTypes[selectedSearchType];
      const searchParam = {
        chassis: "chassisNumber",
        form: "formNumber",
        citizen: "name"
      }[selectedSearchType];

      const url = `${endpoint}?${searchParam}=${encodeURIComponent(searchTerm)}`;
      
      const data = await fetchData(url);
      
      onSearch(data); // Pass results to parent component
      onClose();
    } catch (error) {
      setError(error.message || "فشل البحث، يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 text-right">
            خيارات البحث
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Radio Group */}
        <div className="space-y-2 mb-6">
          {Object.entries(searchTypes).map(([key, { label }]) => (
            <label 
              key={key}
              className={`flex items-center justify-end gap-3 p-3 rounded-xl cursor-pointer
                transition-all ${selectedSearchType === key 
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "border border-gray-200 hover:border-blue-300"}`}
            >
              <span className="text-gray-700 font-medium">{label}</span>
              <input
                type="radio"
                value={key}
                checked={selectedSearchType === key}
                onChange={(e) => setSelectedSearchType(e.target.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>

        {/* Search Input */}
        <div className="mb-6 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-4 pl-12 py-3.5 border-2 border-gray-200 rounded-xl text-right
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                     placeholder:text-gray-400 text-sm font-medium"
            placeholder={searchTypes[selectedSearchType].placeholder}
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <XMarkIcon className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 rounded-xl font-medium
                     hover:bg-gray-50 transition-colors border border-gray-200"
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button
            onClick={handleSearch}
            className={`px-6 py-3 bg-blue-600 text-white rounded-xl font-medium
                     hover:bg-blue-700 transition-colors flex items-center gap-2
                     ${isLoading ? "opacity-80 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                جاري البحث...
              </>
            ) : (
              <>
                بحث
                <MagnifyingGlassIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModalForPrint;
