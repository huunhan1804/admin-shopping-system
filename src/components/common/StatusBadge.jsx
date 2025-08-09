// components/common/StatusBadge.jsx
import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Ban, 
  Pause, 
  Search, 
  Archive,
  HelpCircle, 
  Dot
} from 'lucide-react';
import { getStatusBadge, getLabel } from '../../utils/labelMappings';

const iconMap = {
  'clock': Clock,
  'check': Dot,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'ban': Ban,
  'pause': Pause,
  'search': Search,
  'archive': Archive,
  'help-circle': HelpCircle
};

const StatusBadge = ({ status, type, labelMapping, showIcon = true, size = 'sm' }) => {
  const config = getStatusBadge(status, type);
  console.log('StatusBadge config:', config);
  const label = getLabel(status, labelMapping);
  const Icon = iconMap[config.icon] || HelpCircle;


  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-0.5 text-xs', 
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center ${sizes[size]} rounded-full font-medium border ${config.color}`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </span>
  );
};

export default StatusBadge;