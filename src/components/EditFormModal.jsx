// EditFormModal.jsx
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import InputField from "./InputField";
import fetchData from "../utils/fetchData";

const FIELD_MAPPING = {
  "رقم الاستمارة": "applicationID",
  "رقم استمارة المرور": "trafficPoliceApplicationId",
  "رقم وصل القبض": "receiptId",
  "اسم المواطن": "surename",
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

  useEffect(() => {
    if (fieldToEdit && initialFormData) {
      const actualField = FIELD_MAPPING[fieldToEdit];
      if (actualField) {
        setEditedValue(initialFormData[actualField] || "");
      }
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
        formData.append(actualField, editedValue);
      }

          // عرض البيانات المرسلة في الكونسول
        console.log("=== البيانات المرسلة ===");
        for (let [key, value] of formData.entries()) {
          console.log(key, ":", value);
        }
        console.log("=========================");

      const result = await fetchData('user/application/repeat-application', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!result.isSuccess) {
        const errorMessages = result.errors?.map(error => error.message) || ['حدث خطأ غير متوقع'];
        setFormErrors(errorMessages);
        return;
      }
      console.log
      onClose(true); 
    } catch (error) {
      console.error('Error:', error);
      setFormErrors([`فشل في الاتصال بالخادم: ${error.message}`]);
    } finally {
      setIsSubmitting(false);
    }
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

            <InputField
              label={fieldToEdit}
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              required
            />
          </div>

          <div className="p-6 border-t flex justify-end bg-white">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 hover:bg-green-600 transition-all"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'حفظ التعديل'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditFormModal;