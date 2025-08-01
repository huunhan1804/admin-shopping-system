import React, { useState, useEffect } from 'react';
import PaginatedTable from '../common/PaginatedTable';
import apiService from '../../services/api';

const NewUsersTable = ({ users, showPagination = false }) => {
  const [paginatedData, setPaginatedData] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10, // Mặc định 20
    loading: false
  });

  const getRoleColor = (role) => {
    const roleMap = {
      'quản trị viên': 'bg-red-100 text-red-800',
      'administrator': 'bg-red-100 text-red-800',
      'admin': 'bg-red-100 text-red-800',
      'đại lý': 'bg-green-100 text-green-800',
      'agency': 'bg-green-100 text-green-800',
      'khách hàng': 'bg-blue-100 text-blue-800',
      'customer': 'bg-blue-100 text-blue-800'
    };
    
    return roleMap[role?.toLowerCase()] || 'bg-gray-100 text-gray-800';
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
      header: 'Thông tin người dùng',
      key: 'userInfo',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.fullName}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      header: 'Vai trò',
      key: 'role',
      render: (row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(row.role)}`}>
          {row.role}
        </span>
      )
    },
    {
      header: 'Ngày đăng ký',
      key: 'joinDate',
      render: (row) => (
        <span className="text-gray-600 text-sm">{formatDate(row.joinDate)}</span>
      ),
      cellClassName: 'text-gray-500'
    }
  ];

  const loadPaginatedData = async (page = 0, size = paginatedData.pageSize) => {
    if (!showPagination) return;

    try {
      setPaginatedData(prev => ({ ...prev, loading: true }));
      
      const response = await apiService.get('/admin/new-users/paginated', {
        params: {
          page,
          size,
          sortBy: 'createdDate',
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
      console.error('Error loading paginated users:', error);
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
        emptyMessage="Không có người dùng mới trong hệ thống"
        pageSizeOptions={[10, 20, 50, 100]}
      />
    );
  }

  // Dashboard view (simple table)
  if (!users || users.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="flex flex-col items-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <p>Không có người dùng mới</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Tên</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Loại</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày đăng ký</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={`dashboard-user-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-sm font-medium">{user.fullName}</td>
              <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">{formatDate(user.joinDate)}</td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 );
};

export default NewUsersTable;