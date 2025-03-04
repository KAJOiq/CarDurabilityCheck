import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";
import DropDownListTemplate from "./DropDownListTemplate"; // تأكد من استيراد المكون

const EditFormModal = ({ isOpen, onClose, formData }) => {
  const [editedData, setEditedData] = useState(formData);
  const [formErrors, setFormErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropdownSelect = (field, item) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: item.id, // تخزين المعرف فقط
    }));
  };

  const handleTrailerChange = (index, field, value) => {
    const updatedTrailers = [...editedData.updateTrailerDTO];
    updatedTrailers[index][field] = value;
    setEditedData((prevData) => ({
      ...prevData,
      updateTrailerDTO: updatedTrailers,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchData("user/application/repeat-application", {
        method: "POST",
        body: JSON.stringify(editedData),
      });

      if (response.isSuccess === false) {
        alert(response.message);
        return;
      }

      alert("تم التعديل بنجاح!");
      onClose(); 
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء التعديل");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} dir="rtl" className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-lg" />
      
      <div className="fixed inset-0 flex items-center justify-center p-6">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
          <div className="p-6 border-b flex justify-between items-center">
            <Dialog.Title className="text-2xl font-bold text-gray-800">تعديل الاستمارة</Dialog.Title>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <XMarkIcon className="w-7 h-7 text-gray-600" />
            </button>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* بيانات المواطن */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">اسم المواطن</label>
                  <input
                    type="text"
                    name="carOwnerName"
                    value={editedData.carOwnerName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">اسم الأب</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={editedData.fatherName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">اسم الجد</label>
                  <input
                    type="text"
                    name="grandFatherName"
                    value={editedData.grandFatherName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">اسم الأم</label>
                  <input
                    type="text"
                    name="motherName"
                    value={editedData.motherName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">اللقب</label>
                  <input
                    type="text"
                    name="surename"
                    value={editedData.surename}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                {/* بيانات المركبة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">نوع المحرك</label>
                  <input
                    type="text"
                    name="engineType"
                    value={editedData.engineType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">رقم الشاصي</label>
                  <input
                    type="text"
                    name="chassisNumber"
                    value={editedData.chassisNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">رقم اللوحة</label>
                  <input
                    type="text"
                    name="plateNumber"
                    value={editedData.plateNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">عدد السلندر</label>
                  <input
                    type="number"
                    name="engineCylindersNumber"
                    value={editedData.engineCylindersNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">عدد المحاور</label>
                  <input
                    type="number"
                    name="vehicleAxlesNumber"
                    value={editedData.vehicleAxlesNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">الموديل</label>
                  <input
                    type="number"
                    name="carModel"
                    value={editedData.carModel}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">عدد الركاب</label>
                  <input
                    type="number"
                    name="seatsNumber"
                    value={editedData.seatsNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>

                {/* Dropdowns for IDs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">الماركة</label>
                  <DropDownListTemplate
                    endpoint="find-vehicle-company"
                    queryParams={{ page: 0, pageSize: 5000 }}
                    labelKey="name"
                    valueKey="id"
                    onSelect={(item) => handleDropdownSelect("carBrandId", item)}
                    placeholder="اختر الماركة"
                    disabled={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">الطراز</label>
                  <DropDownListTemplate
                    endpoint="find-vehicle-name"
                    queryParams={{ 
                      brandId: editedData.carBrandId, // يعتمد على الماركة المختارة
                      page: 0, 
                      pageSize: 5000 
                    }}
                    labelKey="name"
                    valueKey="id"
                    onSelect={(item) => handleDropdownSelect("carNameId", item)}
                    placeholder="اختر الطراز"
                    disabled={!editedData.carBrandId} // معطل حتى يتم اختيار الماركة
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">اللون</label>
                  <DropDownListTemplate
                    endpoint="find-vehicles-colors"
                    queryParams={{ page: 0, pageSize: 5000 }}
                    labelKey="color"
                    valueKey="id"
                    onSelect={(item) => handleDropdownSelect("carColorId", item)}
                    placeholder="اختر اللون"
                    disabled={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">نوع المركبة</label>
                  <DropDownListTemplate
                    endpoint="find-vehicle-types" // تأكد من الـ endpoint الصحيح
                    queryParams={{ page: 0, pageSize: 5000 }}
                    labelKey="type"
                    valueKey="id"
                    onSelect={(item) => handleDropdownSelect("vehicleType", item)}
                    placeholder="اختر نوع المركبة"
                    disabled={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">الاستخدام</label>
                  <DropDownListTemplate
                    endpoint="find-usage-types" // تأكد من الـ endpoint الصحيح
                    queryParams={{ page: 0, pageSize: 5000 }}
                    labelKey="usage"
                    valueKey="id"
                    onSelect={(item) => handleDropdownSelect("usage", item)}
                    placeholder="اختر الاستخدام"
                    disabled={false}
                  />
                </div>

                {/* بيانات المقطورات */}
                {editedData.updateTrailerDTO?.map((trailer, index) => (
                  <div key={index} className="col-span-2 border p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">مقطورة #{index + 1}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">رقم شاصي المقطورة</label>
                        <input
                          type="text"
                          value={trailer.trailerChassisNumber}
                          onChange={(e) => handleTrailerChange(index, "trailerChassisNumber", e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">عدد المحاور</label>
                        <input
                          type="number"
                          value={trailer.trailerAxlesNumber}
                          onChange={(e) => handleTrailerChange(index, "trailerAxlesNumber", e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">وزن الحمولة</label>
                        <input
                          type="number"
                          value={trailer.loadWeight}
                          onChange={(e) => handleTrailerChange(index, "loadWeight", e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">الفئة</label>
                        <input
                          type="text"
                          value={trailer.category}
                          onChange={(e) => handleTrailerChange(index, "category", e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditFormModal;