import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import InputField from "./InputField";
import DropDownListTemplate from "./DropDownListTemplate";
import Select from "react-select";
import fetchData from "../utils/fetchData";

const FIELD_MAPPING = {
  "رقم الاستمارة": "applicationId",
  "رقم استمارة المرور": "trafficPoliceApplicationId",
  "رقم وصل القبض": "receiptId",
  "اسم المواطن": "fullName",
  "نوع الاستمارة": "vehicleType",
  "نوع التسجيل": "usage",
  "الماركة": "carBrandId",
  "الطراز": "carNameId",
  "اللون": "carColorId",
  "الموديل": "carModel",
  "رقم اللوحة": "plateNumber",
  "رقم الشاصي": "chassisNumber",
  "نوع المحرك": "engineType",
  "عدد السلندر": "engineCylindersNumber",
  "عدد المحاور": "vehicleAxlesNumber",
  "عدد الركاب": "seatsNumber",
  "حكومي ؟": "governmental",
};

const EditFormModal = ({ isOpen, onClose, formData: initialFormData, fieldToEdit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [editedValue, setEditedValue] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    if (fieldToEdit && initialFormData) {
      const actualField = FIELD_MAPPING[fieldToEdit];
      if (actualField) {
        if (fieldToEdit === "اسم المواطن") {
          const fullName = `${initialFormData.ownerFirstName} ${initialFormData.fatherName} ${initialFormData.grandFatherName} ${initialFormData.surename}`;
          setEditedValue(fullName);
        } else {
          setEditedValue(initialFormData[actualField] || "");
        }
      }
    }
  
    if (initialFormData?.trailers) {
      setTrailers(initialFormData.trailers);
    } else {
      setTrailers([]);
    }
  }, [fieldToEdit, initialFormData]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setFormErrors([]);
  
      const formData = new FormData();
      const actualField = FIELD_MAPPING[fieldToEdit];
  
      formData.append("applicationId", initialFormData.applicationId || "");
  
      if (actualField) {
        if (fieldToEdit === "اسم المواطن") {
          const [CarOwnerName, fatherName, grandFatherName, surename] = editedValue.split(" ");
          formData.append("CarOwnerName", CarOwnerName);
          formData.append("fatherName", fatherName);
          formData.append("grandFatherName", grandFatherName);
          formData.append("surename", surename);
        } else {
          formData.append(actualField, editedValue);
        }
      }
  
      const updatedTrailerData = trailers.map((trailer) => ({
        TrailerId: trailer.trailerId || null, 
        TrailerChassisNumber: trailer.chassisNumber,
        TrailerAxlesNumber: trailer.axlesNumber,
        LoadWeight: trailer.loadWeight,
        Category: trailer.category,
      }));
  
      formData.append("UpdatedTrailerData", JSON.stringify(updatedTrailerData));
  
      const result = await fetchData("user/application/repeat-application", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
  
      if (!result.isSuccess) {
        const errorMessages = result.errors?.map((error) => error.message) || ["حدث خطأ غير متوقع"];
        setFormErrors(errorMessages);
        return;
      }
      onClose(true);
    } catch (error) {
      console.error("Error:", error);
      setFormErrors([`فشل في الاتصال بالخادم: ${error.message}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const usageOptions = [
    { value: "اجرة", label: "أجرة" },
    { value: "خصوصي", label: "خصوصي" },
    { value: "حمل", label: "حمل" },
    { value: "زراعية", label: "زراعية" },
    { value: "انشائية", label: "إنشائية" },
    { value: "تخصصية", label: "تخصصية" },
    { value: "فحص مؤقت", label: "فحص مؤقت" },
    { value: "دراجة", label: "دراجة" },
  ];

  const vehicleTypeOptions = [
    { value: "سيارة", label: "سيارة" },
    { value: "شاحنة", label: "شاحنة" },
    { value: "دراجة", label: "دراجة" },
  ];

  const handleTrailerChange = (index, field, value) => {
    const updatedTrailers = [...trailers];
    updatedTrailers[index][field] = value;
    setTrailers(updatedTrailers);
  };

  const addTrailer = () => {
    setTrailers([...trailers, { trailerId: null, chassisNumber: "", axlesNumber: "", loadWeight: "", category: "" }]);
  };

  const removeTrailer = (index) => {
    const updatedTrailers = trailers.filter((_, i) => i !== index);
    setTrailers(updatedTrailers);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} dir="rtl" className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-lg" />
      <div className="fixed inset-0 flex items-center justify-center p-6">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center">
            <Dialog.Title className="text-2xl font-bold text-gray-800">
              تعديل {fieldToEdit}
            </Dialog.Title>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <XMarkIcon className="w-7 h-7 text-gray-600" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {formErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
                <ul className="list-disc pr-4">
                  {formErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="w-full text-lg h-48 mb-8">
              {fieldToEdit === "نوع الاستمارة" && (
                <Select
                  options={vehicleTypeOptions}
                  value={vehicleTypeOptions.find((option) => option.value === editedValue)}
                  onChange={(selectedOption) => {
                    setEditedValue(selectedOption.value);
                  }}
                  placeholder="اختر نوع الاستمارة"
                  isSearchable={false}
                  className="w-full text-lg"
                  classNamePrefix="select"
                />
              )}

              {fieldToEdit === "نوع التسجيل" && (
                <Select
                  options={usageOptions}
                  value={usageOptions.find((option) => option.value === editedValue)}
                  onChange={(selectedOption) => {
                    setEditedValue(selectedOption.value);
                  }}
                  placeholder="اختر نوع التسجيل"
                  isSearchable={false}
                  className="w-full text-lg"
                  classNamePrefix="select"
                />
              )}

              {fieldToEdit === "الماركة" && (
                <DropDownListTemplate
                  endpoint="find-vehicle-company"
                  queryParams={{ page: 0, pageSize: 5000 }}
                  labelKey="name"
                  valueKey="id"
                  onSelect={(item) => {
                    setEditedValue(item.id);
                    setSelectedBrandId(item.id);
                  }}
                  placeholder="اختر الماركة"
                />
              )}

              {fieldToEdit === "الطراز" && (
                <DropDownListTemplate
                  endpoint="find-vehicle-name"
                  queryParams={{ brandId: selectedBrandId, page: 0, pageSize: 5000 }}
                  labelKey="name"
                  valueKey="id"
                  onSelect={(item) => {
                    setEditedValue(item.id);
                  }}
                  placeholder="اختر الطراز"
                  disabled={!selectedBrandId}
                />
              )}

              {fieldToEdit === "اللون" && (
                <DropDownListTemplate
                  endpoint="find-vehicles-colors"
                  queryParams={{ page: 0, pageSize: 5000 }}
                  labelKey="color"
                  valueKey="id"
                  onSelect={(item) => {
                    setEditedValue(item.id);
                  }}
                  placeholder="اختر اللون"
                />
              )}

              {fieldToEdit === "المقطورات" && (
                <div className="space-y-4">
                  {trailers.map((trailer, index) => (
                    <div key={index} className="p-4 border rounded-lg shadow-sm">
                      <div className="space-y-2">
                        <InputField
                          label="رقم الشاصي"
                          value={trailer.chassisNumber}
                          onChange={(e) =>
                            handleTrailerChange(index, "chassisNumber", e.target.value)
                          }
                          required
                        />
                        <InputField
                          label="عدد المحاور"
                          value={trailer.axlesNumber}
                          onChange={(e) =>
                            handleTrailerChange(index, "axlesNumber", e.target.value)
                          }
                          required
                        />
                        <InputField
                          label="الحمولة"
                          value={trailer.loadWeight}
                          onChange={(e) =>
                            handleTrailerChange(index, "loadWeight", e.target.value)
                          }
                          required
                        />
                        <InputField
                          label="الفئة"
                          value={trailer.category}
                          onChange={(e) =>
                            handleTrailerChange(index, "category", e.target.value)
                          }
                          required
                        />
                        <button
                          onClick={() => removeTrailer(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          حذف المقطورة
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addTrailer}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    إضافة مقطورة جديدة
                  </button>
                </div>
              )}

              {!["الماركة", "الطراز", "اللون", "نوع التسجيل", "نوع الاستمارة", "المقطورات"].includes(
                fieldToEdit
              ) && (
                <InputField
                  label={fieldToEdit}
                  value={editedValue}
                  onChange={(e) => setEditedValue(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          <div className="p-6 border-t flex justify-end bg-white">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 hover:bg-green-600 transition-all"
            >
              {isSubmitting ? "جاري الإرسال..." : "حفظ التعديل"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditFormModal;