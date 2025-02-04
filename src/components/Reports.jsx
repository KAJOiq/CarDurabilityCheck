// نوع الاستمارة ونوع المحرك يتم تضمينها بالاستمارة فقط من الفلتر
// استفسار على الموقع هل يتم تضمينه في الفلتر أم لا ؟

import React, { useState } from 'react';
import PrintingReports from './PrintingReports';
import { 
  ClipboardDocumentIcon,

} from '@heroicons/react/24/outline';

// Mock data with type safety
const mockData = {
  سيارة: { وقود: 15, هجين: 5, كهربائي: 10 },
  شاحنة: { وقود: 20, هجين: 8, كهربائي: 7 },
  دراجة: { وقود: 5, هجين: 2, كهربائي: 5 }
};

const ReportStatus = () => {
  const [formType, setFormType] = useState('سيارة');
  const [engineType, setEngineType] = useState('وقود');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredStatusItems, setFilteredStatusItems] = useState([
    { 
      id: 1,
      title: 'عدد الاستمارات الحكومية',
      value: 21,
      icon: ClipboardDocumentIcon,
      color: 'bg-green-100 text-green-600',
      showPercentage: false
    },
    { 
      id: 2,
      title: 'عدد شهادات الفحص',
      value: 35,
      icon: ClipboardDocumentIcon,
      color: 'bg-orange-100 text-orange-600',
      showPercentage: false
    },
    { 
      id: 3,
      title: 'مجموع عدد الاستمارات',
      value: 12,
      icon: ClipboardDocumentIcon,
      color: 'bg-yellow-100 text-yellow-600',
      showPercentage: false
    },
  ]);

  const handleApplyFilter = () => {
    const selectedFormData = mockData[formType];
    const selectedValue = selectedFormData[engineType] || 0;

    const newValues = {
      'عدد الاستمارات الحكومية': selectedValue,
      'عدد شهادات الفحص': Math.floor(Math.random() * 50) + 10,
      'مجموع عدد الاستمارات': Object.values(selectedFormData).reduce((a, b) => a + b, 0)
    };

    setFilteredStatusItems(prev => prev.map(item => ({
      ...item,
      value: newValues[item.title] || 0
    })));
  };

  const preparePrintData = () => {
    return filteredStatusItems.map(item => ({
      title: item.title,
      value: item.value,
      formType: formType,
      engineType: engineType,
      dateRange: `${startDate || '--'} إلى ${endDate || '--'}`
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Filter Section */}
        <div className="w-sm lg:w-72 shrink-0 bg-white p-6 rounded-2xl shadow-xl border border-blue-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">نوع الاستمارة</label>
              <select 
                className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
              >
                {Object.keys(mockData).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">نوع المحرك</label>
              <select 
                className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={engineType}
                onChange={(e) => setEngineType(e.target.value)}
              >
                {Object.keys(mockData[formType]).map((engine) => (
                  <option key={engine} value={engine}>{engine}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">النطاق الزمني</label>
              <div className="space-y-3">
                <input 
                  type="date" 
                  className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input 
                  type="date" 
                  className="w-full p-3 border-2 border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <button 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl 
                        hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg
                        font-semibold flex items-center justify-center gap-2"
              onClick={handleApplyFilter}
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
              تطبيق الفلتر
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
                border-l-4 border-blue-500 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">{item.title}</p>
                    <p className={`text-3xl font-bold ${item.color.split(' ')[1]} mb-4`}>
                      {item.value.toLocaleString()}
                      {item.showPercentage && '%'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${item.color} bg-opacity-20`}>
                    <item.icon className={`w-8 h-8 ${item.color.split(' ')[1]}`} />
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="h-1.5 bg-slate-100">
                    <div 
                      className={`h-full ${item.color.split(' ')[0]} transition-all duration-500`}
                      style={{ width: item.showPercentage ? `${item.value}%` : '100%' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Print Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <PrintingReports data={preparePrintData()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportStatus;