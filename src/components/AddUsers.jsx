import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";
import Select from "react-select";

const AddUsers = ({ setShowAddUser, setUsers }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    userName: "",
    password: "",
    locationId: "",
    userType: "",
  });

  const locations = [
    { value: 1, label: "BGD1" },
    { value: 2, label: "Location 2" },
    { value: 3, label: "Location 3" },
    { value: 4, label: "Location 4" },
  ];

  const userTypes = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "checker", label: "Checker" },
    { value: "reporter", label: "Reporter" },
    { value: "supervisor", label: "Supervisor" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (selectedOption) => {
    setNewUser((prev) => ({ ...prev, locationId: selectedOption.value }));
  };

  const handleUserTypeChange = (selectedOption) => {
    setNewUser((prev) => ({ ...prev, userType: selectedOption.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessages([]);
    setSuccessMessage("");

    try {
      const response = await fetchData(
        "Users/Register-new-user",
        {
          method: "POST",
          body: JSON.stringify(newUser),
        },
        { "Content-Type": "application/json" }
      );

      if (!response.isSuccess) {
        if (response.errors) {
          setErrorMessages(response.errors.map((err) => err.message));
        } else {
          setErrorMessages(["فشل في إضافة المستخدم"]);
        }
        return;
      }

      const formattedUser = {
        ...response.results,
        username: response.results.userName,
        location: locations.find((loc) => loc.value === newUser.locationId)?.label || "",
        userType: userTypes.find((type) => type.value === newUser.userType)?.label || "",
      };

      setUsers((prevUsers) => [...prevUsers, formattedUser]);
      setSuccessMessage("تم إضافة المستخدم بنجاح!");
      setTimeout(() => {
        setShowAddUser(false);
      }, 1500);
    } catch (error) {
      setErrorMessages([error?.message || "فشل في إضافة المستخدم"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">إضافة مستخدم جديد</h3>
          <button
            onClick={() => setShowAddUser(false)}
            className="group text-gray-500 hover:text-gray-800"
          >
            <XMarkIcon className="w-6 h-6 transition-transform group-hover:rotate-90" />
          </button>
        </div>

        {errorMessages.length > 0 && (
          <div className="text-right text-red-600 text-sm mb-3">
            <ul>
              {errorMessages.map((err, index) => (
                <li key={index}>• {err}</li>
              ))}
            </ul>
          </div>
        )}
        {successMessage && <div className="text-green-600 text-sm mb-3">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="الاسم"
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="userName"
            placeholder="اسم المستخدم"
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <Select
            options={locations}
            onChange={handleLocationChange}
            placeholder="اختر الموقع"
            className="w-full"
            required
          />
          <Select
            options={userTypes}
            onChange={handleUserTypeChange}
            placeholder="اختر الصلاحية"
            className="w-full"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg w-full
                       hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? "جاري الإضافة..." : "إضافة"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUsers;
