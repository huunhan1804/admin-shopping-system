import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Shield,
  Search,
  Filter,
  Eye,
  Mail,
  Store,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Calendar,
} from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Pagination from "../components/common/Pagination";
import ClaimStatusBadge from "../components/insurance/ClaimStatusBadge";
import SeverityBadge from "../components/insurance/SeverityBadge";
import ContactModal from "../components/insurance/ContactModal";
import ModernSelect from "../components/common/ModernSelect";
import SearchInput from "../components/common/SearchInput";
import {
  insuranceStatusLabels,
  severityLevelLabels,
  mapOptionsWithLabels,
} from "../utils/labelMappings";
import insuranceService from "../services/insuranceService";

const InsuranceManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    status: searchParams.get("status") || "",
    severityLevel: searchParams.get("severityLevel") || "",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
    page: parseInt(searchParams.get("page")) || 0,
    size: parseInt(searchParams.get("size")) || 10,
    sortBy: searchParams.get("sortBy") || "submittedDate",
    sortDir: searchParams.get("sortDir") || "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    pageSize: 10,
  });
  const [filterOptions, setFilterOptions] = useState({
    statuses: [],
    severityLevels: [],
  });
  const [stats, setStats] = useState({});
  const [contactModal, setContactModal] = useState({
    show: false,
    type: "",
    claimId: null,
    recipientId: null,
    recipientName: "",
    claimCode: "",
  });

  useEffect(() => {
    loadClaims();
    loadFilterOptions();
    loadStats();
  }, [filters]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const response = await insuranceService.getClaims(filters);

      if (response.success) {
        setClaims(response.data.content);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          pageSize: response.pageSize,
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi tải danh sách yêu cầu bảo hiểm");
      console.error("Error loading claims:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const response = await insuranceService.getFilterOptions();
      if (response.success) {
        setFilterOptions(response.data);
      }
    } catch (err) {
      console.error("Error loading filter options:", err);
      // Fallback to default options
      setFilterOptions({
        statuses: [
          "SUBMITTED",
          "UNDER_REVIEW",
          "PENDING_DOCUMENTS",
          "APPROVED",
          "REJECTED",
          "CLOSED",
        ],
        severityLevels: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      });
    }
  };

  const loadStats = async () => {
    try {
      const response = await insuranceService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 0, // Reset to first page when filtering
    }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      status: "",
      severityLevel: "",
      dateFrom: "",
      dateTo: "",
      page: 0,
      size: 10,
      sortBy: "submittedDate",
      sortDir: "desc",
    });
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSort = (sortBy) => {
    const newSortDir =
      filters.sortBy === sortBy && filters.sortDir === "desc" ? "asc" : "desc";
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortDir: newSortDir,
    }));
  };

  const openContactModal = (
    type,
    claimId,
    recipientId,
    recipientName,
    claimCode
  ) => {
    setContactModal({
      show: true,
      type,
      claimId,
      recipientId,
      recipientName,
      claimCode,
    });
  };

  const closeContactModal = () => {
    setContactModal({
      show: false,
      type: "",
      claimId: null,
      recipientId: null,
      recipientName: "",
      claimCode: "",
    });
  };

  const handleContactSubmit = async (formData) => {
    try {
      const response = await insuranceService.sendCommunication(formData);
      if (response.success) {
        alert("Gửi email thành công!");
        closeContactModal();
        loadClaims(); // Refresh to show updated communication
      } else {
        alert("Có lỗi xảy ra: " + response.message);
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi gửi email");
      console.error("Error sending communication:", err);
    }
  };

  const getStatusButtonClass = (status) => {
    const isActive = filters.status === status;
    const baseClass =
      "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors";

    switch (status) {
      case "SUBMITTED":
        return `${baseClass} ${
          isActive
            ? "bg-yellow-500 text-white"
            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        }`;
      case "UNDER_REVIEW":
        return `${baseClass} ${
          isActive
            ? "bg-blue-500 text-white"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`;
      case "APPROVED":
        return `${baseClass} ${
          isActive
            ? "bg-green-500 text-white"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`;
      case "REJECTED":
        return `${baseClass} ${
          isActive
            ? "bg-red-500 text-white"
            : "bg-red-100 text-red-700 hover:bg-red-200"
        }`;
      default:
        return `${baseClass} ${
          isActive
            ? "bg-gray-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`;
    }
  };

  const hasActiveFilters =
    filters.keyword ||
    filters.status ||
    filters.severityLevel ||
    filters.dateFrom ||
    filters.dateTo;

  if (loading && claims.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Quản lý yêu cầu bảo hiểm
          </h1>
          <p className="text-gray-600 mt-1">
            Tổng cộng {pagination.totalElements} yêu cầu
          </p>
        </div>

        <button
          onClick={loadClaims}
          className="btn btn-secondary flex items-center"
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng yêu cầu</p>
              <p className="text-2xl font-bold">{stats.totalClaims || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Chờ xử lý</p>
              <p className="text-2xl font-bold">{stats.submittedCount || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Đã duyệt</p>
              <p className="text-2xl font-bold">{stats.approvedCount || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Tỷ lệ duyệt</p>
              <p className="text-2xl font-bold">
                {stats.totalClaims > 0
                  ? (
                      ((stats.approvedCount || 0) / stats.totalClaims) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Lọc theo trạng thái
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 flex items-center"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleFilterChange("status", "")}
            className={getStatusButtonClass("")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Tất cả ({stats.totalClaims || 0})
          </button>

          {filterOptions.statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange("status", status)}
              className={getStatusButtonClass(status)}
            >
              {status === "SUBMITTED" && <Clock className="w-4 h-4 mr-2" />}
              {status === "UNDER_REVIEW" && <Search className="w-4 h-4 mr-2" />}
              {status === "APPROVED" && (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              {status === "REJECTED" && <XCircle className="w-4 h-4 mr-2" />}
              {!["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"].includes(
                status
              ) && <FileText className="w-4 h-4 mr-2" />}
              {insuranceStatusLabels[status]} (
              {stats[`${status.toLowerCase()}Count`] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Bộ lọc nâng cao
                </h3>
                <p className="text-sm text-gray-600">
                  Tìm kiếm chi tiết theo nhiều tiêu chí
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Date Range */}
          {/* Responsive grid - Mobile: 1 cột, Tablet: 2 cột, Desktop: 4 cột */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Từ ngày */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                max={filters.dateTo || new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Đến ngày */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                min={filters.dateFrom}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Severity Level Filter */}
            <div>
              <ModernSelect
                label="Mức độ nghiêm trọng"
                value={filters.severityLevel}
                onChange={(value) => handleFilterChange("severityLevel", value)}
                options={mapOptionsWithLabels(
                  filterOptions.severityLevels,
                  severityLevelLabels
                )}
                placeholder="Tất cả mức độ"
                clearable={true}
                clearLabel="Tất cả"
                size="md"
              />
            </div>

            {/* Search Input */}
            <div>
              <SearchInput
                label="Tìm kiếm"
                value={filters.keyword}
                onChange={(value) => handleFilterChange("keyword", value)}
                placeholder="Mã, tên, email..."
                size="md"
              />
            </div>

            {/* Quick Date Range Buttons */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Chọn nhanh thời gian:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Hôm nay", days: 0 },
                  { label: "7 ngày qua", days: 7 },
                  { label: "30 ngày qua", days: 30 },
                  { label: "Tháng này", type: "thisMonth" },
                  { label: "Tháng trước", type: "lastMonth" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const today = new Date();
                      let startDate, endDate;

                      if (preset.days !== undefined) {
                        if (preset.days === 0) {
                          startDate = endDate = today;
                        } else {
                          startDate = new Date(
                            today - preset.days * 24 * 60 * 60 * 1000
                          );
                          endDate = today;
                        }
                      } else if (preset.type === "thisMonth") {
                        startDate = new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          1
                        );
                        endDate = today;
                      } else if (preset.type === "lastMonth") {
                        startDate = new Date(
                          today.getFullYear(),
                          today.getMonth() - 1,
                          1
                        );
                        endDate = new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          0
                        );
                      }

                      handleFilterChange(
                        "dateFrom",
                        startDate.toISOString().split("T")[0]
                      );
                      handleFilterChange(
                        "dateTo",
                        endDate.toISOString().split("T")[0]
                      );
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}

                {/* Clear dates button */}
                {(filters.dateFrom || filters.dateTo) && (
                  <button
                    onClick={() => {
                      handleFilterChange("dateFrom", "");
                      handleFilterChange("dateTo", "");
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Xóa ngày
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900">
                  Bộ lọc đang áp dụng:
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.status && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Trạng thái: {insuranceStatusLabels[filters.status]}
                    <button
                      onClick={() => handleFilterChange("status", "")}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.severityLevel && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    Mức độ: {severityLevelLabels[filters.severityLevel]}
                    <button
                      onClick={() => handleFilterChange("severityLevel", "")}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {filters.keyword && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Tìm kiếm: "{filters.keyword}"
                    <button
                      onClick={() => handleFilterChange("keyword", "")}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(filters.dateFrom || filters.dateTo) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Thời gian: {filters.dateFrom || "..."} -{" "}
                    {filters.dateTo || "..."}
                    <button
                      onClick={() => {
                        handleFilterChange("dateFrom", "");
                        handleFilterChange("dateTo", "");
                      }}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("claimCode")}
                >
                  <div className="flex items-center">
                    Mã yêu cầu
                    {filters.sortBy === "claimCode" && (
                      <span className="ml-1">
                        {filters.sortDir === "desc" ? "↓" : "↑"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mức độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("submittedDate")}
                >
                  <div className="flex items-center">
                    Ngày tạo
                    {filters.sortBy === "submittedDate" && (
                      <span className="ml-1">
                        {filters.sortDir === "desc" ? "↓" : "↑"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.length > 0 ? (
                claims.map((claim) => (
                  <tr key={claim.claimId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-blue-600">
                        {claim.claimCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {claim.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {claim.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {claim.productName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {claim.agencyName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {claim.agencyEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SeverityBadge severity={claim.severityLevel} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ClaimStatusBadge status={claim.claimStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(claim.submittedDate).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/insurance/review/${claim.claimId}`)
                          }
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            openContactModal(
                              "ADMIN_TO_CUSTOMER",
                              claim.claimId,
                              claim.customerId,
                              claim.customerName,
                              claim.claimCode
                            )
                          }
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Liên hệ khách hàng"
                        >
                          <User className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            openContactModal(
                              "ADMIN_TO_AGENCY",
                              claim.claimId,
                              claim.agencyId,
                              claim.agencyName,
                              claim.claimCode
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Liên hệ Agency"
                        >
                          <Store className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">
                        Không tìm thấy yêu cầu nào
                      </p>
                      <p className="text-gray-400 text-sm">
                        Thử thay đổi bộ lọc để xem thêm kết quả
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {pagination.currentPage * pagination.pageSize + 1}
                </span>{" "}
                -{" "}
                <span className="font-medium">
                  {Math.min(
                    (pagination.currentPage + 1) * pagination.pageSize,
                    pagination.totalElements
                  )}
                </span>{" "}
                trong{" "}
                <span className="font-medium">{pagination.totalElements}</span>{" "}
                kết quả
              </div>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <ContactModal
        show={contactModal.show}
        onClose={closeContactModal}
        onSubmit={handleContactSubmit}
        type={contactModal.type}
        claimId={contactModal.claimId}
        recipientId={contactModal.recipientId}
        recipientName={contactModal.recipientName}
        claimCode={contactModal.claimCode}
      />

      {/* Error Alert */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <p className="text-red-800 font-medium">Có lỗi xảy ra</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-400 hover:text-red-600"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceManagement;
