import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { 
  XMarkIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  MagnifyingGlassIcon 
} from "@heroicons/react/24/outline";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import CameraComponent from "./CameraComponent";
import SearchModalForForm from "./SearchModalForForm";
import { useNavigate } from "react-router-dom";

const CreateForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  // const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  
  // States for photos
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  
  // Form data structure
  const [formData, setFormData] = useState({
    customerName: "",
    formType: "",
    vehicleType: "",
    vehicleModel: "",
    vehicleColor: "",
    chassisNumber: "",
    trafficFormNumber: "",
    receiptNumber: "",
    model: "",
    engineType: "",
    cylinderCount: "",
    numberOfAxes: "",
    seatsNumber: "",
    plateNumber: "",
    isGovernment: false,
    trailers: []
  });

  const steps = [
    { title: "المعلومات الأساسية", fields: ['customerName', 'formType'] },
    { title: "تفاصيل المركبة", fields: ['vehicleType', 'vehicleModel', 'vehicleColor'] },
    { title: "المواصفات الفنية", fields: ['engineType', 'cylinderCount', 'numberOfAxes'] },
    { title: "المستندات والصور", fields: ['photo1', 'photo2'] },
    { title: "المراجعة النهائية" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateStep = () => {
    const currentFields = steps[currentStep - 1].fields;
    const errors = [];
    
    currentFields.forEach(field => {
      if (!formData[field] && field !== 'photo3') {
        errors.push(`${getFieldLabel(field)} مطلوب`);
      }
    });
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const getFieldLabel = (field) => {
    const labels = {
      customerName: "اسم المواطن",
      formType: "نوع الاستمارة",
      vehicleType: "نوع المركبة",
      vehicleModel: "طراز المركبة",
      vehicleColor: "لون المركبة",
      chassisNumber: "رقم الشاصي",
      engineType: "نوع المحرك",
      cylinderCount: "عدد السلندر",
      numberOfAxes: "عدد المحاور"
    };
    return labels[field] || field;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      // Add basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'trailers') formDataToSend.append(key, value);
      });

      // Add images
      const addImage = async (photo, fieldName) => {
        if (photo) {
          const blob = await fetch(photo).then(r => r.blob());
          formDataToSend.append(fieldName, blob, `${fieldName}.jpg`);
        }
      };

      await addImage(photo1, 'ApplicationImages');
      await addImage(photo2, 'ApplicationImages');
      await addImage(photo3, 'ApplicationImages');

      // Add trailers if exists
      if (formData.formType === 'شاحنة' && formData.trailers.length > 0) {
        formDataToSend.append('TrailerData', JSON.stringify(formData.trailers));
      }

      // API call
      const response = await fetch('http://localhost:5273/api/user/application/create-new-entity', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      const result = await response.json();
      
      if (result.isSuccess) {
        navigate('/forms', { state: { success: true } });
      } else {
        setFormErrors(result.errors || ['حدث خطأ غير متوقع']);
      }
    } catch (error) {
      setFormErrors(['فشل في الاتصال بالخادم']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onClose={() => navigate('/forms')} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-lg" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl shadow-xl">
          <div className="p-6 border-b flex justify-between items-center">
            <Dialog.Title className="text-2xl font-bold">إنشاء استمارة جديدة</Dialog.Title>
            <button onClick={() => navigate('/forms')} className="p-2 hover:bg-gray-100 rounded-lg">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Steps indicator */}
          <div className="p-6 border-b">
            <div className="flex justify-center gap-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${currentStep > index + 1 ? 'bg-green-500 text-white' : 
                     currentStep === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {index + 1}
                  </div>
                  <span className={`${currentStep === index + 1 ? 'font-semibold' : ''}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {formErrors.length > 0 && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
                <ul className="list-disc pr-4">
                  {formErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="اسم المواطن"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
                
                <div>
                  <label className="block text-right mb-2 font-medium">نوع الاستمارة</label>
                  <select
                    name="formType"
                    value={formData.formType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">اختر النوع</option>
                    <option value="سيارة">سيارة</option>
                    <option value="شاحنة">شاحنة</option>
                    <option value="دراجة">دراجة</option>
                  </select>
                </div>
              </div>
            )}
            {/* Add other steps here */}

          </div>

          {/* Navigation buttons */}
          <div className="p-6 border-t flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(p => p > 1 ? p - 1 : 1)}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 flex items-center"
            >
              <ArrowLeftIcon className="w-5 h-5 ml-2" />
              رجوع
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => validateStep() && setCurrentStep(p => p + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
              >
                التالي
                <ArrowRightIcon className="w-5 h-5 mr-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إنشاء الاستمارة'}
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>

{/*       {showSearchModal && (
        <SearchModalForForm 
          isOpen={true}
          onClose={() => setShowSearchModal(false)}
          onSearch={(data) => {
            setFormData(prev => ({
              ...prev,
              ...data,
              chassisNumber: data.chassisNumber,
              vehicleType: data.vehicleType,
              vehicleModel: data.vehicleModel
            }));
            setShowSearchModal(false);
          }}
        />
      )} */}
    </Dialog>
  );
};

export default CreateForm;