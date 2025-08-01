import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Clock,
  UserPlus,
  TrendingUp,
  PieChart,
  ExternalLink
} from 'lucide-react';
import apiService from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import NewUsersTable from '../components/dashboard/NewUsersTable';
import DetailModal from '../components/dashboard/DetailModal';
import dashboardService from '../services/dashboardService';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: '0 VND'
    },
    pendingCounts: {
      pendingProducts: 0,
      pendingApplications: 0,
      pendingClaims: 0
    },
    recentOrders: [],
    newUsers: [],
    revenueData: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modals, setModals] = useState({
    orders: false,
    users: false
  });

  useEffect(() => {
    loadDashboardData();
    // Auto refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all dashboard data in parallel
      const [
        statsResponse,
        pendingCountsResponse,
        recentOrdersResponse,
        newUsersResponse,
        revenueChartResponse,
        categoryChartResponse
      ] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getPendingCounts(),
        dashboardService.getRecentOrders(),
        dashboardService.getNewUsers(),
        dashboardService.getRevenueChart(),
        dashboardService.getCategoryChart()
      ]);

      setDashboardData({
        stats: statsResponse || dashboardData.stats,
        pendingCounts: pendingCountsResponse || dashboardData.pendingCounts,
        recentOrders: recentOrdersResponse.orders || [],
        newUsers: newUsersResponse.users || [],
        revenueData: revenueChartResponse || {},
        categoryData: categoryChartResponse || {}
      });

      setError(null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  };

  const statCards = [
    {
      title: 'TỔNG SẢN PHẨM',
      value: dashboardData.stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      title: 'TỔNG ĐƠN HÀNG',
      value: dashboardData.stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600'
    },
    {
      title: 'TỔNG NGƯỜI DÙNG',
      value: dashboardData.stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      title: 'DOANH THU',
      value: dashboardData.stats.totalRevenue,
      icon: DollarSign,
      color: 'bg-yellow-500',
      gradient: 'from-yellow-400 to-yellow-600'
    }
  ];

  if (loading && !dashboardData.stats.totalProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="mr-3 text-blue-600" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống CTU Shop</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Export
          </button>
          <button 
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Clock className="w-4 h-4 mr-2" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Pending Items Alert */}
      {(dashboardData.pendingCounts.pendingProducts > 0 || 
        dashboardData.pendingCounts.pendingApplications > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">Cần xử lý</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            {dashboardData.pendingCounts.pendingProducts > 0 && (
              <span className="text-yellow-700">
                <strong>{dashboardData.pendingCounts.pendingProducts}</strong> sản phẩm chờ duyệt
              </span>
            )}
            {dashboardData.pendingCounts.pendingApplications > 0 && (
              <span className="text-yellow-700">
                <strong>{dashboardData.pendingCounts.pendingApplications}</strong> đơn đăng ký Agency
              </span>
            )}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Doanh thu 30 ngày qua</h2>
            </div>
            <RevenueChart data={dashboardData.revenueData} />
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <PieChart className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold">Thống kê danh mục</h2>
            </div>
            <CategoryChart data={dashboardData.categoryData} />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
              </div>
              <button
                onClick={() => openModal('orders')}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                Xem tất cả
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <RecentOrdersTable orders={dashboardData.recentOrders} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserPlus className="w-5 h-5 text-green-600 mr-2" />
                <h2 className="text-lg font-semibold">Người dùng mới</h2>
              </div>
              <button
                onClick={() => openModal('users')}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                Xem tất cả
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <NewUsersTable users={dashboardData.newUsers} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <DetailModal
        isOpen={modals.orders}
        onClose={() => closeModal('orders')}
        title="Tất cả đơn hàng gần đây"
      >
        <RecentOrdersTable showPagination={true} />
      </DetailModal>

      <DetailModal
        isOpen={modals.users}
        onClose={() => closeModal('users')}
        title="Tất cả người dùng mới"
      >
        <NewUsersTable showPagination={true} />
      </DetailModal>
    </div>
  );
};

export default DashboardPage;