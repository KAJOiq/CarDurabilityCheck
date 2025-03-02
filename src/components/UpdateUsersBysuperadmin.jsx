import React, { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import fetchData from "../utils/fetchData";
import Select from "react-select";

const UpdateUsersBysuperadmin = ({ userId, closeModal, refreshUsers }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [locationId, setLocationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
    { value: "printer", label: "Printer" },
  ];

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetchData("admin/lookup/find-traffic-agencies?page=0&pageSize=5000", {
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
            `admin/lookup/find-traffic-locations?agensyId=${selectedAgency.value}&page=0&pageSize=5000`,
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

  const handleAgencyChange = (selectedOption) => {
    setSelectedAgency(selectedOption);
    setSelectedLocation(null);
  };

  const handleLocationChange = (selectedOption) => {
    setSelectedLocation(selectedOption);
    setLocationId(selectedOption?.value || null);
  };

  const handleUserTypeChange = (selectedOption) => {
    setUserType(selectedOption.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !password || !userType || !locationId) {
      setError("يرجى تعبئة جميع الحقول.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetchData(`Users/update-user-account?UserId=${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ name, password, userType, locationId }),
      });

      if (response.isSuccess) {
        setSuccessMessage("تم تحديث المستخدم بنجاح");
        setTimeout(() => {
          refreshUsers();
          closeModal();
        }, 1000);
      } else {
        if (response.errors && response.errors.length > 0) {
          setError(response.errors[0].message);
        } else {
          setError("فشل في تحديث المستخدم");
        }
      }
    } catch (error) {
      setError("حدث خطأ أثناء محاولة تحديث المستخدم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <div className="text-right mb-6">
          <h3 className="text-xl font-bold text-gray-800">تحديث بيانات المستخدم</h3>
          <p className="text-gray-600 mt-2">تستطيع تغيير بيانات المستخدم كاملةً</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-right">{error}</div>}
        {successMessage && <div className="mb-4 p-3 bg-green-50 text-green-700 text-right rounded-lg">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-right text-gray-700 mb-1">الاسم الكامل</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-right text-gray-700 mb-1">الرمز</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-right text-gray-700 mb-1">المديرية</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selectedAgency?.value || ""}
              onChange={(e) => handleAgencyChange({ value: e.target.value })}
            >
              <option value="">اختر المديرية</option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-right text-gray-700 mb-1">الموقع</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selectedLocation?.value || ""}
              onChange={(e) => handleLocationChange({ value: e.target.value })}
              disabled={!selectedAgency}
            >
              <option value="">اختر الموقع</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-right text-gray-700 mb-1">الصلاحية</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="">اختر الصلاحية</option>
              {userTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="group bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-2.5 rounded-xl
                         hover:from-gray-200 hover:to-gray-300 transition-all duration-300
                         flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-xl
                         hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                         flex items-center justify-center gap-2 shadow-md hover:shadow-lg
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-pulse">جار تحديث بيانات المستخدم...</span>
              ) : (
                <>
                  <PencilSquareIcon className="w-5 h-5" />
                  <span>تحديث بيانات المستخدم</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUsersBysuperadmin;