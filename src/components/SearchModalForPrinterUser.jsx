import React, { useEffect, useRef, useState } from "react";
import fetchData from "../utils/fetchData";
import { MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon, QrCodeIcon } from "@heroicons/react/24/outline";

const SearchModalForPrinterUser = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedSearchType, setSelectedSearchType] = React.useState("form");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [searchResult, setSearchResult] = React.useState(null);

  const isPortOpening = useRef(false); 
  const [scannedData, setScannedData] = useState(null);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const inputRef = useRef(null);
  const portRef = useRef(null); 

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const decryptData = (encodedData) => {
    try {
      const decodedData = decodeURIComponent(encodedData); 
      return JSON.parse(decodedData); 
    } catch (error) {
      throw new Error("فشل في تحليل QR Code. يرجى التأكد من البيانات.");
    }
  };

  const handleScan = (data) => {
    if (!data) return;
  
    try {
      const decryptedData = decryptData(data);
      const applicationId = decryptedData.ADDID;
  
      if (applicationId) {
        setSearchTerm(applicationId);
        setScannedData(applicationId);
        setShowQrScanner(false);
        
        handleSearch();
      } else {
        throw new Error("بيانات QR Code غير صالحة");
      }
    } catch (error) {
      setError(error.message || "فشل في تحليل QR Code. يرجى التأكد من البيانات.");
    }
  };

  const startSerialReader = async () => {
    try {
      if (portRef.current && portRef.current.readable) {
        console.warn("The serial port is already open.");
        return;
      }
  
      if (isPortOpening.current) {
        console.warn("Serial port is already in the process of opening.");
        return;
      }
  
      isPortOpening.current = true;
  
      const ports = await navigator.serial.getPorts();
      let port = ports.length > 0 ? ports[0] : null;
  
      if (!port) {
        port = await navigator.serial.requestPort();
      }
  
      await port.open({ baudRate: 9600 });
      portRef.current = port; 
      const reader = port.readable.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
  
        const qrData = decoder.decode(value).trim();
        if (qrData) {
          handleScan(qrData);
        }
      }
    } catch (error) {
      console.error("Error reading from serial port:", error);
      setError("فشل في قراءة بيانات QR Code من المنفذ التسلسلي.");
    } finally {
      isPortOpening.current = false;
    }
  };

  const handleSearchFromQR = () => {
    if (!showQrScanner) {
      setShowQrScanner(true);
      startSerialReader();
    }
  };
  

  useEffect(() => {
    if (showQrScanner && inputRef.current) {
      inputRef.current.focus();
      startSerialReader(); 
    }
  }, [showQrScanner]);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const paramKey = searchTypes[selectedSearchType].param;
      const url = `printer/application/print-application?${paramKey}=${encodeURIComponent(searchTerm)}`;

      const response = await fetchData(url);

      if (response.isSuccess) {
        setSearchResult(response.results);
        onSearch(response.results);
        onClose();
      } else {
        if (response.errors && response.errors.length > 0) {
          setError(response.errors[0].message);
        } else {
          throw new Error("فشل في استرجاع البيانات");
        }
      }
    } catch (error) {
      setError(error.message || "فشل البحث، يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  const searchTypes = {
    chassis: {
      label: "بحث عبر رقم الشاصي",
      placeholder: "أدخل رقم الشاصي",
      param: "chassisNumber"
    },
    form: {
      label: "بحث عبر رقم الاستمارة",
      placeholder: "أدخل رقم الاستمارة",
      param: "applicationId"
    },
    citizen: {
      label: "بحث عبر رقم الوصل",
      placeholder: "أدخل رقم الوصل",
      param: "ReceiptId"
    },
    plate: {
      label: "بحث عبر رقم اللوحة",
      placeholder: "أدخل رقم اللوحة",
      param: "PlateNumber"
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-[1000]">
      <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200/70">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            خيارات البحث
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
          >
            <XMarkIcon className="w-7 h-7 text-gray-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Radio Group */}
        <div className="space-y-3 mb-6">
          {Object.entries(searchTypes).map(([key, { label }]) => (
            <label 
              key={key}
              className={`flex items-center justify-end gap-3 p-3.5 rounded-xl cursor-pointer
                transition-all transform ${selectedSearchType === key 
                  ? "bg-gradient-to-l from-blue-50/80 to-cyan-50/80 border-2 border-blue-400 shadow-sm"
                  : "border border-gray-200 hover:border-blue-200 hover:translate-x-1"}`}
            >
              <span className="text-gray-700 font-medium text-base">{label}</span>
              <input
                type="radio"
                value={key}
                checked={selectedSearchType === key}
                onChange={(e) => setSelectedSearchType(e.target.value)}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 checked:border-blue-600 focus:ring-0"
              />
            </label>
          ))}
        </div>

        {/* Search Input */}
        <div className="mb-6 relative group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
            className="w-full pr-5 pl-14 py-4 border-2 border-gray-200 rounded-xl text-right
                     focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50
                     placeholder:text-gray-400 text-base font-medium shadow-sm
                     transition-all duration-200 group-hover:border-blue-300"
            placeholder={searchTypes[selectedSearchType].placeholder}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-blue-100 rounded-lg">
            <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-right mb-4 p-3.5 bg-red-50/80 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-3 animate-pulse">
            <XMarkIcon className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-7 py-3.5 text-gray-600 rounded-xl font-medium
                     hover:bg-gray-50/80 transition-all border-2 border-gray-200
                     hover:border-gray-300 hover:shadow-sm"
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button
            onClick={handleSearchFromQR}
            className={`px-7 py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl font-medium
                     hover:from-green-700 hover:to-emerald-600 transition-all shadow-md
                     flex items-center gap-2.5 ${isLoading ? "opacity-90 cursor-progress" : ""}`}
            disabled={isLoading}
          >
            <QrCodeIcon className="w-5 h-5 text-white/90" />
            <span>مسح QR</span>
          </button>
          <button
            onClick={handleSearch}
            className={`px-7 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-medium
                     hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md
                     flex items-center gap-2.5 ${isLoading ? "opacity-90 cursor-progress" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                جاري البحث...
              </>
            ) : (
              <>
                <span>بحث</span>
                <MagnifyingGlassIcon className="w-5 h-5 text-white/90" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModalForPrinterUser;