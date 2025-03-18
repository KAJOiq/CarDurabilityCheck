import React from "react";
import fetchData from "../../utils/fetchData";
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";  

const SearchModalForForm = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();  

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;
  
    setIsLoading(true);
    setError(null);
  
    try {
      const url = `user/application/find-vehicle?chassisNumber=${encodeURIComponent(searchTerm)}`;
      const data = await fetchData(url);
  
      if (data.isSuccess) {
        navigate("/create-form-version", { state: { vehicleData: data.results } });
        onClose();
      } else {
        const errorMap = {
          "400": "تأكد من رقم الشاصي، قد يكون هناك خطأ في الإدخال.",
          "404": "لم يتم العثور على المركبة في النظام.",
          "500": "خطأ داخلي في الخادم، يرجى المحاولة لاحقًا."
        };
  
        const errorCode = data.errors?.[0]?.code;
        const errorMessage = errorMap[errorCode] || "حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.";
  
        setError(errorMessage);
  
        if (errorCode !== "400") {
          navigate("/create-form", { state: { chassisNumber: searchTerm } });
        }
      }
    } catch (error) {
      setError("فشل الاتصال بالخادم، يرجى المحاولة لاحقًا");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-right text-gray-800">بحث عبر رقم الشاصي</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
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

          {error && <div className="mb-4 text-red-600 text-sm text-right">{error}</div>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                <>
                  بحث
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchModalForForm;