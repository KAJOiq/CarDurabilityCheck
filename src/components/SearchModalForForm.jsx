import React from "react";
import fetchData from "../utils/fetchData";
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

const SearchModalForForm = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSearchType, setSelectedSearchType] = React.useState("chassis");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (!isOpen) return null;

  const searchTypes = {
    chassis: {
      label: "بحث برقم الشاصي",
      placeholder: "أدخل رقم الشاصي",
      param: "chassisNumber"
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
        const { endpoint } = searchTypes[selectedSearchType];
        const searchParam = {
          chassis: "chassisNumber"
        }[selectedSearchType];
  
        const url = `${endpoint}?${searchParam}=${encodeURIComponent(searchTerm)}`;
        
        const data = await fetchData(url);
        
        onSearch(data);
        onClose();
      } catch (error) {
        setError(error.message || "فشل البحث، يرجى المحاولة مرة أخرى");
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-right text-gray-800">
            البحث برقم الشاصي
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSearch}>
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       placeholder:text-gray-400"
              placeholder="أدخل رقم الشاصي"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm text-right">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 rounded-lg font-medium
                       hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 transition-colors
                       ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "جاري البحث..." : "بحث →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchModalForForm;
