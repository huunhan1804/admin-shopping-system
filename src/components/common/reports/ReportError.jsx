// components/reports/ReportError.jsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ReportError = ({ error, onRetry }) => {
  return (
    <div className="p-8 text-center">
      <div className="text-red-600 mb-4">
        <AlertCircle className="w-12 h-12 mx-auto mb-2" />
        <h3 className="text-lg font-medium">Lỗi tạo báo cáo</h3>
        <p className="text-sm text-gray-600 mt-1">{error}</p>
      </div>
      <button
        onClick={onRetry}
        className="btn btn-primary"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Thử lại
      </button>
    </div>
  );
};

export default ReportError;