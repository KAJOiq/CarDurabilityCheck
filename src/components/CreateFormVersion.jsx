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
    LockClosedIcon,
    LockOpenIcon,
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
    <div dir="rtl" className="space-y-6 text-right p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">البيانات المدخلة</h3>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <UserCircleIcon className="w-8 h-8 text-blue-500" />
          <h4 className="text-xl font-semibold text-gray-700">بيانات المواطن</h4>
        </div>
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

      {/* بطاقة بيانات المركبة */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <TruckIcon className="w-8 h-8 text-green-500" />
          <h4 className="text-xl font-semibold text-gray-700">بيانات المركبة</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">نوع الاستمارة</span>
              <span className="text-gray-800">{formData.VehicleType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">نوع المركبة</span>
              <span className="text-gray-800">{formData.CarBrandId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">طراز المركبة</span>
              <span className="text-gray-800">{formData.CarNameId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">لون المركبة</span>
              <span className="text-gray-800">{formData.CarColorId}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">رقم الشاصي</span>
              <span className="text-gray-800">{formData.ChassisNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">الموديل</span>
              <span className="text-gray-800">{formData.CarModel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">رقم المركبة</span>
              <span className="text-gray-800">{formData.PlateNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">نوع التسجيل</span>
              <span className="text-gray-800">{formData.Usage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* بطاقة بيانات المحرك */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <CogIcon className="w-8 h-8 text-purple-500" />
          <h4 className="text-xl font-semibold text-gray-700">بيانات المحرك</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">نوع المحرك</span>
              <span className="text-gray-800">{formData.EngineType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">عدد السلندر</span>
              <span className="text-gray-800">{formData.EngineCylindersNumber}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">عدد المحاور</span>
              <span className="text-gray-800">{formData.VehicleAxlesNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">عدد الركاب</span>
              <span className="text-gray-800">{formData.SeatsNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* بطاقة بيانات المقطورة */}
      {formData.VehicleType === "شاحنة" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <LinkIcon className="w-8 h-8 text-yellow-500" />
            <h4 className="text-xl font-semibold text-gray-700">بيانات المقطورة</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600">تفاصيل المقطورة</span>
              <span className="text-gray-800">{formData.TrailerData[0]?.details}</span>
            </div>
          </div>
        </div>
      )}

      {/* قسم عرض الصور */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-3 mb-4">
          <CameraIcon className="w-8 h-8 text-blue-500" />
          <h4 className="text-xl font-semibold text-gray-700">الصور المرفوعة</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-600">صورة الشاصي</span>
              {formData.chassisCroppedImage ? (
                <img
                  src={URL.createObjectURL(formData.chassisCroppedImage)}
                  alt="صورة الشاصي"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <span className="text-gray-500">لا توجد صورة</span>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col items-center">
              <span className="font-medium text-gray-600">صورة السيارة</span>
              {formData.carCroppedImage ? (
                <img
                  src={URL.createObjectURL(formData.carCroppedImage)}
                  alt="صورة السيارة"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <span className="text-gray-500">لا توجد صورة</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const CreateFormVersion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [lockedFields, setLockedFields] = useState(true); 
  
  // States for photos
  const [carFullImage, setCarFullImage] = useState(null);
  const [carCroppedImage, setCarCroppedImage] = useState(null);
  const [chassisFullImage, setChassisFullImage] = useState(null);
  const [chassisCroppedImage, setChassisCroppedImage] = useState(null);
  const [receiptIdImage, setReceiptIdImage] = useState(null);

    // Form data structure

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
    TrailerData: [],
    VehicleID: "", 
  });

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
  
  useEffect(() => {
    if (location.state?.vehicleData) {
      const { vehicleData } = location.state;

      setOriginalData({
        CarBrandId: vehicleData.carBrand,
        CarNameId: vehicleData.carName,
        CarColorId: vehicleData.carColor,
        ChassisNumber: vehicleData.chassisNumber,
        CarModel: vehicleData.carModel,
        PlateNumber: vehicleData.plateNumber,
        EngineType: vehicleData.engineType,
        EngineCylindersNumber: vehicleData.engineCylindersNumber,
        VehicleAxlesNumber: vehicleData.vehicleAxlesNumber,
        SeatsNumber: vehicleData.seatsNumber,
        Usage: vehicleData.usage,
        VehicleID: vehicleData.vehicleID, 
      });

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
        TrailerData: vehicleData.trailers,
      }));
    }
  }, [location.state]);

  const toggleLock = () => {
    setLockedFields((prev) => !prev); 
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCarImage = ({ fullImage, croppedImage }) => {
    setCarFullImage(fullImage);
    setCarCroppedImage(croppedImage);
  };

  const handleChassisImage = ({ fullImage, croppedImage }) => {
    setChassisFullImage(fullImage);
    setChassisCroppedImage(croppedImage);
  };

  const handleReceiptIdImage = ({ fullImage, croppedImage }) => {
    setReceiptIdImage(fullImage);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      // إضافة البيانات العامة
      formDataToSend.append("TrafficPoliceApplicationId", formData.TrafficPoliceApplicationId);
      formDataToSend.append("ReceiptId", formData.ReceiptId);
      formDataToSend.append("CarOwnerName", formData.CarOwnerName);
      formDataToSend.append("Governmental", formData.Governmental);
      formDataToSend.append("VehicleID", formData.VehicleID);

      // إضافة الصور
      if (carCroppedImage) formDataToSend.append("ApplicationImages", carCroppedImage, "carCroppedImage.png");
      if (carFullImage) formDataToSend.append("ApplicationImages", carFullImage, "carFullImage.png");
      if (chassisCroppedImage) formDataToSend.append("ApplicationImages", chassisCroppedImage, "chassisCroppedImage.png");
      if (chassisFullImage) formDataToSend.append("ApplicationImages", chassisFullImage, "chassisFullImage.png");
      if (receiptIdImage) formDataToSend.append("ApplicationImages", receiptIdImage, "receiptIdImage.png");

      // إضافة بيانات المركبة إذا تم فتح القفل
      if (!lockedFields) {
        formDataToSend.append("PlateNumber", formData.PlateNumber);
        formDataToSend.append("CarColorId", formData.CarColorId);
        formDataToSend.append("VehicleAxlesNumber", formData.VehicleAxlesNumber);
        formDataToSend.append("EngineCylindersNumber", formData.EngineCylindersNumber);
      }

      const endpoint = lockedFields
        ? "user/application/create-application-to-same-version"
        : "user/application/create-application-to-different-version";

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
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">تفاصيل المركبة</h3>
                  <button
                    onClick={toggleLock}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {lockedFields ? (
                      <LockClosedIcon className="w-6 h-6 text-gray-600" />
                    ) : (
                      <LockOpenIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>

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
                        }));
                      }}
                      placeholder="اختر نوع المركبة"
                      disabled={true} // دائمًا مقفل
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
                        }));
                      }}
                      placeholder="اختر طراز المركبة"
                      disabled={true} // دائمًا مقفل
                    />
                  </div>
                  <div>
                    <label className="block text-right mb-2 font-medium text-gray-700">لون المركبة</label>
                    <DropDownListTemplate
                      endpoint="find-vehicles-colors"
                      queryParams={{ page: 0, pageSize: 5000 }}
                      labelKey="color"
                      valueKey="id"
                      onSelect={(item) => {
                        setFormData((prev) => ({
                          ...prev,
                          CarColorId: item.id,
                        }));
                      }}
                      placeholder="اختر لون المركبة"
                      disabled={lockedFields} // يمكن تعديله إذا فُتح القفل
                    />
                  </div>
                  <InputField
                    label="رقم الشاصي"
                    name="ChassisNumber"
                    value={formData.ChassisNumber}
                    onChange={handleChange}
                    disabled={true} // دائمًا مقفل
                  />
                  <InputField
                    label="الموديل"
                    name="CarModel"
                    value={formData.CarModel}
                    onChange={handleChange}
                    disabled={true} // دائمًا مقفل
                  />
                  <InputField
                    label="رقم المركبة"
                    name="PlateNumber"
                    value={formData.PlateNumber}
                    onChange={handleChange}
                    disabled={lockedFields} // يمكن تعديله إذا فُتح القفل
                  />
                  <InputField
                    label="نوع المحرك"
                    name="EngineType"
                    value={formData.EngineType}
                    onChange={handleChange}
                    disabled={true} // دائمًا مقفل
                  />
                  <InputField
                    label="عدد السلندر"
                    name="EngineCylindersNumber"
                    value={formData.EngineCylindersNumber}
                    onChange={handleChange}
                    disabled={lockedFields} // يمكن تعديله إذا فُتح القفل
                  />
                  <InputField
                    label="عدد المحاور"
                    name="VehicleAxlesNumber"
                    value={formData.VehicleAxlesNumber}
                    onChange={handleChange}
                    disabled={lockedFields} // يمكن تعديله إذا فُتح القفل
                  />
                  <InputField
                    label="عدد الركاب"
                    name="SeatsNumber"
                    value={formData.SeatsNumber}
                    onChange={handleChange}
                    disabled={true} // دائمًا مقفل
                  />
                  <InputField
                    label="الاستخدام"
                    name="Usage"
                    value={formData.Usage}
                    onChange={handleChange}
                    disabled={true} // دائمًا مقفل
                  />
                </div>
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
              onClick={() => setCurrentStep((p) => (p > 1 ? p - 1 : 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 flex items-center hover:bg-gray-200"
            >
              <ArrowLeftIcon className="w-5 h-5 ml-2 text-gray-700" />
              رجوع
            </button>
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={() => setCurrentStep((p) => p + 1)}
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