import React, { useState, useEffect } from "react";
import fetchData from "../../utils/fetchData";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Select from "react-select";

const AddVehiclePopup = ({ onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    BrandName: "",
    CarName: "",
    TypeId: "1",
  });
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetchData("admin/lookup/find-vehicle-company?brandName=&page=0&pageSize=5000");
      if (response.isSuccess && Array.isArray(response.results.result)) {
        setBrands(response.results.result);
      } else {
        setError("حدث خطأ في تحميل الماركات");
      }
    } catch (err) {
      setError("انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.BrandName || !form.CarName) {
      setError("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("BrandName", form.BrandName);
      formData.append("CarName", form.CarName);
      if (form.TypeId) formData.append("TypeId", form.TypeId);

      const response = await fetchData("lookup/add-new-vehicle", {
        method: "POST",
        body: formData,
      });

      if (response.isSuccess) {
        setSuccess(response.results);
        refreshData();
        fetchBrands();
        setForm({ BrandName: "", CarName: "", TypeId: "1" });
        setNewBrand(""); 
      } else {
        setError(response.errors?.length
          ? response.errors.map((err, index) => (
              <div key={index}>{err.message || "حدث خطأ أثناء الحفظ"}</div>
            ))
          : "حدث خطأ أثناء الحفظ"
        );
      }
    } catch (err) {
      setError("انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleBrandInputChange = (e) => {
    const value = e.target.value;
    setNewBrand(value);
    const existingBrand = brands.find((brand) => brand.name === value);
    setForm((prev) => ({ ...prev, BrandName: existingBrand ? existingBrand.name : value }));
  };

  const handleDropdownChange = (selectedOption) => {
    setNewBrand(selectedOption ? selectedOption.value : "");
    setForm((prev) => ({ ...prev, BrandName: selectedOption ? selectedOption.value : "" }));
  };

  const handleTypeChange = (selectedOption) => {
    setForm((prev) => ({
      ...prev,
      TypeId: selectedOption ? selectedOption.value : "1",
    }));
  };

  const brandOptions = [
    { value: "", label: "اختر ماركة" },
    ...brands.map((brand) => ({
      value: brand.name,
      label: brand.name,
    })),
  ];

  const typeOptions = [
    { value: "1", label: "سيارة/دراجة" },
    { value: "2", label: "شاحنة" },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">إضافة مركبة جديدة</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الماركة</label>
              <div className="relative">
                <Select
                  options={brandOptions}
                  value={brandOptions.find((option) => option.value === form.BrandName)}
                  onChange={handleDropdownChange}
                  className="w-full"
                  placeholder="اختر ماركة"
                />
                <input
                  type="text"
                  value={newBrand}
                  onChange={handleBrandInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 mt-2"
                  placeholder="أضف ماركة جديدة أو اختر من القائمة"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المركبة</label>
              <input
                type="text"
                name="CarName"
                value={form.CarName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع المركبة</label>
              <Select
                options={typeOptions}
                value={typeOptions.find((option) => option.value === form.TypeId) || typeOptions[0]}
                onChange={handleTypeChange}
                className="w-full"
                placeholder="اختر نوع المركبة"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            إغلاق
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>

        {/* Status Messages */}
        {(success || error) && (
          <div className={`p-4 ${success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            <div className="flex items-center gap-2">
              {success ? (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  {success}
                </>
              ) : (
                <>
                  <XCircleIcon className="w-5 h-5" />
                  {Array.isArray(error) ? error : <div>{error}</div>}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVehiclePopup;
