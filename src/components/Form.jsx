import React, { useState } from "react";
import InputField from "./InputField";
import CheckboxField from "./CheckboxField";
import CameraComponent from "./CameraComponent";
import CarForm from "./CarForm";
import TruckForm from "./TruckForm";

const Form = ({ formType, setFormType }) => {
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [isRepeated, setIsRepeated] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    vehicleModel: "",
    vehicleType: "",
    vehicleColor: "",
    vehicleNumber: "",
    isGovernment: false,
    chassisNumber: "",
    repeatReason: "",
    model: "",
    cylinderCount: "",
    receiptNumber: "",
    trafficFormNumber: "",
    formType: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full h-full mt-10">
      <h1 className="text-2xl font-bold mb-6 text-right">الاستمارات</h1>
      <div className="flex justify-end mb-4 space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          onClick={() => setFormType("entry")}
        >
          <i className="fas fa-plus mr-2"></i> إضافة استمارة
        </button>
        <CarForm formData={formData} photo1={photo1} photo2={photo2} />
      </div>

      <form className="grid grid-cols-2 gap-4">
        {formType === "entry" && (
          <>
            <div className="col-span-2 bg-blue-200 p-4 rounded">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-file-alt mr-2"></i> نوع الاستمارة
              </label>
              <select
                name="formType"
                value={formData.formType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">اختر نوع الاستمارة</option>
                <option value="سيارة">سيارة</option>
                <option value="دراجة">دراجة</option>
                <option value="شاحنة">شاحنة</option>
              </select>
            </div>
            <div className="bg-green-200 p-4 rounded">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-car mr-2"></i> نوع المركبة
              </label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">اختر نوع المركبة</option>
                <option value="type1">نوع 1</option>
                <option value="type2">نوع 2</option>
                <option value="type3">نوع 3</option>
              </select>
            </div>
            <div className="bg-yellow-200 p-4 rounded">
              <InputField
                label={<><i className="fas fa-user mr-2"></i> اسم المواطن</>}
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-green-200 p-4 rounded">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-car mr-2"></i> طراز المركبة
              </label>
              <select
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">اختر طراز المركبة</option>
                <option value="model1">طراز 1</option>
                <option value="model2">طراز 2</option>
                <option value="model3">طراز 3</option>
                <option value="model4">طراز 4</option>
              </select>
            </div>
            <div className="bg-purple-200 p-4 rounded">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-palette mr-2"></i> لون المركبة
              </label>
              <select
                name="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
            <div className="bg-indigo-200 p-4 rounded">
              <InputField
                label={<><i className="fas fa-hashtag mr-2"></i> رقم المركبة</>}
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-pink-200 p-4 rounded">
              <CheckboxField
                label={<><i className="fas fa-building mr-2"></i> حكومي؟</>}
                name="isGovernment"
                checked={formData.isGovernment}
                onChange={handleChange}
              />
            </div>
            <div className="bg-teal-200 p-4 rounded">
              <InputField
                label={<><i className="fas fa-barcode mr-2"></i> رقم الشاصي</>}
                name="chassisNumber"
                value={formData.chassisNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-orange-200 p-4 rounded">
              <CheckboxField
                label={<><i className="fas fa-exclamation-circle mr-2"></i> مكرر؟</>}
                name="isRepeated"
                checked={isRepeated}
                onChange={(e) => setIsRepeated(e.target.checked)}
              />
            </div>

            {isRepeated && (
              <div className="col-span-2 bg-gray-200 p-4 rounded">
                <InputField
                  label={<><i className="fas fa-exclamation-triangle mr-2"></i> سبب التكرار</>}
                  name="repeatReason"
                  value={formData.repeatReason}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="bg-purple-200 p-4 rounded">
              <label className="block text-right font-medium mb-1">
                <i className="fas fa-palette mr-2"></i> الموديل
              </label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
            <div className="bg-green-200 p-4 rounded">
              <InputField
                label={<><i className="fas fa-cogs mr-2"></i> عدد السلندر</>}
                name="cylinderCount"
                value={formData.cylinderCount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-yellow-200 p-4 rounded">
              <InputField
                label={<><i className="fas fa-receipt mr-2"></i> رقم وصل القبض</>}
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-red-200 p-4 rounded">
              <InputField
                label={<><i className="fas fa-file-alt mr-2"></i> رقم استمارة المرور</>}
                name="trafficFormNumber"
                value={formData.trafficFormNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2 bg-purple-200 p-4 rounded">
              <label className="text-right font-medium mb-1 block">
                <i className="fas fa-camera mr-2"></i> صورة الشاصي
              </label>
              <CameraComponent setPhoto={setPhoto1} />
              {photo1 && (
                <div className="mt-4">
                  <h2 className="text-right font-medium mb-2">الصورة الملتقطة:</h2>
                  <img
                    src={photo1}
                    alt="Captured Chassis"
                    className="w-full h-auto border rounded"
                  />
                </div>
              )}
            </div>

            <div className="col-span-2 bg-indigo-200 p-4 rounded">
              <label className="text-right font-medium mb-1 block">
                <i className="fas fa-camera mr-2"></i> صورة مقدّمة السيارة
              </label>
              <CameraComponent setPhoto={setPhoto2} />
              {photo2 && (
                <div className="mt-4">
                  <h2 className="text-right font-medium mb-2">الصورة الملتقطة:</h2>
                  <img
                    src={photo2}
                    alt="Captured Front"
                    className="w-full h-auto border rounded"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {formType === "inquiry" && (
          <>
            <div className="bg-blue-200 p-4 rounded">
              <InputField
                label={<><i className="fas fa-hashtag mr-2"></i> رقم المركبة</>}
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-green-200 p-4 rounded">
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
      </form>
    </div>
  );
};

export default Form;