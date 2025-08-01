import React from 'react';

const ReportTypeSelector = ({ reportTypes, activeType, onTypeChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Chọn loại báo cáo
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTypes.map((type) => {
          const IconComponent = type.icon;
          const isActive = activeType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isActive 
                  ? `border-blue-500 ${type.bgColor} ${type.color}` 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center">
                <IconComponent className={`w-6 h-6 mr-3 ${isActive ? type.color : 'text-gray-400'}`} />
                <div>
                  <h4 className={`font-medium ${isActive ? type.color : 'text-gray-900'}`}>
                    {type.label}
                  </h4>
                  <p className={`text-sm ${isActive ? type.color.replace('600', '500') : 'text-gray-500'}`}>
                    {type.id === 'revenue' && 'Doanh thu và lợi nhuận'}
                    {type.id === 'products' && 'Sản phẩm bán chạy'}
                    {type.id === 'analytics' && 'Thống kê người dùng'}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportTypeSelector;