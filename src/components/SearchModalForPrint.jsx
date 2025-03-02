import React from "react";
import fetchData from "../utils/fetchData";
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const SearchModalForPrint = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSearchType, setSelectedSearchType] = React.useState("chassis");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [searchResult, setSearchResult] = React.useState(null);

  if (!isOpen) return null;

  const searchTypes = {
    chassis: {
      label: "بحث عبر رقم الشاصي",
      placeholder: "أدخل رقم الشاصي",
      param: "chassisNumber"
    },
    form: {
      label: "بحث عبر رقم الاستمارة",
      placeholder: "أدخل رقم الاستمارة",
      param: "applicationId"
    },
    citizen: {
      label: "بحث عبر رقم الوصل",
      placeholder: "أدخل رقم الوصل",
      param: "ReceiptId"
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const paramKey = searchTypes[selectedSearchType].param;
      const url = `user/application/print-application?${paramKey}=${encodeURIComponent(searchTerm)}`;

      const response = await fetchData(url);
      
      if (response.isSuccess) {
        setSearchResult(response.results);
        onSearch(response.results);
        onClose();
      } else {
        throw new Error("فشل في استرجاع البيانات");
      }
    } catch (error) {
      setError(error.message || "فشل البحث، يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[1000]">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200/70">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              خيارات البحث
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <XMarkIcon className="w-7 h-7 text-gray-500 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
  
          {/* Radio Group */}
          <div className="space-y-3 mb-6">
            {Object.entries(searchTypes).map(([key, { label }]) => (
              <label 
                key={key}
                className={`flex items-center justify-end gap-3 p-3.5 rounded-xl cursor-pointer
                  transition-all transform ${selectedSearchType === key 
                    ? "bg-gradient-to-l from-blue-50/80 to-cyan-50/80 border-2 border-blue-400 shadow-sm"
                    : "border border-gray-200 hover:border-blue-200 hover:translate-x-1"}`}
              >
                <span className="text-gray-700 font-medium text-base">{label}</span>
                <input
                  type="radio"
                  value={key}
                  checked={selectedSearchType === key}
                  onChange={(e) => setSelectedSearchType(e.target.value)}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 checked:border-blue-600 focus:ring-0"
                />
              </label>
            ))}
          </div>
  
          {/* Search Input */}
          <div className="mb-6 relative group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-5 pl-14 py-4 border-2 border-gray-200 rounded-xl text-right
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50
                       placeholder:text-gray-400 text-base font-medium shadow-sm
                       transition-all duration-200 group-hover:border-blue-300"
              placeholder={searchTypes[selectedSearchType].placeholder}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-blue-100 rounded-lg">
              <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
  
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3.5 bg-red-50/80 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-3 animate-pulse">
              <XMarkIcon className="w-5 h-5 flex-shrink-0 text-red-500" />
              <span className="flex-1">{error}</span>
            </div>
          )}
  
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-7 py-3.5 text-gray-600 rounded-xl font-medium
                       hover:bg-gray-50/80 transition-all border-2 border-gray-200
                       hover:border-gray-300 hover:shadow-sm"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              onClick={handleSearch}
              className={`px-7 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium
                       hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md
                       flex items-center gap-2.5 ${isLoading ? "opacity-90 cursor-progress" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  <span>بحث</span>
                  <MagnifyingGlassIcon className="w-5 h-5 text-white/90" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
  );
};

export default SearchModalForPrint;
