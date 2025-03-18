import React, { useState, useEffect } from "react";
import fetchData from "../../utils/fetchData";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Select from "react-select"; // استيراد react-select

const AddLocationPopup = ({ onClose, refreshData }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  const [errorAgencies, setErrorAgencies] = useState(null);
  const [form, setForm] = useState({
    agencyId: "",
    locationName: ""
  });

  // Fetch agencies on component mount
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetchData("admin/lookup/find-traffic-agencies?agencyName=");

        if (response.isSuccess) {
          setAgencies(response.results.result);
        } else {
          setErrorAgencies("فشل في تحميل البيانات");
        }
      } catch (err) {
        setErrorAgencies("انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول");
      } finally {
        setLoadingAgencies(false);
      }
    };

    fetchAgencies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgencyChange = (selectedOption) => {
    setForm((prev) => ({ ...prev, agencyId: selectedOption ? selectedOption.value : "" }));
  };

  const handleSubmit = async () => {
    if (!form.agencyId || !form.locationName) {
      setError("الرجاء تعبئة جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("locationName", form.locationName);

      const response = await fetchData(
        `lookup/add-new-location?agencyId=${form.agencyId}`,
        {
          method: "POST",
          body: formData
        }
      );

      if (response.isSuccess) {
        setSuccess(response.results);
        refreshData();
        setForm({ agencyId: "", locationName: "" });
      } else {
        // معالجة الأخطاء بناءً على هيكلية الأخطاء المُعاد من الخادم
        if (response.errors && response.errors.length > 0) {
          setError(response.errors.map((err, index) => (
            <div key={index}>{err.message || "حدث خطأ أثناء الحفظ"}</div>
          )));
        } else {
          setError("حدث خطأ أثناء الحفظ");
        }
      }
    } catch (err) {
      setError("انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  // تحويل بيانات الوكالات لتنسيق يمكن استخدامه مع react-select
  const agencyOptions = [
    { value: "", label: "اختر المديرية" }, // خيار "عدم التحديد"
    ...agencies.map(agency => ({
      value: agency.id,
      label: agency.name
    }))
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">إضافة موقع جديد</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المديرية</label>
              <Select
                options={agencyOptions} // استخدام الخيارات المجهزة من بيانات الوكالات
                value={agencyOptions.find(option => option.value === form.agencyId)} // تحديد الخيار الحالي
                onChange={handleAgencyChange} // التعامل مع التغيير
                isDisabled={loadingAgencies} // تعطيل الاختيارات أثناء التحميل
                placeholder="اختر المديرية"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموقع</label>
              <input
                type="text"
                name="locationName"
                value={form.locationName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="أدخل اسم الموقع"
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

export default AddLocationPopup;
