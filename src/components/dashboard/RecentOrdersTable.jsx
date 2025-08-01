import React, { useState, useEffect } from 'react';
import PaginatedTable from '../common/PaginatedTable';
import apiService from '../../services/api';

const RecentOrdersTable = ({ orders, showPagination = false }) => {
  const [paginatedData, setPaginatedData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10, // Mặc định 20
    loading: false
  });

  const getStatusColor = (status) => {
    const statusMap = {
      'SHIPPED': 'bg-green-100 text-green-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'đã giao': 'bg-green-100 text-green-800',
      'đã gửi': 'bg-blue-100 text-blue-800',
      'SHIPPING': 'bg-blue-100 text-blue-800',
      'đang giao': 'bg-blue-100 text-blue-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'đã hủy': 'bg-red-100 text-red-800',
      'RETURNED': 'bg-orange-100 text-orange-800',
      'trả hàng': 'bg-orange-100 text-orange-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'chờ xử lý': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-purple-100 text-purple-800',
      'đang xử lý': 'bg-purple-100 text-purple-800',
      'đã xác nhận': 'bg-indigo-100 text-indigo-800'
    };
    
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const translateStatus = (status) => {
    const statusTranslations = {
      'SHIPPED': 'Đã gửi',
      'DELIVERED': 'Đã giao', 
      'SHIPPING': 'Đang giao',
      'CANCELLED': 'Đã hủy',
      'RETURNED': 'Trả hàng',
      'PENDING': 'Chờ xử lý',
      'PROCESSING': 'Đang xử lý',
      'CONFIRMED': 'Đã xác nhận'
    };
    
    return statusTranslations[status?.toUpperCase()] || status;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const columns = [
    {
      header: 'Mã đơn',
      key: 'orderId',
      render: (row) => (
        <span className="font-mono text-blue-600">#{row.orderId}</span>
      ),
      cellClassName: 'font-medium'
    },
    {
      header: 'Khách hàng',
      key: 'customerName',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.customerName}</div>
        </div>
      )
    },
    {
      header: 'Tổng tiền',
      key: 'totalAmount',
      render: (row) => (
        <span className="font-semibold text-green-600">{row.totalAmount}</span>
      ),
      cellClassName: 'text-right'
    },
    {
      header: 'Trạng thái',
      key: 'status',
      render: (row) => {
        const translatedStatus = translateStatus(row.status);
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>
            {translatedStatus}
          </span>
        );
      }
    },
    {
      header: 'Thời gian',
      key: 'orderDate',
      render: (row) => (
        <span className="text-gray-600 text-sm">{formatDate(row.orderDate)}</span>
      ),
      cellClassName: 'text-gray-500'
    }
  ];

  const loadPaginatedData = async (page = 0, size = paginatedData.pageSize) => {
    if (!showPagination) return;

    try {
      setPaginatedData(prev => ({ ...prev, loading: true }));
      
      const response = await apiService.get('/admin/recent-orders/paginated', {
        params: {
          page,
          size,
          sortBy: 'orderDate',
          sortDir: 'desc'
        }
      });

      setPaginatedData({
        content: response.content || [],
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.currentPage || 0,
        pageSize: size,
        loading: false
      });
    } catch (error) {
      console.error('Error loading paginated orders:', error);
      setPaginatedData(prev => ({ 
        ...prev, 
        loading: false,
        content: [],
        totalElements: 0,
        totalPages: 0
      }));
    }
  };

  useEffect(() => {
    if (showPagination) {
      loadPaginatedData(0, 10); // Mặc định 20 records
    }
  }, [showPagination]);

  const handlePageChange = (page) => {
    loadPaginatedData(page, paginatedData.pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    // Reset về trang đầu tiên khi thay đổi page size
    loadPaginatedData(0, newPageSize);
  };

  if (showPagination) {
    return (
      <PaginatedTable
        data={paginatedData.content}
        columns={columns}
        currentPage={paginatedData.currentPage}
        totalPages={paginatedData.totalPages}
        totalElements={paginatedData.totalElements}
        pageSize={paginatedData.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={paginatedData.loading}
        emptyMessage="Không có đơn hàng nào trong hệ thống"
        pageSizeOptions={[10, 20, 50, 100]}
      />
    );
  }

  // Dashboard view (simple table)
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="flex flex-col items-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p>Không có đơn hàng gần đây</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Mã đơn</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Khách hàng</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Tổng tiền</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={`dashboard-order-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-mono text-blue-600">#{order.orderId}</td>
              <td className="py-3 px-4 text-sm font-medium">{order.customerName}</td>
              <td className="py-3 px-4 text-sm font-semibold text-green-600">{order.totalAmount}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {translateStatus(order.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;