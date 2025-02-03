import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchModal from "./SearchModalForPrint";
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

const Form = ({ formType, setFormType }) => {
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
    model: "",
    cylinderCount: "",
    receiptNumber: "",
    trafficFormNumber: "",
    formType: "",
    numberOfPassengers: "", 
    load: "", 
    attachedLoadType: "",
    attachedChassis: "", 
    numberOfAttachedVehicles: "",
    numberOfAxes: "",
    nameOfLocation: ""
  });

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-end">
          <button 
            className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl 
                      hover:from-blue-600 hover:to-blue-700 transition-all duration-300
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <MagnifyingGlassIcon className="h-5 w-5 transform group-hover:scale-125 transition-transform" />
            <span className="text-lg">البحث عن استمارة لطباعتها</span>
          </button>

          <Link 
            to="/create-form" 
            className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl 
                      hover:from-green-600 hover:to-green-700 transition-all duration-300
                      flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <PlusCircleIcon className="h-5 w-5 transform group-hover:scale-125 transition-transform" />
            <span className="text-lg">إنشاء استمارة جديدة</span>
          </Link>
        </div>

        <SearchModal 
          isOpen={isSearchModalOpen} 
          onClose={() => setIsSearchModalOpen(false)} 
          onSearch={handleSearch} 
        />
      </div>
    </div>
  );
};

export default Form;