import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Link } from "react-router-dom";
import SearchModal from "./SearchModalForPrint";

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
    numberOfAxes: "",
    nameOfLocation: ""
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
      <Link to="/create-form" className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 flex items-center">
          انشاء استمارة
      </Link>
      </div>
    </div>
    
  );
};

export default Form;