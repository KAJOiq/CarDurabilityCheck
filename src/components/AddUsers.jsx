import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";
import Select from "react-select";

const AddUsers = ({ setShowAddUser, setUsers }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success feedback
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
    setErrorMessage("");
    setSuccessMessage(""); // Reset success message before submission

    try {
      const createdUser = await fetchData(
        "Users/Register-new-user",
        {
          method: "POST",
          body: JSON.stringify(newUser),
        },
        { "Content-Type": "application/json" }
      );

      const formattedUser = {
        ...createdUser,
        username: createdUser.userName,
        location: locations.find((loc) => loc.value === newUser.locationId)?.label || "",
        userType: userTypes.find((type) => type.value === newUser.userType)?.label || "",
      };

      setUsers((prevUsers) => [...prevUsers, formattedUser]);
      setSuccessMessage("تم إضافة المستخدم بنجاح!"); // Success message on successful user creation
      setTimeout(() => {
        setShowAddUser(false);
      }, 1500); // Auto-close after success
    } catch (error) {
      setErrorMessage(error?.message || "فشل في إضافة المستخدم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
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

        {errorMessage && <div className="text-red-600 text-sm mb-3">{errorMessage}</div>}
        {successMessage && <div className="text-green-600 text-sm mb-3">{successMessage}</div>} {/* Success message display */}

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
