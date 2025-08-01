import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, BarChart3 } from 'lucide-react';

const ReportSummaryCards = ({ summary, reportType }) => {
  const formatNumber = (value) => {
    if (typeof value === 'string') return value;
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const formatCurrency = (value) => {
    if (typeof value === 'string' && value.includes('VND')) return value;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getSummaryCards = () => {
    switch (reportType) {
      case 'revenue':
        return [
          {
            title: 'Tổng doanh thu',
            value: formatCurrency(summary.totalRevenue || 0),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Doanh thu giao dịch',
            value: formatCurrency(summary.totalTransactions || 0),
            icon: TrendingUp,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Hoa hồng',
            value: formatCurrency(summary.totalCommission || 0),
            icon: BarChart3,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Tăng trưởng',
            value: summary.growth || '0%',
            icon: summary.growth?.includes('-') ? TrendingDown : TrendingUp,
            color: summary.growth?.includes('-') ? 'text-red-600' : 'text-green-600',
            bgColor: summary.growth?.includes('-') ? 'bg-red-50' : 'bg-green-50'
          }
        ];
        
      case 'products':
        return [
          {
            title: 'Tổng sản phẩm',
            value: formatNumber(summary.totalProducts || 0),
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Danh mục',
            value: formatNumber(summary.totalCategories || 0),
            icon: BarChart3,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Lượt xem',
            value: formatNumber(summary.totalViews || 0),
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Tỷ lệ chuyển đổi',
            value: summary.conversionRate || '0%',
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          }
        ];
        
      case 'analytics':
        return [
          {
            title: 'Tổng phiên',
            value: formatNumber(summary.totalSessions || 0),
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Lượt xem trang',
            value: formatNumber(summary.totalPageViews || 0),
            icon: BarChart3,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Tỷ lệ thoát',
            value: summary.bounceRate ? `${summary.bounceRate}%` : '0%',
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
          },
          {
            title: 'Tỷ lệ chuyển đổi',
            value: summary.conversionRate ? `${summary.conversionRate}%` : '0%',
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ];
        
      default:
        return [];
    }
  };

  const summaryCards = getSummaryCards();

  if (summaryCards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon;
        
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${card.bgColor} mr-4`}>
                <IconComponent className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportSummaryCards;