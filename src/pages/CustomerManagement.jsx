import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  Ban,
  Check,
  Key,
  RefreshCw,
} from "lucide-react";
import PaginatedTable from "../components/common/PaginatedTable";
import { useConfirmation } from "../hooks/useConfirmation";
import ConfirmationModal from "../components/common/ConfirmationModal";
import apiService from "../services/api";
import ModernSelect from "../components/common/ModernSelect";
import SearchInput from "../components/common/SearchInput";
import userService from "../services/userService";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    loading: false,
  });

  const [filters, setFilters] = useState({
    accountStatus: "",
    membershipLevel: "",
    keyword: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    accountStatuses: [],
    membershipLevels: [],
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const { confirmationState, showConfirmation, closeConfirmation } =
    useConfirmation();

  useEffect(() => {
    loadFilterOptions();
    loadCustomers(0, 20);
  }, [filters]);

  const loadCustomers = async (page = 0, size = customers.pageSize) => {
    setCustomers((prev) => ({ ...prev, loading: true }));

    try {
      const queryParams = new URLSearchParams({
        page,
        size,
        sortBy: "createdDate",
        sortDir: "desc",
        ...filters,
      });

      const data = await userService.getCustomers(queryParams);

      if (data.success) {
        setCustomers({
          content: data.customers || [],
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0,
          currentPage: data.currentPage || 0,
          pageSize: size,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
      setCustomers((prev) => ({
        ...prev,
        loading: false,
        content: [],
        totalElements: 0,
        totalPages: 0,
      }));
    }
  };

  const loadFilterOptions = async () => {
    try {
      const data = await userService.getCustomerFilters();
      setFilterOptions(data);
    } catch (error) {
      console.error("Lỗi khi tải filter options:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePageChange = (page) => {
    loadCustomers(page, customers.pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    loadCustomers(0, newPageSize);
  };

  const getaccountStatusBadgeColor = (accountStatus) => {
    switch (accountStatus) {
      case "ACTIVE":
        return "bg-green-500";
      case "SUSPENDED":
        return "bg-red-500";
      case "INACTIVE":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  // Định nghĩa columns cho PaginatedTable
  const columns = [
    {
      header: "Thông tin khách hàng",
      key: "customerInfo",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.fullname}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
          <div className="text-sm text-gray-500">{row.username}</div>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      key: "accountStatus",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getaccountStatusBadgeColor(
            row.accountStatus
          )}`}
        >
          {row.accountStatus}
        </span>
      ),
    },
    {
      header: "Ngày đăng ký",
      key: "createdDate",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {new Date(row.createdDate).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      header: "Số đơn hàng",
      key: "totalOrders",
      render: (row) => (
        <span className="text-sm text-gray-900 font-medium">
          {row.totalOrders || 0}
        </span>
      ),
    },
    {
      header: "Thao tác",
      key: "actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetail(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.accountStatus === "ACTIVE" ? (
            <button
              onClick={() => handleSuspendCustomer(row)}
              className="text-red-600 hover:text-red-800"
              title="Tạm khóa"
            >
              <Ban className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleActivateCustomer(row.accountId)}
              className="text-green-600 hover:text-green-800"
              title="Kích hoạt"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleResetPassword(row.accountId)}
            className="text-yellow-600 hover:text-yellow-800"
            title="Reset mật khẩu"
          >
            <Key className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleViewDetail = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleSuspendCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowSuspendModal(true);
  };

  const handleActivateCustomer = (customerId) => {
    showConfirmation({
      message: `Bạn có chắc muốn kích hoạt lại tài khoản khách hàng này?`,
      type: "info",
      confirmText: "Kích hoạt",
      onConfirm: async () => {
        try {
          const data = await userService.activateCustomer(customerId);

          if (data.success) {
            alert("Kích hoạt tài khoản thành công");
            loadCustomers(customers.currentPage, customers.pageSize);
          } else {
            alert("Lỗi: " + data.message);
          }
        } catch (error) {
          console.error("Lỗi khi kích hoạt tài khoản:", error);
          alert("Lỗi khi kích hoạt tài khoản");
        }
      },
    });
  };

  const handleResetPassword = (customerId) => {
    showConfirmation({
      message: `Bạn có chắc muốn reset mật khẩu cho khách hàng này?`,
      type: "warning",
      confirmText: "Reset mật khẩu",
      onConfirm: async () => {
        try {
          const data = await userService.resetCustomerPassword(customerId);

          if (data.success) {
            alert("Reset mật khẩu thành công");
          } else {
            alert("Lỗi: " + data.message);
          }
        } catch (error) {
          console.error("Lỗi khi reset mật khẩu:", error);
          alert("Lỗi khi reset mật khẩu");
        }
      },
    });
  };

  const submitSuspend = async () => {
    if (!suspendReason.trim()) {
      alert("Vui lòng nhập lý do tạm khóa");
      return;
    }

    try {
      const data = await userService.suspendCustomer(
        selectedCustomer.accountId,
        { reason: suspendReason }
      );

      if (data.success) {
        alert("Tạm khóa tài khoản thành công");
        setShowSuspendModal(false);
        setSuspendReason("");
        setSelectedCustomer(null);
        loadCustomers(customers.currentPage, customers.pageSize);
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi tạm khóa tài khoản:", error);
      alert("Lỗi khi tạm khóa tài khoản");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="mr-2" />
          Quản lý khách hàng
          <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
            {customers.totalElements}
          </span>
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() =>
              loadCustomers(customers.currentPage, customers.pageSize)
            }
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <SearchInput
              value={filters.keyword}
              onChange={(value) => handleFilterChange("keyword", value)}
              placeholder="Tên, email, username..."
            />
          </div>

          <ModernSelect
            label="Trạng thái"
            value={filters.accountStatus}
            onChange={(value) => handleFilterChange("accountStatus", value)}
            options={filterOptions.accountStatuses || []}
            placeholder="Tất cả trạng thái"
          />
        </div>
      </div>

      {/* Table với PaginatedTable */}
      <PaginatedTable
        data={customers.content}
        columns={columns}
        currentPage={customers.currentPage}
        totalPages={customers.totalPages}
        totalElements={customers.totalElements}
        pageSize={customers.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={customers.loading}
        emptyMessage="Không có khách hàng nào trong hệ thống"
        pageSizeOptions={[10, 20, 50, 100]}
      />

      {/* Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chi tiết khách hàng
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-600 mb-3">
                    Thông tin cá nhân
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Họ tên:</span>{" "}
                      {selectedCustomer.fullname}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedCustomer.email}
                    </div>
                    <div>
                      <span className="font-medium">Username:</span>{" "}
                      {selectedCustomer.username}
                    </div>
                    <div>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {selectedCustomer.phone || "Chưa cập nhật"}
                    </div>
                    <div>
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {selectedCustomer.address || "Chưa cập nhật"}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-blue-600 mb-3">
                    Thông tin tài khoản
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Ngày đăng ký:</span>{" "}
                      {new Date(selectedCustomer.createdDate).toLocaleString(
                        "vi-VN"
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái:</span>
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full text-white ${getaccountStatusBadgeColor(
                          selectedCustomer.accountStatus
                        )}`}
                      >
                        {selectedCustomer.accountStatus}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Tổng đơn hàng:</span>{" "}
                      {selectedCustomer.totalOrders || 0}
                    </div>
                    <div>
                      <span className="font-medium">Tổng chi tiêu:</span>{" "}
                      {selectedCustomer.totalSpent || 0} VNĐ
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tạm khóa tài khoản
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tài khoản: <strong>{selectedCustomer?.fullname}</strong>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do tạm khóa *
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Nhập lý do tạm khóa tài khoản..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowSuspendModal(false);
                    setSuspendReason("");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={submitSuspend}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Tạm khóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal {...confirmationState} onClose={closeConfirmation} />
    </div>
  );
};

export default CustomerManagement;
