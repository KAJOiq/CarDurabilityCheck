import React, { useState, useEffect } from 'react';
import PrintingReports from './PrintingReports';
import fetchData from '../utils/fetchData';
import Select from 'react-select'; 
import { 
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  MapPinIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const mockData = {
  الكل: { الكل: 0 },
  سيارة: { وقود: 0, هجين: 0, كهربائي: 0 },
  شاحنة: { وقود: 0, هجين: 0, كهربائي: 0 },
  دراجة: { وقود: 0, هجين: 0, كهربائي: 0 },
};

const statusItemsConfig = [
  {
    id: 1,
    title: 'عدد الاستمارات الحكومية',
    value: 0,
    icon: BuildingOffice2Icon,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 2,
    title: 'عدد شهادات الفحص',
    value: 0,
    icon: ClipboardDocumentCheckIcon,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 3,
    title: 'مجموع عدد الاستمارات',
    value: 0,
    icon: ClipboardDocumentIcon,
    color: 'bg-yellow-100 text-yellow-600',
  },
];

const ReportStatus = () => {
  const [formType, setFormType] = useState('الكل');
  const [engineType, setEngineType] = useState('الكل');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [agencies, setAgencies] = useState([]);
  const [locations, setLocations] = useState([]); 
  const [filteredStatusItems, setFilteredStatusItems] = useState(statusItemsConfig);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetchData("lookup/find-traffic-agencies?page=0&pageSize=5000", {
          method: "GET",
        });

        if (response.isSuccess) {
          setAgencies(response.results.result);
        } else {
          console.error("فشل في جلب المديريات");
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب المديريات:", error);
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
            console.error("فشل في جلب المواقع");
          }
        } catch (error) {
          console.error("حدث خطأ أثناء جلب المواقع:", error);
        }
      };

      fetchLocations();
    } else {
      setLocations([]); 
    }
  }, [selectedAgency]);

  // Fetch data when filters change
  useEffect(() => {
    handleApplyFilter();
  }, [formType, engineType, startDate, endDate, selectedAgency, selectedLocation]);

  // Apply filters and fetch data from the API
  const handleApplyFilter = async () => {
    try {
      const vehicleType = formType === 'الكل' ? '' : formType;
      const motorType = engineType === 'الكل' ? '' : engineType;
      const agencyId = selectedAgency?.value || '';
      const locationId = selectedLocation?.value || '';

      const response = await fetchData(
        `Reporter/applications-reporter?VehicleType=${vehicleType}&EngineType=${motorType}&AgencyId=${agencyId}&LocationId=${locationId}&StartDate=${startDate}&EndDate=${endDate}`,
        {
          method: 'GET',
          headers: { 'accept': '*/*' },
        }
      );

      if (response.isSuccess) {
        const { totalApplications, certifiedApplications, governmentApplications } = response.results;
        const newValues = {
          'عدد الاستمارات الحكومية': governmentApplications,
          'عدد شهادات الفحص': certifiedApplications,
          'مجموع عدد الاستمارات': totalApplications,
        };

        setFilteredStatusItems((prev) =>
          prev.map((item) => ({
            ...item,
            value: newValues[item.title] || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Prepare data for printing
  const preparePrintData = () => {
    return filteredStatusItems.map((item) => ({
      title: item.title,
      value: item.value,
      formType: formType,
      engineType: engineType,
      agency: selectedAgency?.label || '--',
      location: selectedLocation?.label || '--',
      dateRange: `${startDate || '--'} إلى ${endDate || '--'}`,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 lg:p-10 text-right">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Filter Section */}
        <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 text-right">
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            فلاتر البحث
          </h2>

          <div className="space-y-6">
            {/* Vehicle Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">نوع الاستمارة</label>
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                    text-right appearance-none bg-white"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                >
                  {Object.keys(mockData).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <DocumentTextIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Engine Type Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">نوع المحرك</label>
              <div className="relative">
                <select
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all
                    text-right appearance-none bg-white"
                  value={engineType}
                  onChange={(e) => setEngineType(e.target.value)}
                >
                  {['الكل', 'وقود', 'هجين', 'كهربائي'].map((engine) => (
                    <option key={engine} value={engine}>{engine}</option>
                  ))}
                </select>
                <CogIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Agency Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">المديرية</label>
              <Select
                options={agencies.map((agency) => ({
                  value: agency.id,
                  label: agency.name,
                }))}
                onChange={(selectedOption) => setSelectedAgency(selectedOption)}
                placeholder="اختر المديرية"
                className="w-full"
              />
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">الموقع</label>
              <Select
                options={locations.map((location) => ({
                  value: location.id,
                  label: location.name,
                }))}
                onChange={(selectedOption) => setSelectedLocation(selectedOption)}
                placeholder="اختر الموقع"
                className="w-full"
                isDisabled={!selectedAgency} 
              />
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">النطاق الزمني</label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="date"
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Apply Filter Button */}
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl 
                font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-blue-200/40
                flex items-center justify-center gap-2 mt-4"
              onClick={handleApplyFilter}
            >
              تطبيق الفلتر
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {filteredStatusItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all 
                  border-l-4 border-blue-500 relative group transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">{item.title}</p>
                    <p className={`text-3xl font-bold ${item.color.split(' ')[1]} mb-4`}>
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${item.color} bg-opacity-20 transition-colors`}>
                    <item.icon className={`w-8 h-8 ${item.color.split(' ')[1]}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Print Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100/50 backdrop-blur-sm">
            <PrintingReports data={preparePrintData()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportStatus;