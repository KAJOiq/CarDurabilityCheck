import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import CameraComponent from "./CameraComponent";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Link } from "react-router-dom";
import SearchModal from "./SearchModal";

const Form = ({ formType, setFormType }) => {
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // State for modal visibility

  const [formData, setFormData] = useState({
    customerName: "",
    vehicleModel: "",
    vehicleType: "",
    vehicleColor: "",
    vehicleNumber: "",
    vehicleCategory: "",
    isGovernment: false,
    chassisNumber: "",
    //isRepeated: false,
    // repeatReason: "",
    model: "",
    cylinderCount: "",
    receiptNumber: "",
    trafficFormNumber: "",
    formType: "",
    numberOfPassengers: "", // Specific for Car
    load: "", // Specific for Truck
    attachedLoadType: "", // Specific for Truck
    attachedChassis: "", // Specific for Truck
    numberOfAttachedVehicles: "", // Specific for Truck
    numberOfAxes: ""
  });

  const navigate = useNavigate(); // For navigation
  const handlePhoto1Change = (photoData) => {
    setPhoto1(photoData); // Update photo1 with the captured image
  };

  const handlePhoto2Change = (photoData) => {
    setPhoto2(photoData); // Update photo2 with the captured image
  };

  const handlePhoto3Change = (photoData) => {
    setPhoto3(photoData); // Update photo3 with the captured image
  };

  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error("Error parsing saved data", error);
      }
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // Add photo1 and photo2 to formData if they exist
    const updatedFormData = {
      ...formData,
      photo1: photo1, 
      photo2: photo2,
      photo3: photo3  
    };
  
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
    navigate("/view-data"); // Navigate to the view data page
  };

  const handleSearch = (searchTerm) => {
    console.log(searchTerm);
    // Add your API call or search logic here
  };

  return (
    <div className="bg-slate-200 p-8 rounded-2xl shadow-md w-full h-full mt-10">
      <h1 className="text-2xl font-bold mb-6 text-right">الاستمارات</h1>
      <div className="flex justify-end mb-4 space-x-4">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 flex items-center"
          onClick={() => setIsSearchModalOpen(true)}
        >
          البحث عن استمارة لطباعتها
        </button>
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
        onSearch={handleSearch} 
      />
      <Link to="/entry" className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 flex items-center">
          انشاء استمارة
      </Link>
      </div>
      
      <form className="grid grid-cols-2 gap-4">
          <>
            <div className="col-span-2 bg-blue-200 p-4 rounded-2xl">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-file-alt mr-2"></i> نوع الاستمارة
              </label>
              <select
                name="formType"
                value={formData.formType}
                onChange={handleChange}
                className="w-full p-2 border rounded-2xl"
                required
              >
                <option value="">اختر نوع الاستمارة</option>
                <option value="سيارة">سيارة</option>
                <option value="دراجة">دراجة</option>
                <option value="شاحنة">شاحنة</option>
              </select>
            </div>
            {formData.formType && (
            <>
            <div className="bg-green-200 p-4 rounded-2xl">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-car mr-2"></i> نوع المركبة
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full p-2 border rounded-2xl"
                required
              >
                <option value="">اختر نوع المركبة</option>
                <option value="type1">نوع 1</option>
                <option value="type2">نوع 2</option>
                <option value="type3">نوع 3</option>
              </select>
            </div>
            <div className="bg-yellow-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-user mr-2"></i> اسم المواطن</>}
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-green-200 p-4 rounded-2xl">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-car mr-2"></i> طراز المركبة
              </label>
              <select
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="w-full p-2 border rounded-2xl"
                required
              >
                <option value="">اختر طراز المركبة</option>
                <option value="model1">طراز 1</option>
                <option value="model2">طراز 2</option>
                <option value="model3">طراز 3</option>
                <option value="model4">طراز 4</option>
              </select>
            </div>
            <div className="bg-purple-200 p-4 rounded-2xl">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-palette mr-2"></i> لون المركبة
              </label>
              <select
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleChange}
                className="w-full p-2 border rounded-2xl"
                required
              >
                <option value="">اختر لون المركبة</option>
                <option value="red">أحمر</option>
                <option value="blue">أزرق</option>
                <option value="green">أخضر</option>
                <option value="black">أسود</option>
                <option value="white">أبيض</option>
              </select>
            </div>
            {formData.formType === "سيارة" && (
            <>
            <div className="bg-purple-200 p-4 rounded-2xl">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-palette mr-2"></i> فئة المركبة
              </label>
              <select
                name="vehicleCategory"
                value={formData.vehicleCategory}
                onChange={handleChange}
                className="w-full p-2 border rounded-2xl"
                required
              >
                <option value="">اختر فئة المركبة</option>
                <option value="خصوصي">خصوصي</option>
                <option value="اجرة">اجرة</option>
              </select>
            </div>
            </>
            )}
            <div className="bg-green-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-users mr-2"></i> عدد الركاب</>}
                name="numberOfPassengers"
                value={formData.numberOfPassengers}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-indigo-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-hashtag mr-2"></i> رقم المركبة</>}
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-pink-200 p-4 rounded-2xl">
              <CheckboxField
                label={<><i className="fas fa-building mr-2"></i> حكومي؟</>}
                name="isGovernment"
                checked={formData.isGovernment}
                onChange={handleChange}
              />
            </div>
            <div className="bg-teal-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-barcode mr-2"></i> رقم الشاصي</>}
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-purple-200 p-4 rounded-2xl">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-palette mr-2"></i> الموديل
              </label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border rounded-2xl"
                required
              >
                <option value="">اختر موديل السيارة</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
              </select>
            </div>
            <div className="bg-green-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-cogs mr-2"></i> عدد السلندر</>}
                name="cylinderCount"
                value={formData.cylinderCount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-green-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-users mr-2"></i> عدد المحاور</>}
                name="numberOfAxes"
                value={formData.numberOfAxes}
                onChange={handleChange}
                required
              />
            </div>
            {formData.formType === "شاحنة" && (
              <>
                <div className="bg-yellow-200 p-4 rounded-2xl">
                  <InputField
                    label={<><i className="fas fa-weight-hanging mr-2"></i> الحمولة</>}
                    name="load"
                    value={formData.load}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="bg-teal-200 p-4 rounded-2xl">
                  <InputField
                    label={<><i className="fas fa-tags mr-2"></i> نوع الحمولة المرفقة</>}
                    name="attachedLoadType"
                    value={formData.attachedLoadType}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="bg-purple-200 p-4 rounded-2xl">
                  <InputField
                    label={<><i className="fas fa-barcode mr-2"></i> شاصي الحمولة المرفقة (إن وجد)</>}
                    name="attachedChassis"
                    value={formData.attachedChassis}
                    onChange={handleChange}
                  />
                </div>
                <div className="bg-orange-200 p-4 rounded-2xl">
                  <InputField
                    label={<><i className="fas fa-trailer mr-2"></i> عدد المركبات المرفقة</>}
                    name="numberOfAttachedVehicles"
                    value={formData.numberOfAttachedVehicles}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            {!formData.isGovernment && (
              <div className="bg-yellow-200 p-4 rounded-2xl">
                <InputField
                  label={
                    <>
                      <i className="fas fa-receipt mr-2"></i> رقم وصل القبض
                    </>
                  }
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="bg-red-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-file-alt mr-2"></i> رقم استمارة المرور</>}
                name="trafficFormNumber"
                value={formData.trafficFormNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2 bg-purple-200 p-4 rounded-2xl">
              <label className="text-right font-medium mb-1 block">
                <i className="fas fa-camera mr-2"></i> صورة الشاصي
              </label>
              <CameraComponent setPhoto={handlePhoto1Change} />
              {photo1 && (
                <div className="mt-4">
                  <h2 className="text-right font-medium mb-2">الصورة الملتقطة:</h2>
                  <img
                    src={photo1}
                    alt="Captured Chassis"
                    className="w-full h-auto border rounded-2xl"
                  />
                </div>
              )}
            </div>

            <div className="col-span-2 bg-indigo-200 p-4 rounded-2xl">
              <label className="text-right font-medium mb-1 block">
                <i className="fas fa-camera mr-2"></i> صورة مقدّمة السيارة
              </label>
              <CameraComponent setPhoto={handlePhoto2Change} />
              {photo2 && (
                <div className="mt-4">
                  <h2 className="text-right font-medium mb-2">الصورة الملتقطة:</h2>
                  <img
                    src={photo2}
                    alt="Captured Front"
                    className="w-full h-auto border rounded-2xl"
                  />
                </div>
              )}
            </div>
            {!formData.isGovernment && (
            <div className="col-span-2 bg-purple-200 p-4 rounded-2xl">
              <label className="text-right font-medium mb-1 block">
                <i className="fas fa-camera mr-2"></i> صورة وصل القبض
              </label>
              <CameraComponent setPhoto={handlePhoto3Change} />
              {photo3 && (
                <div className="mt-4">
                  <h2 className="text-right font-medium mb-2">الصورة الملتقطة:</h2>
                  <img
                    src={photo3}
                    alt="Captured receiptNumber"
                    className="w-full h-auto border rounded-2xl"
                  />
                </div>
              )}
            </div>
            )}
            <div className="col-span-2 text-center mt-4">
              <button
                type="button"
                className="bg-green-500 text-white px-6 py-3 rounded-2xl hover:bg-green-600"
                onClick={handleSave}
              >
                حفظ الاستمارة
              </button>
            </div>
          </>
        )}

        {formType === "inquiry" && (
          <>
            <div className="bg-blue-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-hashtag mr-2"></i> رقم المركبة</>}
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-green-200 p-4 rounded-2xl">
              <InputField
                label={<><i className="fas fa-barcode mr-2"></i> رقم الشاصي</>}
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        </>
      
      </form>
    </div>
    
  );
};

export default Form;