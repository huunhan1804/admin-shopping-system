// components/reports/ReportEmpty.jsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

const ReportEmpty = ({ message = "Chọn loại báo cáo và nhấn 'Tạo báo cáo' để xem dữ liệu" }) => {
  return (
    <div className="p-8 text-center text-gray-500">
      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>{message}</p>
    </div>
  );
};

export default ReportEmpty;