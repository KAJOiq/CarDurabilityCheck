import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";
import Select from "react-select";

const AddUsers = ({ setShowAddUser, setUsers, refreshUsers }) => {
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

  const [agencies, setAgencies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedAgency, setSelectedAgency] = useState(null); 
  const [selectedLocation, setSelectedLocation] = useState(null);

  const userTypes = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "checker", label: "Checker" },
    { value: "reporter", label: "Reporter" },
    { value: "supervisor", label: "Supervisor" },
    { value: "superadmin", label: "Superadmin" },
  ];

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetchData("lookup/find-traffic-agencies?page=0&pageSize=5000", {
          method: "GET",
        });

        if (response.isSuccess) {
          setAgencies(response.results.result);
        } else {
          setErrorMessages(["فشل في جلب المديريات"]);
        }
      } catch (error) {
        setErrorMessages([error?.message || "فشل في جلب المديريات"]);
      }
    };

    fetchAgencies();
  }, []);

  useEffect(() => {
    if (selectedAgency) {
      const fetchLocations = async () => {
        try {
          const response = await fetchData(
            `lookup/find-traffic-locations?agensyId=${selectedAgency.value}&page=0&pageSize=5000`,
            {
              method: "GET",
            }
          );

          if (response.isSuccess) {
            setLocations(response.results.result);
          } else {
            setErrorMessages(["فشل في جلب المواقع"]);
          }
        } catch (error) {
          setErrorMessages([error?.message || "فشل في جلب المواقع"]);
        }
      };

      fetchLocations();
    }
  }, [selectedAgency]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (selectedOption) => {
    setNewUser((prev) => ({ ...prev, userType: selectedOption.value }));
  };

  const handleAgencyChange = (selectedOption) => {
    setSelectedAgency(selectedOption);
    setSelectedLocation(null); 
  };

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
    setNewUser((prev) => ({ ...prev, locationId: selectedOption?.value || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessages([]);
    setSuccessMessage("");

    try {
      const response = await fetchData("Users/Register-new-user", {
        method: "POST",
        body: JSON.stringify(newUser),
      });

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
        location: selectedLocation?.label || "",
        userType: userTypes.find((type) => type.value === newUser.userType)?.label || "",
      };

      setUsers((prevUsers) => [...prevUsers, formattedUser]);
      setSuccessMessage("تم إضافة المستخدم بنجاح!");
      setShowAddUser(false);
      refreshUsers(); 
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
            options={agencies.map((agency) => ({
              value: agency.id,
              label: agency.name,
            }))}
            onChange={handleAgencyChange}
            placeholder="اختر المديرية"
            className="w-full"
            required
          />

          <Select
            options={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
            onChange={handleLocationChange}
            placeholder="اختر الموقع"
            className="w-full"
            required
            isDisabled={!selectedAgency}
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