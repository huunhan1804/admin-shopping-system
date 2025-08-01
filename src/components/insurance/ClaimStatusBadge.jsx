// components/insurance/ClaimStatusBadge.jsx
import React from 'react';
import { Clock, Search, CheckCircle, XCircle, AlertCircle, Archive } from 'lucide-react';

const ClaimStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return {
          label: 'Đã nộp',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock
        };
      case 'UNDER_REVIEW':
        return {
          label: 'Đang xem xét',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Search
        };
      case 'PENDING_DOCUMENTS':
        return {
          label: 'Chờ bổ sung',
          className: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: AlertCircle
        };
      case 'APPROVED':
        return {
          label: 'Chấp thuận',
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle
        };
      case 'REJECTED':
        return {
          label: 'Từ chối',
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle
        };
      case 'CLOSED':
        return {
          label: 'Đóng',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Archive
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default ClaimStatusBadge;