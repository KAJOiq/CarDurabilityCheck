import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {  
    XMarkIcon, 
    ArrowLeftIcon, 
    ArrowRightIcon, 
    UserCircleIcon,
    TruckIcon,
    CogIcon,
    LinkIcon,
} from "@heroicons/react/24/outline";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import CameraComponent from "./CameraComponent";
import { useNavigate, useLocation } from "react-router-dom";
import fetchData from "../utils/fetchData";
import DropDownListTemplate from "./DropDownListTemplate";
import Select from 'react-select';


const ReviewData = ({ formData }) => {
    return (
      <div className="space-y-6 text-right">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">البيانات المدخلة</h3>
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-row-reverse items-center space-x-3 space-x-reverse mb-4">
            <UserCircleIcon className="w-8 h-8 text-blue-500" />
            <h4 className="text-xl font-semibold text-gray-700">بيانات المواطن</h4>
          </div>
          <div className="space-y-3">
            <div className="flex flex-row-reverse justify-between items-center">
              <span className="font-medium text-gray-600">اسم المواطن</span>
              <span className="text-gray-800">{formData.CarOwnerName}</span>
            </div>
            <div className="flex flex-row-reverse justify-between items-center">
              <span className="font-medium text-gray-600">حكومي</span>
              <span className="text-gray-800">
                {formData.Governmental ? "نعم" : "لا"}
              </span>
            </div>
            {!formData.Governmental && (
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">رقم وصل القبض</span>
                <span className="text-gray-800">{formData.ReceiptId}</span>
              </div>
            )}
          </div>
        </div>
  
        {/* بطاقة بيانات المركبة */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-row-reverse items-center space-x-3 space-x-reverse mb-4">
            <TruckIcon className="w-8 h-8 text-green-500" />
            <h4 className="text-xl font-semibold text-gray-700">بيانات المركبة</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">نوع الاستمارة</span>
                <span className="text-gray-800">{formData.VehicleType}</span>
              </div>
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">نوع المركبة</span>
                <span className="text-gray-800">{formData.CarBrandId}</span>
              </div>
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">طراز المركبة</span>
                <span className="text-gray-800">{formData.CarNameId}</span>
              </div>
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">لون المركبة</span>
                <span className="text-gray-800">{formData.CarColorId}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">رقم الشاصي</span>
                <span className="text-gray-800">{formData.ChassisNumber}</span>
              </div>
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">الموديل</span>
                <span className="text-gray-800">{formData.CarModel}</span>
              </div>
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">رقم المركبة</span>
                <span className="text-gray-800">{formData.PlateNumber}</span>
              </div>
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">الاستخدام</span>
                <span className="text-gray-800">{formData.Usage}</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* بطاقة بيانات المحرك */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-row-reverse items-center space-x-3 space-x-reverse mb-4">
            <CogIcon className="w-8 h-8 text-purple-500" />
            <h4 className="text-xl font-semibold text-gray-700">بيانات المحرك</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">نوع المحرك</span>
                <span className="text-gray-800">{formData.EngineType}</span>
              </div>
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">عدد السلندر</span>
                <span className="text-gray-800">{formData.EngineCylindersNumber}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">عدد المحاور</span>
                <span className="text-gray-800">{formData.VehicleAxlesNumber}</span>
              </div>
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">عدد الركاب</span>
                <span className="text-gray-800">{formData.SeatsNumber}</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* بطاقة بيانات المقطورة */}
        {formData.VehicleType === "2" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-row-reverse items-center space-x-3 space-x-reverse mb-4">
              <LinkIcon className="w-8 h-8 text-yellow-500" />
              <h4 className="text-xl font-semibold text-gray-700">بيانات المقطورة</h4>
            </div>
            <div className="space-y-3">
              <div className="flex flex-row-reverse justify-between items-center">
                <span className="font-medium text-gray-600">تفاصيل المقطورة</span>
                <span className="text-gray-800">{formData.TrailerData[0]?.details}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };  

const CreateFormVersion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [isModified, setIsModified] = useState(false); 
  const [formData, setFormData] = useState({
    CarOwnerName: "",
    VehicleType: "",
    CarBrandId: "",
    CarNameId: "",
    CarModel: "",
    CarColorId: "",
    ChassisNumber: "",
    Usage: "",
    TrafficPoliceApplicationId: "",
    ReceiptId: "",
    EngineType: "",
    EngineCylindersNumber: "",
    VehicleAxlesNumber: "",
    SeatsNumber: "",
    PlateNumber: "",
    Governmental: false,
    TrailerData: []
  });

  const [carFullImage, setCarFullImage] = useState(null);
  const [carCroppedImage, setCarCroppedImage] = useState(null);
  const [chassisFullImage, setChassisFullImage] = useState(null);
  const [chassisCroppedImage, setChassisCroppedImage] = useState(null);
  const [receiptIdImage, setReceiptIdImage] = useState(null);

  const steps = [
    { title: "تفاصيل الاستمارة", fields: ['CarOwnerName', 'VehicleType', 'ReceiptId', 'TrafficPoliceApplicationId'] },
    { title: "تفاصيل المركبة", fields: ['CarBrandId', 'CarNameId', 'CarColorId', 'ChassisNumber', 'PlateNumber', 'CarModel', 'EngineCylindersNumber', 'VehicleAxlesNumber', 'EngineType', 'SeatsNumber', 'Usage', 'Governmental'] },
    { title: "صورة السيارة", fields: ['carFullImage', 'carCroppedImage'] },
    { title: "صورة الشاصي", fields: ['chassisFullImage', 'chassisCroppedImage'] },
    { title: "صورة وصل القبض", fields: ['receiptIdImage']},
    { title: "المراجعة النهائية" }
  ];

  const engineTypeOptions = [
    { value: 'وقود', label: 'وقود' },
    { value: 'كهربائي', label: 'كهربائي' },
    { value: 'هجين', label: 'هجين' },
  ];

  useEffect(() => {
    if (location.state?.vehicleData) {
      const { vehicleData } = location.state;
      setFormData((prev) => ({
        ...prev,
        VehicleID: vehicleData.vehicleID,
        VehicleType: vehicleData.vehicleType,
        CarBrandId: vehicleData.carBrand,
        CarNameId: vehicleData.carName,
        ChassisNumber: vehicleData.chassisNumber,
        CarModel: vehicleData.carModel,
        CarColorId: vehicleData.carColor,
        PlateNumber: vehicleData.plateNumber,
        EngineType: vehicleData.engineType,
        VehicleAxlesNumber: vehicleData.vehicleAxlesNumber,
        EngineCylindersNumber: vehicleData.engineCylindersNumber,
        Usage: vehicleData.usage,
        SeatsNumber: vehicleData.seatsNumber,
        TrailerData: vehicleData.trailers
      }));
    }
  }, [location.state]);

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

  const [provinceCode, setProvinceCode] = useState(''); // رمز المحافظة
  const [plateLetter, setPlateLetter] = useState(''); // الحرف
  const [plateNumber, setPlateNumber] = useState(''); // الرقم

  const handlePlateNumberChange = () => {
    if (plateNumber.length === 5) {
      const fullPlateNumber = `${provinceCode}${plateLetter}${plateNumber}`;
      setFormData((prev) => ({
        ...prev,
        PlateNumber: fullPlateNumber,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setIsModified(true); 
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      if (carCroppedImage) {
        formDataToSend.append('ApplicationImages', carCroppedImage, 'carCroppedImage.png');
      }
      if (carFullImage) {
        formDataToSend.append('ApplicationImages', carFullImage, 'carFullImage.png');
      }
      if (chassisCroppedImage) {
        formDataToSend.append('ApplicationImages', chassisCroppedImage, 'chassisCroppedImage.png');
      }
      if (chassisFullImage) {
        formDataToSend.append('ApplicationImages', chassisFullImage, 'chassisFullImage.png');
      }
      if (receiptIdImage) {
        formDataToSend.append('ApplicationImages', receiptIdImage, 'receiptIdImage.png');
      }

      const endpoint = isModified
        ? "user/application/create-application-to-different-version"
        : "user/application/create-application-to-same-version";

      const result = await fetchData(endpoint, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!result.isSuccess) {
        setFormErrors(result.errors?.map((err) => err.message) || ["حدث خطأ غير متوقع"]);
        return;
      }

      navigate("/forms", { state: { success: true } });
    } catch (error) {
      setFormErrors(["فشل في الاتصال بالخادم: " + error.message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCarImage = ({ fullImage, croppedImage }) => {
    setCarCroppedImage(croppedImage); // File
    setCarFullImage(fullImage); // File
  };
  
  const handleChassisImage = ({ fullImage, croppedImage }) => {
    setChassisCroppedImage(croppedImage); // File
    setChassisFullImage(fullImage); // File
  };
  
  const handleReceiptIdImage = ({ fullImage, croppedImage }) => {
    setReceiptIdImage(fullImage); // File
  };

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
    <Dialog open={true} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-lg" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center">
            <Dialog.Title className="text-2xl font-bold text-gray-800">إنشاء استمارة جديدة</Dialog.Title>
            <button onClick={() => navigate('/forms')} className="p-2 hover:bg-gray-100 rounded-lg">
              <XMarkIcon className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6 border-b bg-gray-50">
            <div className="flex justify-center items-center">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                        ${
                          currentStep > index + 1
                            ? 'bg-green-500 text-white shadow-lg hover:bg-green-600'
                            : currentStep === index + 1
                            ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-xs font-medium transition-all duration-300 mt-2
                        ${
                          currentStep === index + 1
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-500'
                        }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="absolute top-5 left-full transform translate-x-4 w-24 h-0.5 bg-gray-300"></div>
                    )}
                  </div>
                  {index < steps.length - 1 && <div className="mx-8"></div>}
                </React.Fragment>
              ))}
            </div>
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

            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="رقم استمارة المرور"
                  name="TrafficPoliceApplicationId"
                  value={formData.TrafficPoliceApplicationId}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="رقم وصل القبض"
                  name="ReceiptId"
                  value={formData.ReceiptId}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="اسم المواطن"
                  name="CarOwnerName"
                  value={formData.CarOwnerName}
                  onChange={handleChange}
                  required
                />
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
                    }));
                  }}
                  placeholder="اختر طراز المركبة"
                  disabled={!formData.CarBrandId} 
                />
                </div>
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
                    }));
                  }}
                  placeholder="اختر نوع المركبة"
                  disabled={false}
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
                  required
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-right mb-2 font-medium text-gray-700">رمز المحافظة</label>
                    <Select
                      options={provinceOptions}
                      placeholder="اختر المحافظة"
                      value={provinceOptions.find(option => option.value === provinceCode)}
                      onChange={(selectedOption) => {
                        setProvinceCode(selectedOption.value);
                        handlePlateNumberChange();
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
                  <div>
                    <label className="block text-right mb-2 font-medium text-gray-700">الحرف</label>
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
                    <label className="block text-right mb-2 font-medium text-gray-700">الرقم</label>
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
                </div>

                <InputField
                  label="عدد الركاب"
                  name="SeatsNumber"
                  value={formData.SeatsNumber}
                  onChange={handleChange}
                  required
                />
                
                <InputField
                  label="الاستخدام"
                  name="Usage"
                  value={formData.Usage}
                  onChange={handleChange}
                  required
                />
{formData.VehicleType === "2" && (
  <div>
    <label className="block text-right mb-2 font-medium text-gray-700">تفاصيل المقطورات</label>
    
    {formData.TrailerData.map((trailer, index) => (
      <div key={index} className="mb-4 p-2 border rounded-lg">
        <label className="block text-right text-gray-700">رقم شاصي المقطورة</label>
        <input
          type="text"
          name={`TrailerChassisNumber-${index}`}
          value={trailer.TrailerChassisNumber || ""}
          onChange={(e) => {
            const updatedTrailerData = [...formData.TrailerData];
            updatedTrailerData[index].TrailerChassisNumber = e.target.value;
            setFormData(prev => ({
              ...prev,
              TrailerData: updatedTrailerData
            }));
          }}
          className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="أدخل رقم شاصي المقطورة"
        />

        <label className="block text-right text-gray-700 mt-2">عدد المحاور</label>
        <input
          type="number"
          name={`TrailerAxlesNumber-${index}`}
          value={trailer.TrailerAxlesNumber || ""}
          onChange={(e) => {
            const updatedTrailerData = [...formData.TrailerData];
            updatedTrailerData[index].TrailerAxlesNumber = e.target.value;
            setFormData(prev => ({
              ...prev,
              TrailerData: updatedTrailerData
            }));
          }}
          className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="أدخل عدد المحاور"
        />

        <label className="block text-right text-gray-700 mt-2">الحمولة</label>
        <input
          type="number"
          name={`LoadWeight-${index}`}
          value={trailer.LoadWeight || ""}
          onChange={(e) => {
            const updatedTrailerData = [...formData.TrailerData];
            updatedTrailerData[index].LoadWeight = e.target.value;
            setFormData(prev => ({
              ...prev,
              TrailerData: updatedTrailerData
            }));
          }}
          className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ادخل وزن الحمولة"
        />

        <label className="block text-right text-gray-700 mt-2">الفئة</label>
        <input
          type="text"
          name={`Category-${index}`}
          value={trailer.Category || ""}
          onChange={(e) => {
            const updatedTrailerData = [...formData.TrailerData];
            updatedTrailerData[index].Category = e.target.value;
            setFormData(prev => ({
              ...prev,
              TrailerData: updatedTrailerData
            }));
          }}
          className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="أدخل فئة المقطورة"
        />

        <button
          onClick={() => {
            const updatedTrailerData = formData.TrailerData.filter((_, i) => i !== index);
            setFormData(prev => ({
              ...prev,
              TrailerData: updatedTrailerData
            }));
          }}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          حذف المقطورة
        </button>
      </div>
    ))}

    <button
      onClick={() => {
        const newTrailer = {
          TrailerChassisNumber: "",
          TrailerAxlesNumber: "",
          LoadWeight: "",
          Category: ""
        };
        setFormData(prev => ({
          ...prev,
          TrailerData: [...prev.TrailerData, newTrailer]
        }));
      }}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      إضافة مقطورة جديدة
    </button>
  </div>
)}

              </div>
            )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">صورة مقدمة السيارة</h3>
            <CameraComponent setPhoto={handleCarImage} />
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">صورة الشاصي</h3>
            <CameraComponent setPhoto={handleChassisImage} />
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-4">
          {!formData.Governmental && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">صورة وصل القبض</h3>
              <CameraComponent setPhoto={handleReceiptIdImage} />
            </div>
          )}
        </div>
      )}

            {currentStep === 6 && (
              <ReviewData formData={formData} />
            )}
          </div>


          <div className="p-6 border-t flex justify-between bg-white">
            <button
              type="button"
              onClick={() => setCurrentStep(p => p > 1 ? p - 1 : 1)}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 flex items-center hover:bg-gray-200"
            >
              <ArrowLeftIcon className="w-5 h-5 ml-2 text-gray-700" />
              رجوع
            </button>
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep(p => p + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600"
              >
                التالي
                <ArrowRightIcon className="w-5 h-5 mr-2" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إنشاء الاستمارة'}
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateFormVersion;