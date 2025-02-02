import React from "react";
import fetchData from "../utils/fetchData";

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
    <div className="fixed -inset-full bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-right text-gray-800">
            خيارات البحث
          </h2>
        </div>

        {/* Radio Group */}
        <div className="space-y-3 mb-6">
          {Object.entries(searchTypes).map(([key, { label }]) => (
            <label 
              key={key}
              className={`flex items-center justify-end gap-3 p-3 rounded-lg cursor-pointer transition-colors
                ${selectedSearchType === key 
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"}`}
            >
              <span className="text-gray-700 text-sm">{label}</span>
              <input
                type="radio"
                value={key}
                checked={selectedSearchType === key}
                onChange={(e) => setSelectedSearchType(e.target.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     placeholder:text-gray-400"
            placeholder={searchTypes[selectedSearchType].placeholder}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-600 text-sm text-right">
            {error}
          </div>
        )}

        {/* Action Buttons */}
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
            onClick={handleSearch}
            className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 transition-colors
                     ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "جاري البحث..." : "بحث →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModalForPrint;
