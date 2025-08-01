// components/insurance/SeverityBadge.jsx
import React from 'react';
import { AlertTriangle, AlertCircle, Info, Minus } from 'lucide-react';

const SeverityBadge = ({ severity }) => {
  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          label: 'Nghiêm trọng',
          className: 'bg-red-100 text-red-800 border-red-200 animate-pulse',
          icon: AlertTriangle,
          textClass: 'font-bold'
        };
      case 'HIGH':
        return {
          label: 'Cao',
          className: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle,
          textClass: 'font-medium'
        };
      case 'MEDIUM':
        return {
          label: 'Trung bình',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: AlertCircle,
          textClass: 'font-medium'
        };
      case 'LOW':
        return {
          label: 'Thấp',
          className: 'bg-green-100 text-green-800 border-green-200',
          icon: Info,
          textClass: 'font-medium'
        };
      default:
        return {
          label: severity,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Minus,
          textClass: 'font-medium'
        };
    }
  };

  const config = getSeverityConfig(severity);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${config.className} ${config.textClass}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default SeverityBadge;