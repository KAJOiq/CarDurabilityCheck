import React from 'react';
import { 
  ClipboardDocumentIcon,
  ListBulletIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ReportStatus = () => {
  const statusItems = [
    { 
      title: 'Total Tasks',
      value: 21,
      icon: ClipboardDocumentIcon,
      color: 'bg-blue-100 text-blue-600',
      showPercentage: false
    },
    { 
      title: 'To Do',
      value: 35,
      icon: ListBulletIcon,
      color: 'bg-orange-100 text-orange-600',
      showPercentage: true
    },
    { 
      title: 'In Progress',
      value: 12,
      icon: ClockIcon,
      color: 'bg-yellow-100 text-yellow-600',
      showPercentage: true
    },
    { 
      title: 'Done',
      value: 53,
      icon: CheckCircleIcon,
      color: 'bg-green-100 text-green-600',
      showPercentage: true
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Task Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusItems.map((item, index) => (
          <div 
            key={index}
            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow 
            duration-200 border-l-4 border-transparent hover:border-current group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{item.title}</p>
                <p className={`text-3xl font-semibold ${item.color.split(' ')[1]}`}>
                  {item.value}
                  {item.showPercentage && '%'}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${item.color} 
                group-hover:bg-opacity-20 transition-colors`}>
                <item.icon className={`w-6 h-6 ${item.color.split(' ')[1]}`} />
              </div>
            </div>
            
            <div className="mt-3">
              <div className="h-1 bg-gray-200 rounded-full">
                <div 
                  className={`h-1 rounded-full ${item.color.split(' ')[0]} transition-all duration-500`}
                  style={{ width: item.showPercentage ? `${item.value}%` : '100%' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportStatus;