import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { 
  XMarkIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  UserCircleIcon,
  TruckIcon,
  CogIcon,
  LinkIcon
} from "@heroicons/react/24/outline";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import { useNavigate } from "react-router-dom";
import DropDownListTemplate from "./DropDownListTemplate";
import fetchData from "../utils/fetchData";
import Select from 'react-select';

const EditFormModal = ({ isOpen, onClose, formData: initialFormData }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  // Form data structure
  const [formData, setFormData] = useState({
    applicationID: initialFormData?.applicationId || 0,
    CarOwnerName: initialFormData?.carOwnerName || "",
    FatherName: initialFormData?.fatherName || "",
    MotherName: initialFormData?.motherName || "",
    GrandFatherName: initialFormData?.grandFatherName || "",
    Surename: initialFormData?.surename || "",
    VehicleType: initialFormData?.vehicleType || "",
    CarBrandId: initialFormData?.carBrandId || "",
    CarNameId: initialFormData?.carNameId || "",
    CarModel: initialFormData?.carModel || "",
    CarColorId: initialFormData?.carColorId || "",
    ChassisNumber: initialFormData?.chassisNumber || "",
    Usage: initialFormData?.usage || "",
    TrafficPoliceApplicationId: initialFormData?.trafficPoliceApplicationId || "",
    ReceiptId: initialFormData?.receiptId || "",
    EngineType: initialFormData?.engineType || "",
    EngineCylindersNumber: initialFormData?.engineCylindersNumber || "",
    VehicleAxlesNumber: initialFormData?.vehicleAxlesNumber || "",
    SeatsNumber: initialFormData?.seatsNumber || "",
    PlateNumber: initialFormData?.plateNumber || "",
    Governmental: initialFormData?.governmental || false,
    TrailerData: initialFormData?.TrailerData || [], 
  });

  const steps = [
    { title: "تفاصيل الاستمارة", fields: ['CarOwnerName', 'FatherName', 'MotherName', 'GrandFatherName', 'Surename', 'VehicleType', 'ReceiptId', 'TrafficPoliceApplicationId'] },
    { title: "تفاصيل المركبة", fields: ['CarBrandId', 'CarNameId', 'CarColorId', 'ChassisNumber', 'PlateNumber', 'CarModel', 'EngineCylindersNumber', 'VehicleAxlesNumber', 'EngineType', 'SeatsNumber', 'Usage', 'Governmental'] },
    { title: "المراجعة النهائية" }
  ];

  const usageOptions = [
    { value: "اجرة", label: "أجرة" },
    { value: "خصوصي", label: "خصوصي" },
    { value: "حمل", label: "حمل" },
    { value: "زراعية", label: "زراعية" },
    { value: "انشائية", label: "إنشائية" },
    { value: "تخصصية", label: "تخصصية" },
    { value: "فحص مؤقت", label: "فحص مؤقت" },
  ];

  const engineTypeOptions = [
    { value: 'وقود', label: 'وقود' },
    { value: 'كهربائي', label: 'كهربائي' },
    { value: 'هجين', label: 'هجين' },
  ];

  const provinceOptions = [
    { value: '11', label: 'بغداد 11' },
    { value: '12', label: 'نينوى 12' },
    { value: '13', label: 'ميسان 13' },
    { value: '14', label: 'البصرة 14' },
    { value: '15', label: 'الأنبار 15' },
    { value: '16', label: 'القادسية 16' },
    { value: '17', label: 'المثنى 17' },
    { value: '18', label: 'بابل 18' },
    { value: '19', label: 'كربلاء 19' },
    { value: '20', label: 'ديالى 20' },
    { value: '21', label: 'السليمانية 21' },
    { value: '22', label: 'أربيل 22' },
    { value: '23', label: 'حلبجة 23' },
    { value: '24', label: 'دهوك 24' },
    { value: '25', label: 'كركوك 25' },
    { value: '26', label: 'صلاح الدين 26' },
    { value: '27', label: 'ذي قار 27' },
    { value: '28', label: 'النجف 28' },
    { value: '29', label: 'واسط 29' }
  ];
  
  const provinceOptions2 = [
    { value: 'بغداد', label: 'بغداد' },
    { value: 'نينوى', label: 'نينوى' },
    { value: 'ميسان', label: 'ميسان' },
    { value: 'البصرة', label: 'البصرة' },
    { value: 'الأنبار', label: 'الأنبار' },
    { value: 'القادسية', label: 'القادسية' },
    { value: 'المثنى', label: 'المثنى' },
    { value: 'بابل', label: 'بابل' },
    { value: 'كربلاء', label: 'كربلاء' },
    { value: 'ديالى', label: 'ديالى' },
    { value: 'السليمانية', label: 'السليمانية' },
    { value: 'أربيل', label: 'أربيل' },
    { value: 'حلبجة', label: 'حلبجة' },
    { value: 'دهوك', label: 'دهوك' },
    { value: 'كركوك', label: 'كركوك' },
    { value: 'صلاح الدين', label: 'صلاح الدين' },
    { value: 'ذي قار', label: 'ذي قار' },
    { value: 'النجف', label: 'النجف' },
    { value: 'واسط', label: 'واسط' }
  ];

  const [plateType, setPlateType] = useState("national");
  const [provinceCode, setProvinceCode] = useState(initialFormData?.plateNumber?.substring(0, 2) || '');
  const [plateLetter, setPlateLetter] = useState(initialFormData?.plateNumber?.substring(2, 3) || '');
  const [plateNumber, setPlateNumber] = useState(initialFormData?.plateNumber?.substring(3) || '');

  // Handle plate number change based on type
  const handlePlateNumberChange = () => {
    let fullPlateNumber = "";

    switch (plateType) {
      case "national":
        fullPlateNumber = `${provinceCode}${plateLetter}${plateNumber}`;
        break;
      case "temporary":
        fullPlateNumber = `${plateLetter}${plateNumber}`;
        break;
      case "old":
        fullPlateNumber = `${provinceCode}${plateNumber}`;
        break;
      default:
        fullPlateNumber = "";
    }

    setFormData((prev) => ({
      ...prev,
      PlateNumber: fullPlateNumber,
    }));
  };

  useEffect(() => {
    handlePlateNumberChange();
  }, [provinceCode, plateLetter, plateNumber, plateType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  
    if (name === "VehicleType" && value === "شاحنة") {
      setFormData(prev => ({
        ...prev,
        TrailerData: [{}] 
      }));
    } else if (name === "VehicleType" && value !== "شاحنة") {
      setFormData(prev => ({
        ...prev,
        TrailerData: [] 
      }));
    }
  };

  const validateStep = () => {
    const currentFields = steps[currentStep - 1].fields;
    const errors = [];
    
    currentFields.forEach(field => {
      if (field === 'ReceiptId' && formData.ReceiptId === null && !formData.Governmental) {
        errors.push('رقم وصل القبض مطلوب');
      }
    });
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

     
      const requestData = {
        applicationID: formData.applicationID, 
        trafficPoliceApplicationId: formData.TrafficPoliceApplicationId || null,
        receiptId: formData.ReceiptId || null,
        governmental: formData.Governmental || false,
        carOwnerName: formData.CarOwnerName || null,
        fatherName: formData.FatherName || null,
        grandFatherName: formData.GrandFatherName || null,
        motherName: formData.MotherName || null,
        surename: formData.Surename || null,
        engineType: formData.EngineType || null,
        chassisNumber: formData.ChassisNumber || null,
        plateNumber: formData.PlateNumber || null,
        engineCylindersNumber: formData.EngineCylindersNumber || null,
        vehicleAxlesNumber: formData.VehicleAxlesNumber || null,
        carModel: formData.CarModel || null,
        seatsNumber: formData.SeatsNumber || null,
        carNameId: formData.CarNameId || null,
        carColorId: formData.CarColorId || null,
        carBrandId: formData.CarBrandId || null,
        vehicleType: formData.VehicleType || null,
        usage: formData.Usage || null,
        updateTrailerDTO: formData.TrailerData.map(trailer => ({
          trailerId: trailer.trailerId || null, 
          trailerChassisNumber: trailer.TrailerChassisNumber || null,
          trailerAxlesNumber: trailer.TrailerAxlesNumber || null,
          loadWeight: trailer.LoadWeight || null,
          category: trailer.Category || null
        }))
      };

      console.log("Request Data:", requestData); 

      const result = await fetchData('user/application/repeat-application', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(requestData),
      });

      if (!result.isSuccess) {
        const errorMessages = result.errors ? result.errors.map(error => error.message) : ['حدث خطأ غير متوقع'];
        setFormErrors(errorMessages);
        return;
      }

      onClose(); 
    } catch (error) {
      console.error('Error:', error);
      setFormErrors(['فشل في الاتصال بالخادم: ' + error.message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ownerFullName = [
    formData.CarOwnerName,
    formData.FatherName,
    formData.GrandFatherName,
    formData.Surename
  ].filter(name => name.trim() !== "").join(" ");

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1800; year--) {
      years.push({ value: year, label: year.toString() });
    }
    return years;
  };
  
  const yearOptions = generateYears();

  return (
    <Dialog open={isOpen} onClose={onClose} dir="rtl" className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-lg" />
      
      <div className="fixed inset-0 flex items-center justify-center p-6">
        <Dialog.Panel className="w-full max-w-8xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center">
            <Dialog.Title className="text-2xl font-bold text-gray-800">تعديل الاستمارة</Dialog.Title>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <XMarkIcon className="w-7 h-7 text-gray-600" />
            </button>
          </div>

          {/* Steps indicator */}
          <div className="p-2 border-b bg-gray-50 flex justify-center gap-3 flex-wrap">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <button
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all whitespace-nowrap
                    ${currentStep > index + 1 ? "bg-green-500 text-white" : 
                      currentStep === index + 1 ? "bg-blue-500 text-white" : 
                      "bg-gray-200 text-gray-600"}`}
                  onClick={() => setCurrentStep(index + 1)}
                >
                  {step.title}
                </button>
                {index < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>}
              </div>
            ))}
          </div>

          {/* Form content */}
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

            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="الإسم"
                  name="CarOwnerName"
                  value={formData.CarOwnerName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="اسم الأب"
                  name="FatherName"
                  value={formData.FatherName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="اسم الجد"
                  name="GrandFatherName"
                  value={formData.GrandFatherName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="اسم الأم"
                  name="MotherName"
                  value={formData.MotherName}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="اللقب"
                  name="Surename"
                  value={formData.Surename}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="block text-right mb-2 font-medium text-gray-700">نوع الاستمارة</label>
                  <select
                    name="VehicleType"
                    value={formData.VehicleType}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر النوع</option>
                    <option value="سيارة">سيارة</option>
                    <option value="شاحنة">شاحنة</option>
                    <option value="دراجة">دراجة</option>
                  </select>
                </div>

                {!formData.Governmental && (
                <div>
                <label className="block text-right mb-2 font-medium text-gray-700">نوع التسجيل</label>
                <Select
                  options={usageOptions}
                  placeholder="اختر نوع التسجيل"
                  value={usageOptions.find(option => option.value === formData.Usage)}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      handleChange({
                        target: {
                          name: 'Usage',
                          value: selectedOption.value,
                        },
                      });
                    }
                  }}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      padding: '0.25rem',
                    }),
                  }}
                />
                </div>
                )}

                <InputField 
                  label="رقم استمارة المرور"
                  name="TrafficPoliceApplicationId"
                  value={formData.TrafficPoliceApplicationId}
                  onChange={handleChange}
                  required
                />
                
                {!formData.Governmental && (
                  <InputField 
                    label="رقم وصل القبض"
                    name="ReceiptId"
                    value={formData.ReceiptId}
                    onChange={handleChange}
                    required
                  />
                )}

                <CheckboxField
                  label="حكومي"
                  name="Governmental"
                  checked={formData.Governmental}
                  onChange={handleChange}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-right mb-2 font-medium text-gray-700">نوع المركبة</label>
                  <DropDownListTemplate
                    endpoint="find-vehicle-company"
                    queryParams={{ page: 0, pageSize: 5000 }}
                    labelKey="name"
                    valueKey="id"
                    onSelect={(item) => {
                      setFormData((prev) => ({
                        ...prev,
                        CarBrandId: item.id,
                        CarBrand: item.name, 
                      }));
                    }}
                    placeholder="اختر نوع المركبة"
                    disabled={false}
                  />
                </div>

                <div>
                  <label className="block text-right mb-2 font-medium text-gray-700">طراز المركبة</label>
                  <DropDownListTemplate
                    endpoint="find-vehicle-name"
                    queryParams={{ brandId: formData.CarBrandId, page: 0, pageSize: 5000 }}
                    labelKey="name"
                    valueKey="id"
                    onSelect={(item) => {
                      setFormData((prev) => ({
                        ...prev,
                        CarNameId: item.id, 
                        CarName: item.name,
                      }));
                    }}
                    placeholder="اختر طراز المركبة"
                    disabled={!formData.CarBrandId} 
                  />
                </div>

                <div>
                  <label className="block text-right mb-2 font-medium text-gray-700">لون المركبة</label>
                  <DropDownListTemplate
                    endpoint="find-vehicles-colors"
                    queryParams={{page: 0, pageSize: 5000 }}
                    labelKey="color"
                    valueKey="id"
                    onSelect={(item) => {
                      setFormData((prev) => ({
                        ...prev,
                        CarColorId: item.id,
                        CarColor: item.color, 
                      }));
                    }}
                    placeholder="اختر لون المركبة"
                    disabled={false} 
                  />
                </div>

                <div>
                  <label className="block text-right mb-2 font-medium text-gray-700">نوع المحرك</label>
                  <Select
                    options={engineTypeOptions}
                    placeholder="اختر نوع المحرك"
                    value={engineTypeOptions.find(option => option.value === formData.EngineType)}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        handleChange({
                          target: {
                            name: 'EngineType',
                            value: selectedOption.value,
                          },
                        });
                      }
                    }}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        padding: '0.25rem',
                      }),
                    }}
                  />
                </div>

                <InputField
                  label="عدد السلندر"
                  name="EngineCylindersNumber"
                  value={formData.EngineCylindersNumber}
                  onChange={handleChange}
                  disabled={formData.EngineType === 'كهربائي'} 
                />

                <InputField
                  label="عدد المحاور"
                  name="VehicleAxlesNumber"
                  value={formData.VehicleAxlesNumber}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="رقم الشاصي"
                  name="ChassisNumber"
                  value={formData.ChassisNumber}
                  onChange={handleChange}
                  required
                />
                <div>
                <label className="block text-right mb-2 font-medium text-gray-700">الموديل</label>
                <Select
                  options={yearOptions}
                  placeholder="اختر الموديل"
                  value={yearOptions.find(option => option.value === formData.CarModel)}
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      handleChange({
                        target: {
                          name: 'CarModel',
                          value: selectedOption.value,
                        },
                      });
                    }
                  }}
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      padding: '0.25rem',
                    }),
                  }}
                />
                </div>

                <div className="p-4 border rounded-lg bg-white shadow-md">
                  {/* Radio Button Selection */}
                  <div className="mb-4">
                    <label className="block text-right font-medium text-gray-700 mb-2">
                      اختر نوع الرقم
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="plateType"
                          value="national"
                          checked={plateType === "national"}
                          onChange={() => setPlateType("national")}
                        />
                        رقم المشروع الوطني
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="plateType"
                          value="temporary"
                          checked={plateType === "temporary"}
                          onChange={() => setPlateType("temporary")}
                        />
                        رقم فحص مؤقت (الجمارك)
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="plateType"
                          value="old"
                          checked={plateType === "old"}
                          onChange={() => setPlateType("old")}
                        />
                        الرقم القديم
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="plateType"
                          value="noPlate"
                          checked={plateType === "noPlate"}
                          onChange={() => {
                            setPlateType("noPlate");
                            setPlateNumber("");
                            setPlateLetter("");
                            setProvinceCode("");
                          }}
                        />
                        مركبة بلا رقم
                      </label>
                    </div>
                  </div>

                  {/* Form Fields Based on Selection */}
                  <div className="grid grid-cols-3 gap-4">
                    {plateType === "national" && (
                      <>
                        <div>
                          <label className="block text-right mb-2 font-medium text-gray-700">
                            رمز المحافظة
                          </label>
                          <Select
                            options={provinceOptions}
                            placeholder="اختر رمز المحافظة"
                            value={provinceOptions.find(
                              (option) => option.value === provinceCode
                            )}
                            onChange={(selectedOption) => {
                              setProvinceCode(selectedOption.value);
                              handlePlateNumberChange();
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-right mb-2 font-medium text-gray-700">
                            الحرف الانكليزي
                          </label>
                          <DropDownListTemplate
                            endpoint="find-plate-character"
                            queryParams={{ page: 0, pageSize: 1000 }}
                            labelKey="allowedChar"
                            valueKey="id"
                            onSelect={(item) => {
                              setPlateLetter(item.allowedChar.toUpperCase());
                              handlePlateNumberChange();
                            }}
                            placeholder="اختر الحرف"
                          />
                        </div>
                        <div>
                          <label className="block text-right mb-2 font-medium text-gray-700">
                            الرقم
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل الرقم"
                            value={plateNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 5) {
                                setPlateNumber(value);
                                handlePlateNumberChange();
                              }
                            }}
                            maxLength={5}
                          />
                        </div>
                      </>
                    )}

                    {plateType === "temporary" && (
                      <>
                        <div>
                          <label className="block text-right mb-2 font-medium text-gray-700">
                            الحرف العربي
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل الحرف"
                            value={plateLetter}
                            onChange={(e) => {
                              setPlateLetter(e.target.value.toUpperCase());
                              handlePlateNumberChange();
                            }}
                            maxLength={1}
                          />
                        </div>
                        <div>
                          <label className="block text-right mb-2 font-medium text-gray-700">
                            الرقم
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل الرقم"
                            value={plateNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 5) {
                                setPlateNumber(value);
                                handlePlateNumberChange();
                              }
                            }}
                            maxLength={5}
                          />
                        </div>
                      </>
                    )}

                    {plateType === "old" && (
                      <>
                        <div>
                          <label className="block text-right mb-2 font-medium text-gray-700">
                            الرقم
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="أدخل الرقم"
                            value={plateNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value.length <= 6) {
                                setPlateNumber(value);
                                handlePlateNumberChange();
                              }
                            }}
                            maxLength={6}
                          />
                        </div>
                        <div>
                          <label className="block text-right mb-2 font-medium text-gray-700">
                            المحافظة
                          </label>
                          <Select
                            options={provinceOptions2}
                            placeholder="اختر المحافظة"
                            value={provinceOptions2.find(
                              (option) => option.value === provinceCode
                            )}
                            onChange={(selectedOption) => {
                              setProvinceCode(selectedOption.value);
                              handlePlateNumberChange();
                            }}
                          />
                        </div>
                      </>
                    )}

                    {plateType === "noPlate" && (
                      <div className="col-span-3 text-center text-gray-500">
                        هذه المركبة لا تحمل أي رقم تسجيل
                      </div>
                    )}
                  </div>
                </div>

                <InputField
                  label="عدد الركاب"
                  name="SeatsNumber"
                  value={formData.SeatsNumber}
                  onChange={handleChange}
                  required
                />

{formData.VehicleType === "شاحنة" && (
  <div className="p-4 border rounded-lg shadow-sm">
    <label className="block text-right mb-4 font-medium text-gray-700">تفاصيل المقطورات</label>
    {formData.TrailerData.map((trailer, index) => (
      <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm">
        <div className="space-y-1 grid grid-cols-2 gap-4 w-full">
          {/* رقم شاصي المقطورة */}
          <div>
            <label className="block text-right text-gray-700">رقم شاصي المقطورة</label>
            <input
              type="text"
              name={`TrailerChassisNumber-${index}`}
              value={trailer.TrailerChassisNumber || ""}
              onChange={(e) => {
                const updatedTrailerData = [...formData.TrailerData];
                updatedTrailerData[index].TrailerChassisNumber = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  TrailerData: updatedTrailerData,
                }));
              }}
              className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل رقم شاصي المقطورة"
            />
          </div>

          {/* عدد المحاور */}
          <div>
            <label className="block text-right text-gray-700">عدد المحاور</label>
            <input
              type="text"
              name={`TrailerAxlesNumber-${index}`}
              value={trailer.TrailerAxlesNumber || ""}
              onChange={(e) => {
                const updatedTrailerData = [...formData.TrailerData];
                updatedTrailerData[index].TrailerAxlesNumber = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  TrailerData: updatedTrailerData,
                }));
              }}
              className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل عدد المحاور"
            />
          </div>

          {/* الحمولة */}
          <div>
            <label className="block text-right text-gray-700">الحمولة</label>
            <input
              type="text"
              name={`LoadWeight-${index}`}
              value={trailer.LoadWeight || ""}
              onChange={(e) => {
                const updatedTrailerData = [...formData.TrailerData];
                updatedTrailerData[index].LoadWeight = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  TrailerData: updatedTrailerData,
                }));
              }}
              className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل وزن الحمولة"
            />
          </div>

          {/* الفئة */}
          <div>
            <label className="block text-right text-gray-700">الفئة</label>
            <input
              type="text"
              name={`Category-${index}`}
              value={trailer.Category || ""}
              onChange={(e) => {
                const updatedTrailerData = [...formData.TrailerData];
                updatedTrailerData[index].Category = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  TrailerData: updatedTrailerData,
                }));
              }}
              className="w-full p-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل فئة المقطورة"
            />
          </div>

          {/* زر حذف المقطورة */}
          <div className="text-right">
            <button
              onClick={() => {
                const updatedTrailerData = formData.TrailerData.filter((_, i) => i !== index);
                setFormData((prev) => ({
                  ...prev,
                  TrailerData: updatedTrailerData,
                }));
              }}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              حذف المقطورة
            </button>
          </div>
        </div>
      </div>
    ))}

    {/* زر إضافة مقطورة جديدة */}
    <div className="text-center mt-6">
      <button
        onClick={() => {
          const newTrailer = {
            TrailerChassisNumber: "",
            TrailerAxlesNumber: "",
            LoadWeight: "",
            Category: "",
          };
          setFormData((prev) => ({
            ...prev,
            TrailerData: [...prev.TrailerData, newTrailer],
          }));
        }}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        إضافة مقطورة جديدة
      </button>
    </div>
  </div>
)}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">المراجعة النهائية</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">اسم المواطن</span>
                      <span className="text-gray-800">{formData.CarOwnerName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">حكومي</span>
                      <span className="text-gray-800">
                        {formData.Governmental ? "نعم" : "لا"}
                      </span>
                    </div>
                    {!formData.Governmental && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">رقم وصل القبض</span>
                        <span className="text-gray-800">{formData.ReceiptId}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-600">رقم استمارة المرور</span>
                      <span className="text-gray-800">{formData.TrafficPoliceApplicationId}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="p-6 border-t flex justify-between bg-white">
            <button
              type="button"
              onClick={() => setCurrentStep(p => p > 1 ? p - 1 : 1)}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 flex items-center hover:bg-gray-200 transition-all"
            >
              <ArrowRightIcon className="w-5 h-5 ml-2 text-gray-700" />
              رجوع
            </button>
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => validateStep() && setCurrentStep(p => p + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600 transition-all"
              >
                التالي
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50 hover:bg-green-600 transition-all"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'تعديل الاستمارة'}
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditFormModal;