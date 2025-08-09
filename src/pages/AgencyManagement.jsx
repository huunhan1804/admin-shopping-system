import React, { useState, useEffect } from "react";
import {
  Store,
  Search,
  RefreshCw,
  Eye,
  Ban,
  Check,
  Star,
  FileText,
  ChevronDown,
  ChevronsRight,
  ChevronRight,
  ChevronsLeft,
  ChevronLeft,
} from "lucide-react";
import { useConfirmation } from "../hooks/useConfirmation";
import ConfirmationModal from "../components/common/ConfirmationModal";
import ModernSelect from "../components/common/ModernSelect";
import SearchInput from "../components/common/SearchInput";
import { accountStatusLabels, approvalStatusLabels, mapOptionsWithLabels } from "../utils/labelMappings";
import userService from "../services/userService";
import StatusBadge from '../components/common/StatusBadge';

const AgencyManagement = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const [filters, setFilters] = useState({
    approvalStatus: "",
    keyword: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    approvalStatuses: [],
  });

  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const { confirmationState, showConfirmation, closeConfirmation } =
    useConfirmation();
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeOptions] = useState([10, 20, 50, 100]);

  useEffect(() => {
    loadAgencies();
    loadFilterOptions();
  }, [pagination.currentPage, filters, pageSize]);

  const loadAgencies = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        size: pageSize,
        sortBy: "createdDate",
        sortDir: "desc",
        ...filters,
      });

      const data = await userService.getAgencies(queryParams);

      if (data.success) {
        setAgencies(data.agencies);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách agency:", error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý thay đổi page size
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPagination((prev) => ({ ...prev, currentPage: 0 })); // Reset về trang đầu
  };

  const loadFilterOptions = async () => {
    try {
      const data = await userService.getAgencyFilters();

      if (data.success) {
        setFilterOptions(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải tùy chọn lọc:", error);
    }
  };

  const handleSuspendAgency = async () => {
    if (!selectedAgency || !suspendReason.trim()) return;

    try {
      const data = await userService.suspendAgency(
        selectedAgency.accountId,
        { reason: suspendReason }
      );

      if (data.success) {
        setShowSuspendModal(false);
        setSuspendReason("");
        setSelectedAgency(null);
        loadAgencies();
        alert("Tạm khóa Agency thành công");
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi tạm khóa agency:", error);
      alert("Lỗi khi tạm khóa agency");
    }
  };

  const handleActivateAgency = async (agencyId) => {
    showConfirmation({
      title: "Kích hoạt Agency",
      message: `Bạn có chắc muốn kích hoạt agency này?`,
      type: "info",
      confirmText: "Kích hoạt",
      onConfirm: async () => {
        try {
          const data = await userService.activateAgency(agencyId);

          if (data.success) {
            loadAgencies();
            alert("Kích hoạt Agency thành công");
          } else {
            alert("Lỗi: " + data.message);
          }
        } catch (error) {
          console.error("Lỗi khi kích hoạt agency:", error);
          alert("Lỗi khi kích hoạt agency");
        }
      },
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 0 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(
      0,
      pagination.currentPage - Math.floor(maxVisible / 2)
    );
    let end = Math.min(pagination.totalPages - 1, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(0, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const PaginationButton = ({
    onClick,
    disabled = false,
    active = false,
    children,
    className: buttonClassName = "",
  }) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
      relative inline-flex items-center justify-center px-3 py-2 text-sm font-medium
      border transition-colors duration-200 min-w-[40px] h-10
      ${
        active
          ? "z-10 bg-blue-600 border-blue-600 text-white"
          : disabled
          ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
      }
      ${buttonClassName}
    `}
    >
      {children}
    </button>
  );

  const PageSizeSelector = () => (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">Hiển thị:</span>
      <div className="relative">
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          disabled={loading}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      <span className="text-sm text-gray-700">bản ghi</span>
    </div>
  );

  const renderApprovalStatus = (status) => (
    <StatusBadge 
      status={status} 
      type="approval" 
      labelMapping={approvalStatusLabels} 
    />
  );

  const renderAccountStatus = (status) => (
    <StatusBadge 
      status={status} 
      type="account" 
      labelMapping={accountStatusLabels} 
    />
  );

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Store className="mr-2" />
          Quản lý Agency
          <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
            {pagination.totalElements}
          </span>
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() =>
              (window.location.href = "/users/agencies/applications")
            }
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            <FileText className="w-4 h-4 mr-1" />
            Đơn đăng ký chờ duyệt
          </button>
          <button
            onClick={loadAgencies}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernSelect
            label="Trạng thái phê duyệt"
            value={filters.approvalStatus}
            onChange={(value) => handleFilterChange("approvalStatus", value)}
            options={mapOptionsWithLabels(filterOptions.approvalStatuses, approvalStatusLabels)}
            placeholder="Tất cả trạng thái"
          />

          <div>
            <SearchInput
              value={filters.keyword}
              onChange={(value) => handleFilterChange("keyword", value)}
              placeholder="Tên agency, tên shop, email..."
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin Shop
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá & Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <RefreshCw className="animate-spin h-6 w-6" />
                    </div>
                  </td>
                </tr>
              ) : agencies.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <Store className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <div>Không tìm thấy agency nào</div>
                  </td>
                </tr>
              ) : (
                agencies.map((agency) => {
                  return (
                    <tr key={agency.accountId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">
                            {agency.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {agency.fullname}
                          </div>
                          <div className="text-sm text-gray-500">
                            <i className="fas fa-envelope mr-1"></i>
                            {agency.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            <i className="fas fa-phone mr-1"></i>
                            {agency.phone || "Chưa cập nhật"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium">
                            {agency.businessName || "Chưa cập nhật"}
                          </div>
                          {agency.submittedDate && (
                            <div className="text-sm text-gray-500">
                              Đăng ký:{" "}
                              {new Date(
                                agency.submittedDate
                              ).toLocaleDateString("vi-VN")}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center mb-1">
                          <div className="flex mr-2">
                            {renderStars(agency.storeRating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({agency.totalReviews} đánh giá)
                          </span>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-green-600">
                            {agency.totalRevenue?.toLocaleString()} VND
                          </div>
                          <div className="text-gray-500">Doanh thu</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="mb-1">
                            {renderApprovalStatus(agency.approvalStatus)}
                        </div>
                        <div>
                            {renderAccountStatus(agency.accountStatus)}
                        </div>
                        {agency.banned && (
                          <div className="text-xs text-red-600 mt-1">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Đã bị khóa
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {new Date(agency.createdDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div>
                          {new Date(agency.createdDate).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAgency(agency);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {agency.approvalStatus === "Chờ duyệt" && (
                            <button
                              onClick={() =>
                                (window.location.href =
                                  "/users/agencies/applications")
                              }
                              className="text-purple-600 hover:text-purple-900"
                              title="Xem đơn đăng ký"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}

                          {!agency.banned ? (
                            <button
                              onClick={() => {
                                setSelectedAgency(agency);
                                setShowSuspendModal(true);
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Tạm khóa"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleActivateAgency(agency.accountId)
                              }
                              className="text-green-600 hover:text-green-900"
                              title="Kích hoạt"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(pagination.totalPages > 1 || pagination.totalElements > pageSize) && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            {/* Mobile pagination */}
            <div className="flex items-center justify-between sm:hidden">
              <div className="flex items-center space-x-2">
                <PaginationButton
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevious}
                  className="rounded-l-md"
                >
                  Trước
                </PaginationButton>
                <span className="px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded">
                  {pagination.currentPage + 1} / {pagination.totalPages}
                </span>
                <PaginationButton
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="rounded-r-md"
                >
                  Sau
                </PaginationButton>
              </div>
              <PageSizeSelector />
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{" "}
                    <span className="font-medium">
                      {pagination.totalElements > 0
                        ? pagination.currentPage * pageSize + 1
                        : 0}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium">
                      {Math.min(
                        (pagination.currentPage + 1) * pageSize,
                        pagination.totalElements
                      )}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium">
                      {pagination.totalElements}
                    </span>{" "}
                    kết quả
                  </p>
                </div>
                <PageSizeSelector />
              </div>

              {pagination.totalPages > 1 && (
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {/* First page */}
                    <PaginationButton
                      onClick={() => handlePageChange(0)}
                      disabled={pagination.currentPage === 0}
                      className="rounded-l-md"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </PaginationButton>

                    {/* Previous page */}
                    <PaginationButton
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={!pagination.hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </PaginationButton>

                    {/* Ellipsis before visible pages */}
                    {getVisiblePages()[0] > 0 && (
                      <>
                        <PaginationButton onClick={() => handlePageChange(0)}>
                          1
                        </PaginationButton>
                        {getVisiblePages()[0] > 1 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                      </>
                    )}

                    {/* Visible page numbers */}
                    {getVisiblePages().map((page) => (
                      <PaginationButton
                        key={page}
                        onClick={() => handlePageChange(page)}
                        active={page === pagination.currentPage}
                      >
                        {page + 1}
                      </PaginationButton>
                    ))}

                    {/* Ellipsis after visible pages */}
                    {getVisiblePages()[getVisiblePages().length - 1] <
                      pagination.totalPages - 1 && (
                      <>
                        {getVisiblePages()[getVisiblePages().length - 1] <
                          pagination.totalPages - 2 && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                        <PaginationButton
                          onClick={() =>
                            handlePageChange(pagination.totalPages - 1)
                          }
                        >
                          {pagination.totalPages}
                        </PaginationButton>
                      </>
                    )}

                    {/* Next page */}
                    <PaginationButton
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={!pagination.hasNext}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </PaginationButton>

                    {/* Last page */}
                    <PaginationButton
                      onClick={() =>
                        handlePageChange(pagination.totalPages - 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages - 1
                      }
                      className="rounded-r-md"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </PaginationButton>
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAgency && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chi tiết Agency
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-blue-600 mb-3">
                    Thông tin tài khoản
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Username:</span>{" "}
                      {selectedAgency.username}
                    </div>
                    <div>
                      <span className="font-medium">Họ tên:</span>{" "}
                      {selectedAgency.fullname}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedAgency.email}
                    </div>
                    <div>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {selectedAgency.phone || "Chưa cập nhật"}
                    </div>
                    <div>
                      <span className="font-medium">Ngày đăng ký:</span>{" "}
                      {new Date(selectedAgency.createdDate).toLocaleString(
                        "vi-VN"
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Lần đăng nhập cuối:</span>{" "}
                      {selectedAgency.lastLogin
                        ? new Date(selectedAgency.lastLogin).toLocaleString(
                            "vi-VN"
                          )
                        : "Chưa có"}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-green-600 mb-3">
                    Thông tin kinh doanh
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Tên shop:</span>{" "}
                      {selectedAgency.businessName || "Chưa cập nhật"}
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái phê duyệt:</span>
                      <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-500 text-white">
                        {selectedAgency.approvalStatus}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Ngày nộp hồ sơ:</span>{" "}
                      {selectedAgency.submittedDate
                        ? new Date(selectedAgency.submittedDate).toLocaleString(
                            "vi-VN"
                          )
                        : "Chưa nộp"}
                    </div>
                    <div>
                      <span className="font-medium">Đánh giá shop:</span>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {renderStars(selectedAgency.storeRating)}
                        </div>
                        <span>({selectedAgency.totalReviews} đánh giá)</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Tổng doanh thu:</span>
                      <span className="font-bold text-green-600 ml-1">
                        {selectedAgency.totalRevenue?.toLocaleString()} VND
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái tài khoản:</span>
                      <span className="ml-2 px-2 py-1 text-xs rounded bg-blue-500 text-white">
                        {selectedAgency.accountStatus}
                      </span>
                      {selectedAgency.banned && (
                        <span className="ml-1 px-2 py-1 text-xs rounded bg-red-600 text-white">
                          Đã bị khóa
                        </span>
                      )}
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
      {showSuspendModal && selectedAgency && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tạm khóa Agency
              </h3>

              <p className="mb-4">
                Bạn có chắc muốn tạm khóa agency:{" "}
                <strong>{selectedAgency.fullname}</strong>?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Lý do tạm khóa:
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="3"
                  placeholder="Nhập lý do tạm khóa..."
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <div className="flex">
                  <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                  <div className="text-sm">
                    <strong>Lưu ý:</strong> Agency sẽ không thể bán hàng và sử
                    dụng dịch vụ khi bị tạm khóa.
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowSuspendModal(false);
                    setSuspendReason("");
                    setSelectedAgency(null);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSuspendAgency}
                  disabled={!suspendReason.trim()}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                >
                  Tạm khóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmationState.onConfirm}
        title={confirmationState.title}
        message={confirmationState.message}
        type={confirmationState.type}
        confirmText={confirmationState.confirmText}
        cancelText={confirmationState.cancelText}
      />
    </div>
  );
};

export default AgencyManagement;
