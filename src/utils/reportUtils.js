// utils/reportUtils.js
export const formatCurrency = (value) => {
  if (typeof value === 'string' && value.includes('VND')) return value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value || 0);
};

export const formatNumber = (value) => {
  if (typeof value === 'string') return value;
  return new Intl.NumberFormat('vi-VN').format(value || 0);
};

export const formatPercentage = (value) => {
  return `${(value || 0).toFixed(2)}%`;
};

export const getDateRange = (period) => {
  const end = new Date();
  let start = new Date();
  
  switch (period) {
    case 'daily':
      start.setDate(end.getDate() - 7);
      break;
    case 'monthly':
      start.setMonth(end.getMonth() - 12);
      break;
    case 'quarterly':
      start.setFullYear(end.getFullYear() - 1);
      break;
    case 'yearly':
      start.setFullYear(end.getFullYear() - 5);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }
  
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
};

export const getReportTitle = (reportType, period) => {
  const titles = {
    revenue: 'Báo cáo Doanh thu',
    products: 'Phân tích Sản phẩm',
    analytics: 'Phân tích Người dùng'
  };
  
  const periods = {
    daily: 'theo ngày',
    monthly: 'theo tháng',
    quarterly: 'theo quý',
    yearly: 'theo năm'
  };
  
  return `${titles[reportType]} ${periods[period] || ''}`;
};

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (start > end) {
    return 'Ngày bắt đầu không thể sau ngày kết thúc';
  }
  
  if (end > now) {
    return 'Ngày kết thúc không thể trong tương lai';
  }
  
  const diffDays = (end - start) / (1000 * 60 * 60 * 24);
  if (diffDays > 365) {
    return 'Khoảng thời gian không thể vượt quá 365 ngày';
  }
  
  return null;
};

export const getColorPalette = (index) => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  return colors[index % colors.length];
};