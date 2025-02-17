import React, { useEffect, useState } from "react";
import fetchData from "../utils/fetchData";
import { MagnifyingGlassIcon, ChevronUpDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";


const DropDownListPage = () => {
  const [activeTab, setActiveTab] = useState("vehicleCompanies");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for all lookup data
  const [allVehicleCompanies, setAllVehicleCompanies] = useState([]);
  const [allTrafficAgencies, setAllTrafficAgencies] = useState([]);

  // Vehicle Companies State
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
  const [vehicleColors, setVehicleColors] = useState([]);
  const [vColorFilters, setVColorFilters] = useState({
    color: "",
    page: 0,
    pageSize: 10,
  });
  const [vColorTotal, setVColorTotal] = useState(0);

  // Traffic Agencies State
  const [trafficAgencies, setTrafficAgencies] = useState([]);
  const [taFilters, setTaFilters] = useState({
    agencyName: "",
    page: 0,
    pageSize: 10,
  });
  const [taTotal, setTaTotal] = useState(0);

  // Traffic Locations State
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

  const renderTable = (data, columns) => {
    if (loading) return <div className="text-center p-8 text-gray-500">جارٍ التحميل...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!data?.length) return <div className="text-center p-8 text-gray-500">لا توجد بيانات</div>;

    return (
      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-right text-sm font-semibold text-gray-700 tracking-wide"
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
                className="hover:bg-gray-50 transition-colors"
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
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(page - 1, tab)}
            disabled={page === 0}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
          >
            السابق
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i, tab)}
              className={`px-4 py-2 text-sm font-medium ${
                page === i
                  ? "text-green-600 bg-green-50 border border-green-500"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1, tab)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
          >
            التالي
          </button>
        </nav>
      </div>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "vehicleCompanies":
        return (
          <>
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