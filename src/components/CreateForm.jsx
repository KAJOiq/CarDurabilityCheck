import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import CameraComponent from "./CameraComponent";
import { useNavigate } from "react-router-dom";

const CreateForm = ({ formType, setFormType }) => {
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [photo3, setPhoto3] = useState(null);
  const [showChassisModal, setShowChassisModal] = useState(false);
  const [showFrontModal, setShowFrontModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    vehicleModel: "",
    vehicleType: "",
    vehicleColor: "",
    vehicleNumber: "",
    vehicleCategory: "",
    isGovernment: false,
    chassisNumber: "",
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

  const navigate = useNavigate();

  const handlePhoto1Change = (photoData) => {
    setPhoto1(photoData);
  };

  const handlePhoto2Change = (photoData) => {
    setPhoto2(photoData);
  };

  const handlePhoto3Change = (photoData) => {
    setPhoto3(photoData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    const updatedFormData = {
      ...formData,
      photo1: photo1,
      photo2: photo2,
      photo3: photo3
    };

    localStorage.setItem("formData", JSON.stringify(updatedFormData));
    navigate("/view-data");
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

  const handleSearch = (searchTerm) => {
    console.log(searchTerm);
    // Add your API call or search logic here
  };

  return (
    <div className="bg-slate-200 p-8 rounded-2xl shadow-md w-full h-full mt-10">
      <h1 className="text-2xl font-bold mb-6 text-right">انشاء استمارة</h1>
      <form className="grid grid-cols-2 gap-4 relative">
        {/* ...existing form fields... */}
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

             {/* Chassis Photo Section */}
             
        <div className="col-span-2 bg-purple-200 p-4 rounded-2xl">
            
          <label className="text-right font-medium mb-1 block">
            <i className="fas fa-camera mr-2"></i> صورة الشاصي
          </label>
          <button
            type="button"
            onClick={() => setShowChassisModal(true)}
            className="w-full py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
          >
            إضافة صورة
          </button>
          {showChassisModal && (
            <div className="fixed -inset-full bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
                <CameraComponent setPhoto={handlePhoto1Change} />
                <button
                  onClick={() => setShowChassisModal(false)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
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
{/* Front Photo Section */}
<div className="col-span-2 bg-indigo-200 p-4 rounded-2xl">
          <label className="text-right font-medium mb-1 block">
            <i className="fas fa-camera mr-2"></i> صورة مقدّمة السيارة
          </label>
          <button
            type="button"
            onClick={() => setShowFrontModal(true)}
            className="w-full py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600"
          >
            إضافة صورة
          </button>
          {showFrontModal && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
                <CameraComponent setPhoto={handlePhoto2Change} />
                <button
                  onClick={() => setShowFrontModal(false)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
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

        {/* Receipt Photo Section */}
        {!formData.isGovernment && (
          <div className="col-span-2 bg-purple-200 p-4 rounded-2xl">
            <label className="text-right font-medium mb-1 block">
              <i className="fas fa-camera mr-2"></i> صورة وصل القبض
            </label>
            <button
              type="button"
              onClick={() => setShowReceiptModal(true)}
              className="w-full py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
            >
              إضافة صورة
            </button>
            {showReceiptModal && (
              <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
                <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
                  <CameraComponent setPhoto={handlePhoto3Change} />
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            )}
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
        </>
            
      </form>
    </div>
  );
};

export default CreateForm;
