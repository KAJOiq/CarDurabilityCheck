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
import logo from "../assets/logo.jpg";
import QRCode from "qrcode"; 
import imgStaticCar from "../assets/car.jpeg";
import imgStaticTruck from "../assets/truck.png";
import imgStaticBike from "../assets/bike.png";

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
              <span className="text-gray-800">{formData.CarColor}</span>
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
  const [originalData, setOriginalData] = useState({});
  const [mergedData, setMergedData] = useState(null); 
  
  // States for photos
  const [carFullImage, setCarFullImage] = useState(null);
  const [carCroppedImage, setCarCroppedImage] = useState(null);
  const [chassisFullImage, setChassisFullImage] = useState(null);
  const [chassisCroppedImage, setChassisCroppedImage] = useState(null);
  const [receiptIdImage, setReceiptIdImage] = useState(null);

  // Form data structure
  const [formData, setFormData] = useState({
    CarOwnerName: "",
    FatherName: "", 
    MotherName: "",
    GrandFatherName: "",
    Surename: "",
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

  useEffect(() => {
    if (location.state?.vehicleData) {
      const { vehicleData } = location.state;

      setOriginalData({
        CarBrandId: vehicleData.carBrand,
        CarNameId: vehicleData.carName,
        CarColorId: vehicleData.carColorId,
        CarColor: vehicleData.carColor,
        ChassisNumber: vehicleData.chassisNumber,
        CarModel: vehicleData.carModel,
        PlateNumber: vehicleData.plateNumber,
        EngineType: vehicleData.engineType,
        EngineCylindersNumber: vehicleData.engineCylindersNumber,
        VehicleAxlesNumber: vehicleData.vehicleAxlesNumber,
        SeatsNumber: vehicleData.seatsNumber,
        Usage: vehicleData.usage,
        VehicleID: vehicleData.vehicleID,
        TrailerData: vehicleData.trailers,
      });

      setFormData((prev) => ({
        ...prev,
        VehicleID: vehicleData.vehicleID, 
        VehicleType: vehicleData.vehicleType,
        CarBrandId: vehicleData.carBrand,
        CarNameId: vehicleData.carName,
        ChassisNumber: vehicleData.chassisNumber,
        CarModel: vehicleData.carModel,
        CarColorId: vehicleData.carColorId,
        CarColor: vehicleData.carColor,
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
    handlePlateNumberChange();
  }, [provinceCode, plateLetter, plateNumber]);
  
  const toggleLock = () => {
    setLockedFields((prev) => !prev); 
  };


  const validateStep = () => {
    const currentFields = steps[currentStep - 1].fields;
    const errors = [];
    
    currentFields.forEach(field => {
      if (field === 'carFullImage' && !carFullImage) {
        errors.push('صورة السيارة الأصلية مطلوبة');
      }
      if (field === 'carCroppedImage' && !carCroppedImage) {
        errors.push('صورة السيارة المقصوصة مطلوبة');
      }
      if (field === 'chassisFullImage' && !chassisFullImage) {
        errors.push('صورة الشاصي الأصلية مطلوبة');
      }
      if (field === 'chassisCroppedImage' && !chassisCroppedImage) {
        errors.push('صورة الشاصي المقصوصة مطلوبة');
      }
      if (field === 'receiptIdImage' && !receiptIdImage && !formData.Governmental) {
        errors.push('صورة وصل القبض مطلوبة');
      }
      if (field === 'ReceiptId' && formData.ReceiptId === null && !formData.Governmental) {
        errors.push('رقم وصل القبض مطلوب');
      }
    });
    
    setFormErrors(errors);
    return errors.length === 0;
  };
  
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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      delete formDataToSend.CarBrand;
      delete formDataToSend.CarName;
      delete formDataToSend.CarColor;

      // إضافة البيانات العامة
      formDataToSend.append("TrafficPoliceApplicationId", formData.TrafficPoliceApplicationId);
      formDataToSend.append("ReceiptId", formData.ReceiptId);
      formDataToSend.append("CarOwnerName", formData.CarOwnerName);
      formDataToSend.append("FatherName", formData.FatherName);
      formDataToSend.append("MotherName", formData.MotherName);
      formDataToSend.append("GrandFatherName", formData.GrandFatherName);
      formDataToSend.append("Surename", formData.Surename);
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
        const errorMessages = result.errors ? result.errors.map(error => error.message) : ['حدث خطأ غير متوقع'];
        setFormErrors(errorMessages);
        return;
      }
      const mergedData = {
        ...formData, 
        applicationId: result.results.applicationId,
        vehicleId: result.results.vehicleId,
        issueDate: result.results.issueDate,
      };

      setMergedData(mergedData);

      if (mergedData.VehicleType === 'سيارة') {
      handlePrintForCar(mergedData);
      } else if (mergedData.VehicleType === 'شاحنة') {
        handlePrintForTruck(mergedData);
      } else if (mergedData.VehicleType === 'دراجة') {
        handlePrintForBike(mergedData);
      }

      navigate("/forms", { state: { success: true } });
    } catch (error) {
      setFormErrors(["فشل في الاتصال بالخادم: " + error.message]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const ownerFullName = [
    formData.CarOwnerName,
    formData.FatherName,
    formData.GrandFatherName,
    formData.Surename
].filter(name => name.trim() !== "").join(" ");

  const usageOptions = [
      { value: "اجرة", label: "أجرة" },
      { value: "خصوصي", label: "خصوصي" },
      { value: "حمل", label: "حمل" },
      { value: "زراعية", label: "زراعية" },
      { value: "انشائية", label: "إنشائية" },
      { value: "تخصصية", label: "تخصصية" },
      { value: "فحص مؤقت", label: "فحص مؤقت" },
    ];
    
    const handlePrintForCar = (data) => {
      if (!data) return;
      const imgStaticBase64 = imgStaticCar;
  
      const qrData = JSON.stringify({
        ADDID: data.applicationId,
        ISSD: data.issueDate,
        TFPN: data.TrafficPoliceApplicationId,
        RID: data.ReceiptId,
        CON: data.CarOwnerName,
        IG: data.Governmental,
        CN: data.ChassisNumber,
        PN: data.PlateNumber,
        CYC: data.EngineCylindersNumber,
        VAXN: data.VehicleAxlesNumber,
        COM: data.CarModel,
        SEAN: data.SeatsNumber,
        VN: data.CarNameId,
        VC: data.CarColorId,
        VB: data.CarBrandId,
        VT: data.VehicleType,
        USE: data.Usage,
        AGN: data.agency,
        LN: data.location,
        VID: data.vehicleId,
        ENT: data.EngineType,
        IIC: data.isInspectionCertified,
        SN: data.stickerNumber,
        SP: data.stickerProvider,
      });
  
      QRCode.toDataURL(qrData)
        .then((qrCodeDataUrl) => {
          const printFrame = document.createElement('iframe');
          printFrame.style.display = 'none';
          document.body.appendChild(printFrame);
  
          const doc = printFrame.contentDocument || printFrame.contentWindow.document;
          doc.open();
          doc.write(`
           <!DOCTYPE html>
               <html lang="ar" dir="rtl">
               <head>
                 <meta charset="UTF-8">
                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                 <title>شهادة فحص المركبة</title>
                 <link href="/tailwind.css" rel="stylesheet">
                 <style>
                   @media print {
                     @page {
                       size: A4 portrait;
                     }
                     body {
                       font-family: Arial, sans-serif;
                       direction: rtl;
                     }
                   }
                 </style>
               </head>
               <body class="bg-white w-[210mm] h-[148mm] p-6 text-right">
                 <!-- Header -->
                 <div class="flex items-center justify-between border-b-2 border-black pb-2 w-full" dir="rtl">
                   <div class="flex flex-col items-center w-1/4 text-sm space-y-2">
                     <h1 class="text-2xl font-bold text-black-800">جمهورية العراق</h1>
                     <h1 class="text-xl font-bold text-black-800">وزارة الداخلية</h1>
                   </div>
           
                   <!-- Center QR and Logo -->
                   <div class="relative flex items-center justify-center w-1/2">
                     <div class="w-24 mb-2 absolute right-0 mr-4">
                       <img src="${qrCodeDataUrl}" alt="QR Code" class="w-auto h-auto" />
                     </div>
                     <div class="mb-2 mx-auto absolute left-6 ml-10">
                       <img src="${logo}" alt="Logo" class="w-24 h-auto" />
                     </div>
                   </div>
           
                   <!-- Right-side Details -->
                   <div class="flex flex-col items-start w-2/5 text-sm text-right font-semibold">
                     <div class="grid grid-cols-2 w-full">
                       <div class="flex flex-col text-black-800">
                         <span>رقم استمارة الفحص</span> 
                         <span>رقم وصل القبض</span>
                         <span>اسم الموقع</span>
                         <span>تاريخ الاصدار</span>
                       </div>
                       <div class="flex flex-col text-black-800 font-bold text-right">
                         <span>: ${localStorage.getItem("location")}-${data.applicationId}</span>
                         <span>: ${formData.ReceiptId}</span>
                         <span>: ${localStorage.getItem("agency")}</span>
                         <span>: ${formatDate(data.issueDate)}</span>
                       </div>
                     </div>
                   </div>
                 </div>
           
                 <!-- Vehicle Data Section -->
                 <div class="border border-black rounded-lg p-1 mt-1">
                   <h3 class="bg-gray-200 text-center font-bold py-0.5">بيانات المركبة</h3>
                   <div class="grid grid-cols-2 gap-2 text-md">
                     ${[
                       ["اسم المالك", ownerFullName],
                       ["نوع المركبة", formData.CarBrandId],
                       ["طراز المركبة", formData.CarNameId],
                       ["لون المركبة", formData.CarColor],
                       ["رقم المركبة", formData.PlateNumber],
                       ["رقم الشاصي", formData.ChassisNumber],
                       ["الموديل", formData.CarModel],
                       ["نوع المحرك", formData.EngineType],
                       ["عدد السلندر", formData.EngineCylindersNumber],
                       ["عدد المحاور", formData.VehicleAxlesNumber],
                       ["عدد الركاب", formData.SeatsNumber],
                     ]
                       .map(
                         ([label, value]) =>
                           `
                           <div class="flex items-center py-0.5 border-black">
                             <span class="font-bold text-md w-1/3">${label} :</span>
                             <span class="font-bold text-md w-2/3 px-1 border border-black rounded">${value || "---"}</span>
                           </div>
                           `
                       )
                       .join("")}
                       
                   </div>
                 </div>
                 <div class="border border-black grid grid-cols-2 rounded-lg p-2" >
                 <!-- Vehicle Image -->
                   <div class="w-full max-w-100 h-auto p-0 dir="ltr"">
                        <img src="${imgStaticBase64}" class="object-contain w-full h-full rounded-md p-0.5 border border-white" />
                     </div>
  
                    <div class="border border-white grid grid-rows-2 rounded-lg p-2">
                      <div class="w-full max-w-100 h-auto p-0" dir="rtl">
                        ${carCroppedImage ? (
                          `<img
                            src=${URL.createObjectURL(carCroppedImage)}
                            alt="صورة السيارة المقصوصة"
                            class="object-contain w-full h-full rounded-md p-0.5 border border-black"
                          />`
                        ) : (
                          "صورة السيارة المقصوصة"
                        )}
                      </div>
                      <div class="w-full max-w-100 h-auto p-0" dir="rtl">
                        ${chassisCroppedImage ? (
                          `<img
                            src=${URL.createObjectURL(chassisCroppedImage)}
                            alt="صورة الشاصي المقصوصة"
                            class="object-contain w-full h-full rounded-md p-0.5 border border-black"
                          />`
                        ) : (
                          "صورة الشاصي المقصوصة"
                        )}
                      </div>
                    </div>
  
                   <div class="border border-black  rounded-lg p-2 min-h-40" >
                     <span class="font-bold text-md text-center w-1/3">الفاحص : 
                     </span> 
                   </div>
                   <div class="border border-black  rounded-lg p-2 min-h-40" >
                     <span class="font-bold text-md text-center w-1/3">الفاحص :
                   </span> 
                   </div>
                   </div>
                  </div> 
               </body>
               </html>
          `);
          doc.close();
  
          setTimeout(() => {
            printFrame.contentWindow.print();
            document.body.removeChild(printFrame);
          }, 500);
        })
        .catch((error) => console.error("Error generating QR code:", error));
    };
  
    const handlePrintForTruck = (data) => {
      if (!data) return;
      const imgStaticBase64 = imgStaticTruck;
  
      const qrData = JSON.stringify({
        ADDID: data.applicationId,
        ISSD: data.issueDate,
        TFPN: data.TrafficPoliceApplicationId,
        RID: data.ReceiptId,
        CON: data.CarOwnerName,
        IG: data.Governmental,
        CN: data.ChassisNumber,
        PN: data.PlateNumber,
        CYC: data.EngineCylindersNumber,
        VAXN: data.VehicleAxlesNumber,
        COM: data.CarModel,
        SEAN: data.SeatsNumber,
        VN: data.CarNameId,
        VC: data.CarColorId,
        VB: data.CarBrandId,
        VT: data.VehicleType,
        USE: data.Usage,
        AGN: data.agency,
        LN: data.location,
        VID: data.vehicleId,
        ENT: data.EngineType,
        IIC: data.isInspectionCertified,
        SN: data.stickerNumber,
        SP: data.stickerProvider,
      });
  
      QRCode.toDataURL(qrData)
        .then((qrCodeDataUrl) => {
          const printFrame = document.createElement('iframe');
          printFrame.style.display = 'none';
          document.body.appendChild(printFrame);
  
          const doc = printFrame.contentDocument || printFrame.contentWindow.document;
          doc.open();
          doc.write(`
            <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>شهادة فحص المركبة</title>
          <link href="/tailwind.css" rel="stylesheet">
          <style>
             @media print {
            @page {
              size: A4 portrait;
            }
              body {
                font-family: Arial, sans-serif;
                direction: rtl;
              }
            }
          </style>
        </head>
        <body class="bg-white w-[210mm] h-[148mm] p-6 text-right">
        <!-- Header -->
        <div class="flex items-center justify-between border-b-2 border-black pb-2 w-full" dir="rtl">
          <!-- Left-side Titles -->
          <div class="flex flex-col items-center w-1/4 text-sm space-y-2">
            <h1 class="text-2xl font-bold text-black-800">جمهورية العراق</h1>
            <h1 class="text-xl font-bold text-black-800">وزارة الداخلية</h1>
          </div>
        
          <!-- Centered Section (QR Code and Logo) -->
          <div class="relative flex items-center justify-center w-1/2">
            <!-- QR Code (Left) -->
            <div class="w-24 mb-2 absolute right-0 mr-4">
              <img src="${qrCodeDataUrl}" alt="QR Code" class="w-auto h-auto" />
            </div>
        
            <!-- Logo (Centered) -->
            <div class="mb-2 mx-auto absolute left-6 ml-10">
              <img src="${logo}" alt="Logo" class="w-24 h-auto" />
            </div>
          </div>
        
          <!-- Right-side Details -->
          <div class="flex flex-col items-start w-2/5 text-sm text-right font-semibold">
            <!-- كل سطر راح يكون grid مكون من عمودين -->
            <div class="grid grid-cols-2 w-full"> <!-- زيادة المسافة الأفقية هنا -->
              <!-- العمود الأول للنصوص الثابتة -->
              <div class="flex flex-col text-black-800"> <!-- زيادة المسافة الجانبية هنا -->
                <span>رقم استمارة الفحص</span> 
                <span>رقم وصل القبض</span>
                <span>اسم الموقع</span>
                <span>تاريخ الاصدار</span>
              </div>
        
              <!-- العمود الثاني للقيم المتغيرة -->
              <div class="flex flex-col text-black-800 font-bold text-right">
                <span>: ${localStorage.getItem("location")}-${data.applicationId}</span>
                <span>: ${formData.ReceiptId}</span>
                <span>: ${localStorage.getItem("agency")}</span>
                <span>: ${formatDate(data.issueDate)}</span>
             
              </div>
            </div>
          </div>
        
        </div>
             <!-- Main Content with Grid -->
  <div class="grid grid-cols-3 gap-2 mt-2">
    <!-- Vehicle Data (Left) -->
    <div class="border border-black rounded-lg p-1 relative col-span-2" dir="rtl">
      <h3 class="bg-gray-200 text-center font-bold">بيانات المركبة</h3>
      <div class="text-sm">
        ${[
          [
            `<div class="flex justify-between w-full py-0.5 border-black">
              <span class="font-bold text-center text-md w-1/3">نوع المركبة</span>
              <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.CarBrandId || "---"}</span>
              <span class="font-bold text-center text-md w-1/3">طراز المركبة</span>
              <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.CarNameId || "---"}</span>
            </div>`,
            null,
          ],
  
          [
            `<div class="flex justify-between w-full py-0.5 border-black">
              <span class="font-bold text-center text-md w-1/3">لون المركبة</span>
              <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.CarColor || "---"}</span>
              <span class="font-bold text-center text-md w-1/3">نوع المحرك</span>
              <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.EngineType || "---"}</span>
            </div>`,
            null,
          ],
          [
            `<div class="flex justify-between w-full py-0.5 border-black">
              <span class="font-bold text-center text-md w-1/3">الاستخدام</span>
              <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${formData.Usage || "---"}</span>
              <span class="font-bold text-center text-md w-1/3">الموديل</span>
              <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${formData.CarModel || "---"}</span>
              <span class="font-bold text-center text-md w-1/3">عدد السلندر</span>
              <span class="font-bold text-md w-1/2 px-1 border border-black rounded">${formData.EngineCylindersNumber || "---"}</span>
            </div>`,
            null,
          ],
          ["اسم المالك", ownerFullName],
          ["رقم المركبة", formData.PlateNumber],
          ["رقم الشاصي", formData.ChassisNumber],
  
           // بيانات الملحق الأول
           [
            `<div class="border-black">
              <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الأول</h3>
              ${[
                [
                  `<div class="flex justify-between w-full py-0.5 border-black">
                    <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[0]?.Category || "---"}</span>
                    <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[0]?.TrailerChassisNumber  || "---"}</span>
                  </div>`,
                  null,
                ],
                [
                  `<div class="flex justify-between w-full border-black">
                    <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[0]?.TrailerAxlesNumber  || "---"}</span>
                    <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[0]?.LoadWeight  || "---"}</span>
                  </div>`,
                  null,
                ],
              ].map(([content]) => content).join('')}
            </div>`,
            null
          ],
  
          // بيانات الملحق الثاني
          [
            `<div class="border-black">
              <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الثاني</h3>
              ${[
                [
                  `<div class="flex justify-between w-full py-0.5 border-black">
                    <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[1]?.Category || "---"}</span>
                    <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[1]?.TrailerChassisNumber  || "---"}</span>
                  </div>`,
                  null,
                ],
                [
                  `<div class="flex justify-between w-full border-black">
                    <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[1]?.TrailerAxlesNumber  || "---"}</span>
                    <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[1]?.LoadWeight  || "---"}</span>
                  </div>`,
                  null,
                ],
              ].map(([content]) => content).join('')}
            </div>`,
            null
          ],
  
          // بيانات الملحق الثالث
          [
            `<div class="border-black">
              <h3 class="bg-gray-200 text-center font-semibold text-sm">بيانات الملحق الثالث</h3>
              ${[
                [
                  `<div class="flex justify-between w-full py-0.5 border-black">
                    <span class="font-bold text-center text-md w-1/3">نوع الحمل</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[2]?.Category || "---"}</span>
                    <span class="font-bold text-center text-md w-1/3">شاصي الحمل</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[2]?.TrailerChassisNumber  || "---"}</span>
                  </div>`,
                  null,
                ],
                [
                  `<div class="flex justify-between w-full border-black">
                    <span class="font-bold text-center text-md w-1/3">عدد المحاور</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[2]?.TrailerAxlesNumber  || "---"}</span>
                    <span class="font-bold text-center text-md w-1/3">الحمولة</span>
                    <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${formData.TrailerData[2]?.LoadWeight  || "---"}</span>
                  </div>`,
                  null,
                ],
              ].map(([content]) => content).join('')}
            </div>`,
            null
          ],
        ]
          .map(([label, value]) =>
            value !== null
              ? `
                <div class="flex justify-between items-center py-0.5 border-black">
                  <span class="font-bold text-center text-md w-1/3">${label} :</span>
                  <span class="font-bold text-md w-3/4 px-1 border border-black rounded">${value || "---"}</span>
                </div>
              `
              : label
          )
          .join("")}
      </div>
  
    </div>
            <!-- Vehicle Image -->
              
               <div class="border border-white grid grid-rows-2 rounded-lg p-2">
                      <div class="w-full max-w-100 h-auto p-0" dir="rtl">
                        ${carCroppedImage ? (
                          `<img
                            src=${URL.createObjectURL(carCroppedImage)}
                            alt="صورة السيارة المقصوصة"
                            class="object-contain w-full h-full rounded-md p-0.5 border border-black"
                          />`
                        ) : (
                          "صورة السيارة المقصوصة"
                        )}
                      </div>
                      <div class="w-full max-w-100 h-auto p-0" dir="rtl">
                        ${chassisCroppedImage ? (
                          `<img
                            src=${URL.createObjectURL(chassisCroppedImage)}
                            alt="صورة الشاصي المقصوصة"
                            class="object-contain w-full h-full rounded-md p-0.5 border border-black"
                          />`
                        ) : (
                          "صورة الشاصي المقصوصة"
                        )}
                      </div>
                </div>
            </div>
      <div class="border border-black rounded-lg p-2 w-full mt-4 mx-auto">
      <div class="h-auto p-0 w-full">
          <img src="${imgStaticBase64}" 
               class="w-full h-auto object-scale-down mx-auto" 
               style="max-width: 90% !important;
                      display: block !important;
                      margin: 0 auto !important;" />
      </div>
  </div>
          </body>
          </html>
          `);
          doc.close();
  
          setTimeout(() => {
            printFrame.contentWindow.print();
            document.body.removeChild(printFrame);
          }, 500);
        })
        .catch((error) => console.error("Error generating QR code:", error));
    };
  
    const handlePrintForBike = (data) => {
      if (!data) return;
      const imgStaticBase64 = imgStaticBike;
  
      const qrData = JSON.stringify({
        ADDID: data.applicationId,
        ISSD: data.issueDate,
        TFPN: data.TrafficPoliceApplicationId,
        RID: data.ReceiptId,
        CON: data.CarOwnerName,
        IG: data.Governmental,
        CN: data.ChassisNumber,
        PN: data.PlateNumber,
        CYC: data.EngineCylindersNumber,
        VAXN: data.VehicleAxlesNumber,
        COM: data.CarModel,
        SEAN: data.SeatsNumber,
        VN: data.CarNameId,
        VC: data.CarColorId,
        VB: data.CarBrandId,
        VT: data.VehicleType,
        USE: data.Usage,
        AGN: data.agency,
        LN: data.location,
        VID: data.vehicleId,
        ENT: data.EngineType,
        IIC: data.isInspectionCertified,
        SN: data.stickerNumber,
        SP: data.stickerProvider,
      });
  
      QRCode.toDataURL(qrData)
        .then((qrCodeDataUrl) => {
          const printFrame = document.createElement('iframe');
          printFrame.style.display = 'none';
          document.body.appendChild(printFrame);
  
          const doc = printFrame.contentDocument || printFrame.contentWindow.document;
          doc.open();
          doc.write(
            `<!DOCTYPE html>
              <html lang="ar" dir="rtl">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>شهادة فحص المركبة</title>
                <link href="/tailwind.css" rel="stylesheet">
                <style>
                  @media print {
                    @page {
                      size: A4 portrait;
                    }
                    body {
                      font-family: Arial, sans-serif;
                      direction: rtl;
                    }
                  }
                </style>
              </head>
              <body class="bg-white w-[210mm] h-[148mm] p-6 text-right">
                <!-- Header -->
                <div class="flex items-center justify-between border-b-2 border-black pb-2 w-full" dir="rtl">
                  <div class="flex flex-col items-center w-1/4 text-sm space-y-2">
                    <h1 class="text-2xl font-bold text-black-800">جمهورية العراق</h1>
                    <h1 class="text-xl font-bold text-black-800">وزارة الداخلية</h1>
                  </div>
          
                  <!-- Center QR and Logo -->
                  <div class="relative flex items-center justify-center w-1/2">
                    <div class="w-24 mb-2 absolute right-0 mr-4">
                      <img src="${qrCodeDataUrl}" alt="QR Code" class="w-auto h-auto" />
                    </div>
                    <div class="mb-2 mx-auto absolute left-6 ml-10">
                      <img src="${logo}" alt="Logo" class="w-24 h-auto" />
                    </div>
                  </div>
          
                  <!-- Right-side Details -->
                  <div class="flex flex-col items-start w-2/5 text-sm text-right font-semibold">
                    <div class="grid grid-cols-2 w-full">
                      <div class="flex flex-col text-black-800">
                        <span>رقم استمارة الفحص</span> 
                        <span>رقم وصل القبض</span>
                        <span>اسم الموقع</span>
                        <span>تاريخ الاصدار</span>
                      </div>
                      <div class="flex flex-col text-black-800 font-bold text-right">
                        <span>: ${localStorage.getItem("location")}-${data.applicationId}</span>
                        <span>: ${formData.ReceiptId}</span>
                        <span>: ${localStorage.getItem("agecny")}</span>
                        <span>: ${formatDate(data.issueDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
          
                <!-- Vehicle Data Section -->
                <div class="border border-black rounded-lg p-1 mt-1">
                  <h3 class="bg-gray-200 text-center font-bold py-0.5">بيانات المركبة</h3>
                  <div class="grid grid-cols-2 gap-2 text-md">
                    ${[
                      ["اسم المالك", ownerFullName],
                      ["نوع المركبة", formData.CarBrandId],
                      ["طراز المركبة", formData.CarNameId],
                      ["لون المركبة", formData.CarColor],
                      ["رقم المركبة", formData.PlateNumber],
                      ["رقم الشاصي", formData.ChassisNumber],
                      ["الموديل", formData.CarModel],
                      ["نوع المحرك", formData.EngineType],
                      ["عدد السلندر", formData.EngineCylindersNumber],
                      ["عدد المحاور", formData.VehicleAxlesNumber],
                      ["عدد الركاب", formData.SeatsNumber],
                    ]
                      .map(
                        ([label, value]) =>
                          `
                          <div class="flex items-center py-0.5 border-black">
                            <span class="font-bold text-md w-1/3">${label} :</span>
                            <span class="font-bold text-md w-2/3 px-1 border border-black rounded">${value || "---"}</span>
                          </div>
                          `
                      )
                      .join("")}
                      
                  </div>
                </div>
                <div class="border border-black grid grid-cols-2 rounded-lg p-2" >
                <!-- Vehicle Image -->
                  <div class="w-full max-w-100 h-auto p-0 dir="ltr"">
                       <img src="${imgStaticBase64}" class="object-contain w-full h-full rounded-md p-0.5 border border-white" />
                    </div>
                   <div class="border border-white grid grid-rows-2 rounded-lg p-2" >
                                     <div class="border border-white grid grid-rows-2 rounded-lg p-2">
                      <div class="w-full max-w-100 h-auto p-0" dir="rtl">
                        ${carCroppedImage ? (
                          `<img
                            src=${URL.createObjectURL(carCroppedImage)}
                            alt="صورة السيارة المقصوصة"
                            class="object-contain w-full h-full rounded-md p-0.5 border border-black"
                          />`
                        ) : (
                          "صورة السيارة المقصوصة"
                        )}
                      </div>
                      <div class="w-full max-w-100 h-auto p-0" dir="rtl">
                        ${chassisCroppedImage ? (
                          `<img
                            src=${URL.createObjectURL(chassisCroppedImage)}
                            alt="صورة الشاصي المقصوصة"
                            class="object-contain w-full h-full rounded-md p-0.5 border border-black"
                          />`
                        ) : (
                          "صورة الشاصي المقصوصة"
                        )}
                      </div>
                    </div>
                  </div>
                  <div class="border border-black  rounded-lg p-2 min-h-40" >
                    <span class="font-bold text-md text-center w-1/3">الفاحص : 
                    </span> 
                  </div>
                  <div class="border border-black  rounded-lg p-2 min-h-40" >
                    <span class="font-bold text-md text-center w-1/3">الفاحص :
                  </span> 
                  </div>
                  </div>
                  
                  </div>
                  
              </body>
              </html>`);
              doc.close();
      
              setTimeout(() => {
                printFrame.contentWindow.print();
                document.body.removeChild(printFrame);
              }, 500);
            })
            .catch((error) => console.error("Error generating QR code:", error));
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
  

  return (
    <Dialog open={true} onClose={() => {}} dir="rtl" className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-lg" />
      <div className="fixed inset-0 flex items-center justify-center p-6">
        <Dialog.Panel className="w-full max-w-7xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center">
            <Dialog.Title className="text-2xl font-bold text-gray-800">إنشاء استمارة جديدة</Dialog.Title>
            <button onClick={() => navigate('/forms')} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
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
                <InputField 
                  label="رقم استمارة المرور"
                  name="TrafficPoliceApplicationId"
                  value={formData.TrafficPoliceApplicationId}
                  onChange={handleChange}
                  required
                />
                
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
                      placeholder={formData.CarBrandId || "اختر نوع المركبة"}
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
                      placeholder={formData.CarNameId || "اختر اسم المركبة"}
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
                      placeholder={formData.CarColor || "اختر لون المركبة"}
                      disabled={lockedFields} // يمكن تعديله إذا فُتح القفل
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
                    disabled={formData.EngineType === 'كهربائي' && lockedFields} 
                  />

                  <InputField
                    label="عدد المحاور"
                    name="VehicleAxlesNumber"
                    value={formData.VehicleAxlesNumber}
                    onChange={handleChange}
                    disabled={lockedFields} // يمكن تعديله إذا فُتح القفل
                  />

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

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-right mb-2 font-medium text-gray-700">رمز المحافظة</label>
                      <Select
                        options={provinceOptions}
                        placeholder={provinceOptions.find(option => option.value === provinceCode)?.label || "اختر رمز المحافظة"}
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
                        placeholder={plateLetter}
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
                        placeholder={plateNumber}
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
                    disabled={true} // دائمًا مقفل
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