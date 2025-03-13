import React, { useEffect, useState } from "react";
import fetchData from "../../utils/fetchData";
import AddVehiclePopup from "./AddVehiclePopup";
import AddColorPopup from "./AddColorPopup";
import AddAgencyPopup from "./AddAgencyPopup";
import AddLocationPopup from "./AddLocationPopup";
import AddCharecterPopup from "./AddCharecterPopup";
import UpdateVehicleBrandPopup from "../UpdateVehicleBrandPopup";
import UpdateVehicleNamePopup from "../UpdateVehicleNamePopup";
import UpdateColorPopup from "../UpdateColorPopup";
import UpdateAgencyPopup from "../UpdateAgencyPopup";
import UpdateLocationPopup from "../UpdateLocationPopup";
import Select from "react-select";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon, XCircleIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

const DropDownListPage = () => {
  const [activeTab, setActiveTab] = useState("vehicleCompanies");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for all lookup data
  const [allVehicleCompanies, setAllVehicleCompanies] = useState([]);
  const [allTrafficAgencies, setAllTrafficAgencies] = useState([]);

  // Vehicle Companies State
  const [showAddVehiclePopup, setShowAddVehiclePopup] = useState(false);
  const [vehicleCompanies, setVehicleCompanies] = useState([]);
  const [vcFilters, setVcFilters] = useState({
    brandName: "",
    page: 0,
    pageSize: 10,
  });
  const [vcTotal, setVcTotal] = useState(0);

  // Vehicle Names State
  const [vehicleNames, setVehicleNames] = useState([]);
  const [vnFilters, setVnFilters] = useState({
    vehicleName: "",
    brandId: "",
    page: 0,
    pageSize: 10,
  });
  const [vnTotal, setVnTotal] = useState(0);

  // Vehicle Colors State
  const [showAddColorPopup, setShowAddColorPopup] = useState(false);
  const [vehicleColors, setVehicleColors] = useState([]);
  const [vColorFilters, setVColorFilters] = useState({
    color: "",
    page: 0,
    pageSize: 10,
  });
  const [vColorTotal, setVColorTotal] = useState(0);

  // Traffic Agencies State
  const [showAddAgencyPopup, setShowAddAgencyPopup] = useState(false);
  const [trafficAgencies, setTrafficAgencies] = useState([]);
  const [taFilters, setTaFilters] = useState({
    agencyName: "",
    page: 0,
    pageSize: 10,
  });
  const [taTotal, setTaTotal] = useState(0);

  // Traffic Locations State
  const [showAddLocationPopup, setShowAddLocationPopup] = useState(false);
  const [trafficLocations, setTrafficLocations] = useState([]);
  const [tlFilters, setTlFilters] = useState({
    locationName: "",
    agensyId: "",
    page: 0,
    pageSize: 10,
  });
  const [tlTotal, setTlTotal] = useState(0);

  const [showAddCharecterPopup, setShowAddCharecterPopup] = useState(false);
  const [characters, setCharacters] = useState({ result: [], total: 0 });
  const [chFilters, setChFilters] = useState({
    page: 0,
    pageSize: 10,
  });
  const [chTotal, setChTotal] = useState(0);

  // States to control visibility of select fields
  const [hideBrandSelect, setHideBrandSelect] = useState(false);
  const [hideAgencySelect, setHideAgencySelect] = useState(false);

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [showUpdateVehicleNamePopup, setShowUpdateVehicleNamePopup] = useState(false);
  const [selectedVehicleName, setSelectedVehicleName] = useState(null);

  const [showUpdateColorPopup, setShowUpdateColorPopup] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  const [showUpdateAgencyPopup, setShowUpdateAgencyPopup] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);

  const [showUpdateLocationPopup, setShowUpdateLocationPopup] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const handleEditBrand = (brand) => {
    setSelectedBrand(brand);
    setShowUpdatePopup(true);
  };

  const handleEditVehicleName = (vehicleName) => {
    setSelectedVehicleName(vehicleName);
    setShowUpdateVehicleNamePopup(true);
  };
  
  const handleEditColor = (color) => {
    setSelectedColor(color);
    setShowUpdateColorPopup(true);
  };
  
  const handleEditAgency = (agency) => {
    setSelectedAgency(agency);
    setShowUpdateAgencyPopup(true);
  };
  
  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setShowUpdateLocationPopup(true);
  };

  // Fetch all necessary lookup data on mount
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        // Fetch all vehicle companies
        const companiesParams = new URLSearchParams({
          brandName: "",
          page: 0,
          pageSize: 5000,
        });
        const companiesResponse = await fetchData(
          `admin/lookup/find-vehicle-company?${companiesParams}`
        );
        if (companiesResponse.isSuccess) {
          setAllVehicleCompanies(companiesResponse.results.result);
        }

        // Fetch all traffic agencies
        const agenciesParams = new URLSearchParams({
          agencyName: "",
          page: 0,
          pageSize: 1000,
        });
        const agenciesResponse = await fetchData(
          `admin/lookup/find-traffic-agencies?${agenciesParams}`
        );
        if (agenciesResponse.isSuccess) {
          setAllTrafficAgencies(agenciesResponse.results.result);
        }
      } catch (error) {
        console.error("Error fetching lookup data:", error);
      }
    };

    fetchLookupData();
  }, []);

  const fetchTabData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      let url, params;
      switch (tab) {
        case "vehicleCompanies":
          params = new URLSearchParams({ ...vcFilters, page: vcFilters.page.toString() });
          url = `admin/lookup/find-vehicle-company?${params}`;
          break;
        case "vehicleNames":
          params = new URLSearchParams({ ...vnFilters, page: vnFilters.page.toString() });
          url = `admin/lookup/find-vehicle-name?${params}`;
          break;
        case "vehicleColors":
          params = new URLSearchParams({ ...vColorFilters, page: vColorFilters.page.toString() });
          url = `admin/lookup/find-vehicles-colors?${params}`;
          break;
        case "trafficAgencies":
          params = new URLSearchParams({ ...taFilters, page: taFilters.page.toString() });
          url = `admin/lookup/find-traffic-agencies?${params}`;
          break;
        case "trafficLocations":
          params = new URLSearchParams({ ...tlFilters, page: tlFilters.page.toString() });
          url = `admin/lookup/find-traffic-locations?${params}`;
          break;
        case "charecters":
          params = new URLSearchParams({ ...chFilters, page: chFilters.page.toString() });
          url = `admin/lookup/find-plate-character?${params}`;
          break;
        default:
          return;
      }

      const response = await fetchData(url);
      if (response.isSuccess) {
        switch (tab) {
          case "vehicleCompanies":
            setVehicleCompanies(response.results.result);
            setVcTotal(response.results.total);
            break;
          case "vehicleNames":
            setVehicleNames(response.results.result);
            setVnTotal(response.results.total);
            break;
          case "vehicleColors":
            setVehicleColors(response.results.result);
            setVColorTotal(response.results.total);
            break;
          case "trafficAgencies":
            setTrafficAgencies(response.results.result);
            setTaTotal(response.results.total);
            break;
          case "trafficLocations":
            setTrafficLocations(response.results.result);
            setTlTotal(response.results.total);
            break;
          case "charecters":
            setCharacters(response.results);
            setChTotal(response.results.total);
            break;
        }
      } else {
        setError("فشل في تحميل البيانات");
      }
    } catch (err) {
      setError("انتهت الجلسة! من فضلك قم بإعادة تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, vcFilters, vnFilters, vColorFilters, taFilters, tlFilters, chFilters]);

  const handleFilterChange = (e, tab) => {
    const { name, value } = e.target;
    switch (tab) {
      case "vehicleCompanies":
        setVcFilters((prev) => ({ ...prev, [name]: value }));
        break;
      case "vehicleNames":
        setVnFilters((prev) => ({ ...prev, [name]: value }));
        break;
      case "vehicleColors":
        setVColorFilters((prev) => ({ ...prev, [name]: value }));
        break;
      case "trafficAgencies":
        setTaFilters((prev) => ({ ...prev, [name]: value }));
        break;
      case "trafficLocations":
        setTlFilters((prev) => ({ ...prev, [name]: value }));
        break;
      case "charecters":
        setChFilters((prev) => ({ ...prev, [name]: value }));
        break;
    }
  };

  const handlePageChange = (newPage, tab) => {
    switch (tab) {
      case "vehicleCompanies":
        setVcFilters((prev) => ({ ...prev, page: newPage }));
        break;
      case "vehicleNames":
        setVnFilters((prev) => ({ ...prev, page: newPage }));
        break;
      case "vehicleColors":
        setVColorFilters((prev) => ({ ...prev, page: newPage }));
        break;
      case "trafficAgencies":
        setTaFilters((prev) => ({ ...prev, page: newPage }));
        break;
      case "trafficLocations":
        setTlFilters((prev) => ({ ...prev, page: newPage }));
        break;
      case "charecters":
        setChFilters((prev) => ({ ...prev, page: newPage }));
        break;
    }
  };

  const toggleAddVehiclePopup = () => {
    setShowAddVehiclePopup((prev) => !prev);
    setHideBrandSelect((prev) => !prev);
  };

  const toggleAddColorPopup = () => {
    setShowAddColorPopup((prev) => !prev);
  };

  const toggleAddAgencyPopup = () => {
    setShowAddAgencyPopup((prev) => !prev);
  };

  const toggleAddLocationPopup = () => {
    setShowAddLocationPopup((prev) => !prev);
    setHideAgencySelect((prev) => !prev);
  };

  const toggleAddCharecterPopup = () => {
    setShowAddCharecterPopup((prev) => !prev);
  };

  const renderTable = (data, columns, tab) => {
    if (loading)
      return (
        <div className="p-8 flex flex-col items-center justify-center space-y-4">
          <MagnifyingGlassIcon className="w-12 h-12 text-green-500 animate-pulse" />
          <span className="text-gray-600">جارٍ التحميل...</span>
        </div>
      );
  
    if (error)
      return (
        <div className="p-8 flex flex-col items-center justify-center space-y-4 text-red-500">
          <XCircleIcon className="w-12 h-12" />
          <span>{error}</span>
        </div>
      );
  
    if (!data?.length)
      return (
        <div className="p-8 flex flex-col items-center justify-center space-y-4 text-gray-500">
          <MagnifyingGlassIcon className="w-12 h-12" />
          <span>لا توجد بيانات</span>
        </div>
      );  

      return (
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-right text-sm font-semibold text-green-600 tracking-wide"
                  >
                    {col.title}
                  </th>
                ))}
                {(tab === "vehicleCompanies" || tab === "vehicleNames" || tab === "vehicleColors" || tab === "trafficAgencies" || tab === "trafficLocations") && (
                  <th className="px-6 py-4 text-right text-sm font-semibold text-green-600 tracking-wide">
                    تعديل
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-green-50 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-right text-sm text-gray-700"
                    >
                      {item[col.key]}
                    </td>
                  ))}
                  {(tab === "vehicleCompanies" || tab === "vehicleNames" || tab === "vehicleColors" || tab === "trafficAgencies" || tab === "trafficLocations") && (
                    <td className="px-6 py-4 text-right text-sm text-gray-700">
                      <button
                        onClick={() => {
                          if (tab === "vehicleCompanies") handleEditBrand(item);
                          else if (tab === "vehicleNames") handleEditVehicleName(item);
                          else if (tab === "vehicleColors") handleEditColor(item);
                          else if (tab === "trafficAgencies") handleEditAgency(item);
                          else if (tab === "trafficLocations") handleEditLocation(item);
                        }}
                        className="text-green-500 hover:text-green-600 transition-colors"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

  const renderPagination = (total, pageSize, page, tab) => {
    const totalPages = Math.ceil(total / pageSize);
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-green-50 border-t border-green-100">
        <span className="text-sm text-green-600">
          الصفحة {page + 1} من {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(page - 1, tab)}
            disabled={page === 0}
            className="p-2 rounded-lg border border-green-200 text-green-600 hover:bg-green-100 disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handlePageChange(page + 1, tab)}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-lg border border-green-200 text-green-600 hover:bg-green-100 disabled:opacity-50"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const handleSelectChange = (selectedOption, tab, fieldName) => {
    const value = selectedOption ? selectedOption.value : "";
    switch (tab) {
      case "vehicleNames":
        setVnFilters((prev) => ({ ...prev, [fieldName]: value }));
        break;
      case "trafficLocations":
        setTlFilters((prev) => ({ ...prev, [fieldName]: value }));
        break;
    }
  };

  const vehicleCompaniesOptions = allVehicleCompanies.map((company) => ({
    value: company.id,
    label: company.name,
  }));

  const trafficAgenciesOptions = allTrafficAgencies.map((agency) => ({
    value: agency.id,
    label: agency.name,
  }));

  const renderActiveTab = () => {
    switch (activeTab) {
      case "vehicleCompanies":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
              <button
                onClick={toggleAddVehiclePopup}
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusCircleIcon className="w-5 h-5" />
                إضافة مركبة جديدة
              </button>
            </div>
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="brandName"
                  value={vcFilters.brandName}
                  onChange={(e) => handleFilterChange(e, "vehicleCompanies")}
                  placeholder="ابحث باسم الماركة"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
                />
              </div>
            </div>
            {renderTable(vehicleCompanies, [{ key: "name", title: "اسم الشركة المصنعة للسيارة" }], "vehicleCompanies")}
            {renderPagination(vcTotal, vcFilters.pageSize, vcFilters.page, "vehicleCompanies")}
          </>
        );
      case "vehicleNames":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
              <button
                onClick={toggleAddVehiclePopup}
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusCircleIcon className="w-5 h-5" />
                إضافة مركبة جديدة
              </button>
            </div>
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="vehicleName"
                  value={vnFilters.vehicleName}
                  onChange={(e) => handleFilterChange(e, "vehicleNames")}
                  placeholder="ابحث باسم المركبة"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
                />
                {!hideBrandSelect && (
                  <div className="relative">
                    <Select
                      options={vehicleCompaniesOptions}
                      value={vehicleCompaniesOptions.find((option) => option.value === vnFilters.brandId)}
                      onChange={(selected) => handleSelectChange(selected, "vehicleNames", "brandId")}
                      placeholder="ابحث واختر الماركة"
                      isSearchable
                      className="text-right"
                      styles={{
                        control: (base) => ({
                          ...base,
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                          borderColor: "#e5e7eb",
                          "&:hover": {
                            borderColor: "#059669",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          textAlign: "right",
                        }),
                      }}
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            {renderTable(vehicleNames, [{ key: "name", title: "اسم المركبة" }], "vehicleNames")}
            {renderPagination(vnTotal, vnFilters.pageSize, vnFilters.page, "vehicleNames")}
          </>
        );
      case "vehicleColors":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
              <button
                onClick={toggleAddColorPopup}
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusCircleIcon className="w-5 h-5" />
                إضافة لون جديدة
              </button>
            </div>
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="color"
                  value={vColorFilters.color}
                  onChange={(e) => handleFilterChange(e, "vehicleColors")}
                  placeholder="ابحث بلون المركبة"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
                />
              </div>
            </div>
            {renderTable(vehicleColors, [{ key: "color", title: "الوان المركبات" }], "vehicleColors")}
            {renderPagination(vColorTotal, vColorFilters.pageSize, vColorFilters.page, "vehicleColors")}
          </>
        );
      case "trafficAgencies":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
              <button
                onClick={toggleAddAgencyPopup}
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusCircleIcon className="w-5 h-5" />
                إضافة مديرية جديدة
              </button>
            </div>
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="agencyName"
                  value={taFilters.agencyName}
                  onChange={(e) => handleFilterChange(e, "trafficAgencies")}
                  placeholder="ابحث باسم المديرية"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
                />
              </div>
            </div>
            {renderTable(trafficAgencies, [{ key: "name", title: "اسم المديرية" }], "trafficAgencies")}
            {renderPagination(taTotal, taFilters.pageSize, taFilters.page, "trafficAgencies")}
          </>
        );
      case "trafficLocations":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
              <button
                onClick={toggleAddLocationPopup}
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusCircleIcon className="w-5 h-5" />
                إضافة موقع جديدة
              </button>
            </div>
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="locationName"
                  value={tlFilters.locationName}
                  onChange={(e) => handleFilterChange(e, "trafficLocations")}
                  placeholder="ابحث باسم الموقع"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
                />
                {!hideAgencySelect && (
                  <div className="relative">
                    <Select
                      options={trafficAgenciesOptions}
                      value={trafficAgenciesOptions.find((option) => option.value === tlFilters.agensyId)}
                      onChange={(selected) => handleSelectChange(selected, "trafficLocations", "agensyId")}
                      placeholder="ابحث واختر المديرية"
                      isSearchable
                      className="text-right"
                      styles={{
                        control: (base) => ({
                          ...base,
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                          borderColor: "#e5e7eb",
                          "&:hover": {
                            borderColor: "#059669",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          textAlign: "right",
                        }),
                      }}
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            {renderTable(trafficLocations, [{ key: "name", title: "اسم الموقع" }], "trafficLocations")}
            {renderPagination(tlTotal, tlFilters.pageSize, tlFilters.page, "trafficLocations")}
          </>
        );
      case "charecters":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
              <button
                onClick={toggleAddCharecterPopup}
                className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <PlusCircleIcon className="w-5 h-5" />
                إضافة حرف جديد
              </button>
            </div>
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="charecter"
                  value={chFilters.charecter}
                  onChange={(e) => handleFilterChange(e, "charecters")}
                  placeholder="ابحث عن حرف"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
                />
              </div>
            </div>
            {renderTable(characters.result, [{ key: "allowedChar", title: "الحرف" }], "charecters")}
            {renderPagination(chTotal, chFilters.pageSize, chFilters.page, "charecters")}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {showAddVehiclePopup && (
        <AddVehiclePopup
          onClose={toggleAddVehiclePopup}
          refreshData={() => fetchTabData(activeTab)}
        />
      )}
      {showAddColorPopup && (
        <AddColorPopup
          onClose={toggleAddColorPopup}
          refreshData={() => fetchTabData(activeTab)}
        />
      )}
      {showAddAgencyPopup && (
        <AddAgencyPopup
          onClose={toggleAddAgencyPopup}
          refreshData={() => fetchTabData(activeTab)}
        />
      )}
      {showAddLocationPopup && (
        <AddLocationPopup
          onClose={toggleAddLocationPopup}
          refreshData={() => fetchTabData(activeTab)}
        />
      )}
      {showAddCharecterPopup && (
        <AddCharecterPopup
          onClose={toggleAddCharecterPopup}
          refreshData={() => fetchTabData(activeTab)}
        />
      )}
      {showUpdatePopup && (
        <UpdateVehicleBrandPopup
          onClose={() => setShowUpdatePopup(false)}
          refreshData={() => fetchTabData(activeTab)}
          brandId={selectedBrand.id}
          brandName={selectedBrand.name}
        />
      )}
      {showUpdateVehicleNamePopup && (
        <UpdateVehicleNamePopup
          onClose={() => setShowUpdateVehicleNamePopup(false)}
          refreshData={() => fetchTabData(activeTab)}
          vehicleId={selectedVehicleName.id}
          vehicleName={selectedVehicleName.name}
        />
      )}

      {showUpdateColorPopup && (
        <UpdateColorPopup
          onClose={() => setShowUpdateColorPopup(false)}
          refreshData={() => fetchTabData(activeTab)}
          colorId={selectedColor.id}
          color={selectedColor.color}
        />
      )}

      {showUpdateAgencyPopup && (
        <UpdateAgencyPopup
          onClose={() => setShowUpdateAgencyPopup(false)}
          refreshData={() => fetchTabData(activeTab)}
          agencyId={selectedAgency.id}
          agencyName={selectedAgency.name}
        />
      )}

      {showUpdateLocationPopup && (
        <UpdateLocationPopup
          onClose={() => setShowUpdateLocationPopup(false)}
          refreshData={() => fetchTabData(activeTab)}
          locationId={selectedLocation.id}
          locationName={selectedLocation.name}
        />
      )}
      <div className="flex gap-4 mb-8 overflow-x-auto justify-center">
        {["vehicleCompanies", "vehicleNames", "vehicleColors", "trafficAgencies", "trafficLocations", "charecters"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {{
              vehicleCompanies: "شركات المركبات",
              vehicleNames: "أسماء المركبات",
              vehicleColors: "ألوان المركبات",
              trafficAgencies: "المديريات المرورية",
              trafficLocations: "المواقع المرورية",
              charecters: "الحروف",
            }[tab]}
          </button>
        ))}
      </div>

      <div className="text-center">{renderActiveTab()}</div>
    </div>
  );
};

export default DropDownListPage;