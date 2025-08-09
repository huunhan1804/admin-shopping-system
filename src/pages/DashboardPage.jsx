import React, { useEffect, useRef, useState } from 'react';
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
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import NewUsersTable from '../components/dashboard/NewUsersTable';
import DetailModal from '../components/dashboard/DetailModal';
import dashboardService from '../services/dashboardService';

const DashboardPage = () => {
  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: '0 VND'
  });
  const [pendingCounts, setPendingCounts] = useState({
    pendingProducts: 0,
    pendingApplications: 0,
    pendingClaims: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // Loading states per section
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);

  // Error states per section (nếu muốn hiển thị chi tiết)
  const [errorStats, setErrorStats] = useState(null);
  const [errorPending, setErrorPending] = useState(null);
  const [errorOrders, setErrorOrders] = useState(null);
  const [errorUsers, setErrorUsers] = useState(null);
  const [errorRevenue, setErrorRevenue] = useState(null);
  const [errorCategory, setErrorCategory] = useState(null);

  const [modals, setModals] = useState({ orders: false, users: false });

  // mounted guard để tránh setState sau unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  // Loaders tách riêng
  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const res = await dashboardService.getDashboardStats();
      if (!mountedRef.current) return;
      setStats(res || stats);
      setErrorStats(null);
    } catch (e) {
      if (!mountedRef.current) return;
      setErrorStats('Không thể tải thống kê tổng quan');
    } finally {
      if (mountedRef.current) setLoadingStats(false);
    }
  };

  const loadPending = async () => {
    try {
      setLoadingPending(true);
      const res = await dashboardService.getPendingCounts();
      if (!mountedRef.current) return;
      setPendingCounts(res || pendingCounts);
      setErrorPending(null);
    } catch (e) {
      if (!mountedRef.current) return;
      setErrorPending('Không thể tải mục chờ xử lý');
    } finally {
      if (mountedRef.current) setLoadingPending(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await dashboardService.getRecentOrders();
      if (!mountedRef.current) return;
      setRecentOrders((res && res.orders) || []);
      setErrorOrders(null);
    } catch (e) {
      if (!mountedRef.current) return;
      setErrorOrders('Không thể tải đơn hàng gần đây');
    } finally {
      if (mountedRef.current) setLoadingOrders(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await dashboardService.getNewUsers();
      if (!mountedRef.current) return;
      setNewUsers((res && res.users) || []);
      setErrorUsers(null);
    } catch (e) {
      if (!mountedRef.current) return;
      setErrorUsers('Không thể tải người dùng mới');
    } finally {
      if (mountedRef.current) setLoadingUsers(false);
    }
  };

  const loadRevenue = async () => {
    try {
      setLoadingRevenue(true);
      const res = await dashboardService.getRevenueChart();
      if (!mountedRef.current) return;
      setRevenueData(res || []);
      setErrorRevenue(null);
    } catch (e) {
      if (!mountedRef.current) return;
      setErrorRevenue('Không thể tải biểu đồ doanh thu');
    } finally {
      if (mountedRef.current) setLoadingRevenue(false);
    }
  };

  const loadCategory = async () => {
    try {
      setLoadingCategory(true);
      const res = await dashboardService.getCategoryChart();
      if (!mountedRef.current) return;
      setCategoryData(res || []);
      setErrorCategory(null);
    } catch (e) {
      if (!mountedRef.current) return;
      setErrorCategory('Không thể tải thống kê danh mục');
    } finally {
      if (mountedRef.current) setLoadingCategory(false);
    }
  };

  // Gọi tất cả nhưng độc lập
  const reloadAll = () => {
    loadStats();
    loadPending();
    loadOrders();
    loadUsers();
    loadRevenue();
    loadCategory();
  };

  useEffect(() => {
    reloadAll();
    const interval = setInterval(reloadAll, 300000); // 5 phút
    return () => clearInterval(interval);
  }, []);

  const openModal = (modalType) => setModals(prev => ({ ...prev, [modalType]: true }));
  const closeModal = (modalType) => setModals(prev => ({ ...prev, [modalType]: false }));

  const statCards = [
    {
      title: 'TỔNG SẢN PHẨM',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      title: 'TỔNG ĐƠN HÀNG',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600'
    },
    {
      title: 'TỔNG NGƯỜI DÙNG',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      title: 'DOANH THU',
      value: stats.totalRevenue,
      icon: DollarSign,
      color: 'bg-yellow-500',
      gradient: 'from-yellow-400 to-yellow-600'
    }
  ];

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
            onClick={reloadAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Clock className="w-4 h-4 mr-2" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingStats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-7 w-32 bg-gray-200 rounded" />
            </div>
          ))
        ) : errorStats ? (
          <div className="lg:col-span-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {errorStats}
          </div>
        ) : (
          statCards.map((card, index) => <StatsCard key={index} {...card} />)
        )}
      </div>

      {/* Pending Items Alert */}
      <div className={loadingPending ? "min-h-16" : ""}>
        {loadingPending ? (
          <div className="bg-white rounded-lg border p-4">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : errorPending ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {errorPending}
          </div>
        ) : (pendingCounts.pendingProducts > 0 || pendingCounts.pendingApplications > 0) ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-yellow-800 font-medium mb-2">Cần xử lý</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              {pendingCounts.pendingProducts > 0 && (
                <span className="text-yellow-700">
                  <strong>{pendingCounts.pendingProducts}</strong> sản phẩm chờ duyệt
                </span>
              )}
              {pendingCounts.pendingApplications > 0 && (
                <span className="text-yellow-700">
                  <strong>{pendingCounts.pendingApplications}</strong> đơn đăng ký Agency
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Doanh thu 30 ngày qua</h2>
            </div>
            {loadingRevenue ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : errorRevenue ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {errorRevenue}
              </div>
            ) : (
              <RevenueChart data={revenueData} />
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <PieChart className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold">Thống kê danh mục</h2>
            </div>
            {loadingCategory ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : errorCategory ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {errorCategory}
              </div>
            ) : (
              <CategoryChart data={categoryData} />
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders */}
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
            {loadingOrders ? (
              <div className="flex items-center justify-center h-40">
                <LoadingSpinner />
              </div>
            ) : errorOrders ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {errorOrders}
              </div>
            ) : (
              <RecentOrdersTable orders={recentOrders} />
            )}
          </div>
        </div>

        {/* Users */}
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
            {loadingUsers ? (
              <div className="flex items-center justify-center h-40">
                <LoadingSpinner />
              </div>
            ) : errorUsers ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {errorUsers}
              </div>
            ) : (
              <NewUsersTable users={newUsers} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <DetailModal
        isOpen={modals.orders}
        onClose={() => closeModal('orders')}
        title="Tất cả đơn hàng gần đây"
      >
        {loadingOrders ? (
          <div className="flex items-center justify-center h-40">
            <LoadingSpinner />
          </div>
        ) : (
          <RecentOrdersTable orders={recentOrders} showPagination={true} />
        )}
      </DetailModal>

      <DetailModal
        isOpen={modals.users}
        onClose={() => closeModal('users')}
        title="Tất cả người dùng mới"
      >
        {loadingUsers ? (
          <div className="flex items-center justify-center h-40">
            <LoadingSpinner />
          </div>
        ) : (
          <NewUsersTable users={newUsers} showPagination={true} />
        )}
      </DetailModal>
    </div>
  );
};

export default DashboardPage;
