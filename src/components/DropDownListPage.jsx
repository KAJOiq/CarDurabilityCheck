import React, { useEffect, useState } from "react";
import fetchData from "../utils/fetchData";
import AddVehiclePopup from "./AddVehiclePopup";
import AddColorPopup from "./AddColorPopup";
import AddAgencyPopup from "./AddAgencyPopup";
import AddLocationPopup from "./AddLocationPopup";
import Select from "react-select";
import { MagnifyingGlassIcon, ChevronUpDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon  } from "@heroicons/react/24/outline";


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

  // Fetch all necessary lookup data on mount
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        // Fetch all vehicle companies
        const companiesParams = new URLSearchParams({
          brandName: "",
          page: 0,
          pageSize: 1000,
        });
        const companiesResponse = await fetchData(
          `lookup/find-vehicle-company?${companiesParams}`
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
          `lookup/find-traffic-agencies?${agenciesParams}`
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
          url = `lookup/find-vehicle-company?${params}`;
          break;
        case "vehicleNames":
          params = new URLSearchParams({ ...vnFilters, page: vnFilters.page.toString() });
          url = `lookup/find-vehicle-name?${params}`;
          break;
        case "vehicleColors":
          params = new URLSearchParams({ ...vColorFilters, page: vColorFilters.page.toString() });
          url = `lookup/find-vehicles-colors?${params}`;
          break;
        case "trafficAgencies":
          params = new URLSearchParams({ ...taFilters, page: taFilters.page.toString() });
          url = `lookup/find-traffic-agencies?${params}`;
          break;
        case "trafficLocations":
          params = new URLSearchParams({ ...tlFilters, page: tlFilters.page.toString() });
          url = `lookup/find-traffic-locations?${params}`;
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
  }, [activeTab, vcFilters, vnFilters, vColorFilters, taFilters, tlFilters]);

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
    }
  };

  const toggleAddVehiclePopup = () => {
    setShowAddVehiclePopup(prev => !prev);
  };

  const toggleAddColorPopup = () => {
    setShowAddColorPopup(prev => !prev);
  };

  const toggleAddAgencyPopup = () => {
    setShowAddAgencyPopup(prev => !prev);
  };

  const toggleAddLocationPopup = () => {
    setShowAddLocationPopup(prev => !prev)
  }

  const renderTable = (data, columns) => {
    if (loading) return (
      <div className="p-8 flex flex-col items-center justify-center space-y-4">
        <MagnifyingGlassIcon className="w-12 h-12 text-green-500 animate-pulse" />
        <span className="text-gray-600">جارٍ التحميل...</span>
      </div>
    );

    if (error) return (
      <div className="p-8 flex flex-col items-center justify-center space-y-4 text-red-500">
        <XCircleIcon className="w-12 h-12" />
        <span>{error}</span>
      </div>
    );

    if (!data?.length) return (
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-green-50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-right text-sm text-gray-700"
                  >
                    {item[col.key]}
                  </td>
                ))}
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case "vehicleCompanies":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
                  <button 
                    onClick={toggleAddVehiclePopup} 
                    className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
            {renderTable(vehicleCompanies, [{ key: "name", title: "اسم الشركة المصنعة للسيارة" }])}
            {renderPagination(vcTotal, vcFilters.pageSize, vcFilters.page, "vehicleCompanies")}
          </>
        );

      case "vehicleNames":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
                  <button 
                    onClick={toggleAddVehiclePopup} 
                    className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
                <select
                  name="brandId"
                  value={vnFilters.brandId}
                  onChange={(e) => handleFilterChange(e, "vehicleNames")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
                >
                  <option value="">اختر الماركة</option>
                  {allVehicleCompanies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {renderTable(vehicleNames, [{ key: "name", title: "اسم المركبة" }])}
            {renderPagination(vnTotal, vnFilters.pageSize, vnFilters.page, "vehicleNames")}
          </>
        );

      case "vehicleColors":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
            <button 
                  onClick={toggleAddColorPopup} 
                  className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
            {renderTable(vehicleColors, [{ key: "color", title: "الوان المركبات" }])}
            {renderPagination(vColorTotal, vColorFilters.pageSize, vColorFilters.page, "vehicleColors")}
          </>
        );

      case "trafficAgencies":
        return (
          <>
            <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
            <button 
                  onClick={toggleAddAgencyPopup} 
                  className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
            {renderTable(trafficAgencies, [{ key: "name", title: "اسم المديرية" }])}
            {renderPagination(taTotal, taFilters.pageSize, taFilters.page, "trafficAgencies")}
          </>
        );

      case "trafficLocations":
        return (
          <>
          <div className="flex gap-4 mb-4 overflow-x-auto justify-center">
          <button 
                  onClick={toggleAddLocationPopup} 
                  className="group bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
                <select
                  name="agensyId"
                  value={tlFilters.agensyId}
                  onChange={(e) => handleFilterChange(e, "trafficLocations")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-right"
                >
                  <option value="">اختر المديرية</option>
                  {allTrafficAgencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {renderTable(trafficLocations, [{ key: "name", title: "اسم الموقع" }])}
            {renderPagination(tlTotal, tlFilters.pageSize, tlFilters.page, "trafficLocations")}
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
      <div className="flex gap-4 mb-8 overflow-x-auto justify-center">
        {["vehicleCompanies", "vehicleNames", "vehicleColors", "trafficAgencies", "trafficLocations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {{
              vehicleCompanies: "شركات المركبات",
              vehicleNames: "أسماء المركبات",
              vehicleColors: "ألوان المركبات",
              trafficAgencies: "المديريات المرورية",
              trafficLocations: "المواقع المرورية",
            }[tab]}
          </button>
        ))}
      </div>
        
      <div className="text-center">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default DropDownListPage;