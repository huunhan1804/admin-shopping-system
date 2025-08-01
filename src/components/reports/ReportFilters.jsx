import React from 'react';
import { Calendar, Filter, BarChart3 } from 'lucide-react';
import ModernSelect from '../common/ModernSelect';

const ReportFilters = ({ filters, onFilterChange, reportType, onGenerateReport, loading }) => {
  const periodOptions = [
    { value: 'daily', label: 'Theo ngày' },
    { value: 'monthly', label: 'Theo tháng' },
    { value: 'quarterly', label: 'Theo quý' },
    { value: 'yearly', label: 'Theo năm' }
  ];

  const limitOptions = [
    { value: 5, label: '5 sản phẩm' },
    { value: 10, label: '10 sản phẩm' },
    { value: 20, label: '20 sản phẩm' },
    { value: 50, label: '50 sản phẩm' }
  ];

  const yearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 10; i--) {
      years.push({ value: i, label: i.toString() });
    }
    return years;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-100 rounded-lg mr-3">
          <Filter className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc báo cáo</h3>
          <p className="text-sm text-gray-600">Tùy chỉnh thông số để tạo báo cáo phù hợp</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Period Selector - Only for revenue reports */}
        {reportType === 'revenue' && (
          <ModernSelect
            label="Chu kỳ báo cáo"
            value={filters.period}
            onChange={(value) => onFilterChange('period', value)}
            options={periodOptions}
            placeholder="Chọn chu kỳ"
            size="md"
            required
          />
        )}
        
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Từ ngày
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            max={filters.endDate}
          />
        </div>
        
        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Đến ngày
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            min={filters.startDate}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        {/* Year - for quarterly/yearly reports */}
        {reportType === 'revenue' && ['quarterly', 'yearly'].includes(filters.period) && (
          <ModernSelect
            label="Năm"
            value={filters.year}
            onChange={(value) => onFilterChange('year', parseInt(value))}
            options={yearOptions()}
            placeholder="Chọn năm"
            size="md"
            required
          />
        )}
        
        {/* Limit - for products reports */}
        {reportType === 'products' && (
          <ModernSelect
            label="Số lượng hiển thị"
            value={filters.limit}
            onChange={(value) => onFilterChange('limit', parseInt(value))}
            options={limitOptions}
            placeholder="Chọn số lượng"
            size="md"
            required
          />
        )}
        
        {/* Generate Report Button */}
        <div className="flex items-end">
          <button
            onClick={onGenerateReport}
            disabled={loading}
            className={`
              w-full flex items-center justify-center px-4 py-3 
              bg-blue-600 text-white rounded-lg font-medium
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              ${loading ? 'animate-pulse' : ''}
            `}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {loading ? 'Đang tạo...' : 'Tạo báo cáo'}
          </button>
        </div>
      </div>

      {/* Date Range Validation Message */}
      {filters.startDate && filters.endDate && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center text-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Khoảng thời gian: <strong>
                {new Date(filters.startDate).toLocaleDateString('vi-VN')}
              </strong> đến <strong>
                {new Date(filters.endDate).toLocaleDateString('vi-VN')}
              </strong>
              {(() => {
                const diffTime = Math.abs(new Date(filters.endDate) - new Date(filters.startDate));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return ` (${diffDays} ngày)`;
              })()}
            </span>
          </div>
        </div>
      )}

      {/* Quick Date Range Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Chọn nhanh khoảng thời gian:</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '7 ngày qua', days: 7 },
            { label: '30 ngày qua', days: 30 },
            { label: '90 ngày qua', days: 90 },
            { label: 'Tháng này', type: 'thisMonth' },
            { label: 'Tháng trước', type: 'lastMonth' },
            { label: 'Quý này', type: 'thisQuarter' },
            { label: 'Năm này', type: 'thisYear' }
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                const today = new Date();
                let startDate, endDate;

                if (preset.days) {
                  startDate = new Date(today - preset.days * 24 * 60 * 60 * 1000);
                  endDate = today;
                } else if (preset.type === 'thisMonth') {
                  startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                  endDate = today;
                } else if (preset.type === 'lastMonth') {
                  startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                  endDate = new Date(today.getFullYear(), today.getMonth(), 0);
                } else if (preset.type === 'thisQuarter') {
                  const quarter = Math.floor(today.getMonth() / 3);
                  startDate = new Date(today.getFullYear(), quarter * 3, 1);
                  endDate = today;
                } else if (preset.type === 'thisYear') {
                  startDate = new Date(today.getFullYear(), 0, 1);
                  endDate = today;
                }

                onFilterChange('startDate', startDate.toISOString().split('T')[0]);
                onFilterChange('endDate', endDate.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;