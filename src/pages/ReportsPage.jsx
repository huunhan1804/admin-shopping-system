import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  RefreshCw,
  Download,
} from "lucide-react";
import reportService from "../services/reportService";
import UserAnalytics from "../components/reports/UserAnalytics";
import ProductAnalytics from "../components/reports/ProductAnalytics";
import RevenueReport from "../components/reports/RevenueReport";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ReportSummaryCards from "../components/reports/ReportSummaryCards";
import ReportFilters from "../components/reports/ReportFilters";
import ReportTypeSelector from "../components/reports/ReportTypeSelector";

const ReportsPage = () => {
  const [activeReportType, setActiveReportType] = useState("revenue");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    period: "monthly",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    year: new Date().getFullYear(),
    limit: 10,
  });
  const [summary, setSummary] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // Auto-load default report on mount
    generateReport();
  }, []);

  const reportTypes = [
    {
      id: "revenue",
      label: "Doanh thu nền tảng",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "products",
      label: "Phân tích sản phẩm",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "analytics",
      label: "Hành vi người dùng",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      const params = {
        period: filters.period,
        startDate: filters.startDate,
        endDate: filters.endDate,
        year: filters.year,
        limit: filters.limit,
      };

      switch (activeReportType) {
        case "revenue":
          response = await reportService.getRevenueReport(params);
          break;

        case "products":
          response = await reportService.getProductReport(params);
          break;

        case "analytics":
          response = await reportService.getUserAnalytics(params);
          break;

        default:
          throw new Error("Invalid report type");
      }

      if (response.success) {
        setReportData(response);
        setSummary(response.summary || {});
      } else {
        setError(response.message || "Không thể tạo báo cáo");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Có lỗi xảy ra khi tạo báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      setLoading(true);

      const requestData = {
        reportType: activeReportType,
        period: filters.period,
        startDate: filters.startDate,
        endDate: filters.endDate,
        year: filters.year,
        limit: filters.limit,
      };

      const response = await reportService.exportReport(
        activeReportType,
        requestData
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${activeReportType}_report_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting report:", err);
      alert("Có lỗi xảy ra khi xuất báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReportTypeChange = (reportType) => {
    setActiveReportType(reportType);
    setReportData(null);
    setSummary({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
            Báo cáo và Phân tích
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và phân tích hiệu suất kinh doanh
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={generateReport}
            disabled={loading}
            className="btn btn-secondary"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>

          <button
            onClick={handleExportReport}
            disabled={loading || !reportData}
            className="btn btn-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <ReportTypeSelector
        reportTypes={reportTypes}
        activeType={activeReportType}
        onTypeChange={handleReportTypeChange}
      />

      {/* Filters */}
      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        reportType={activeReportType}
        onGenerateReport={generateReport}
        loading={loading}
      />

      {/* Summary Cards */}
      {summary && Object.keys(summary).length > 0 && (
        <ReportSummaryCards summary={summary} reportType={activeReportType} />
      )}

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow">
        {loading && (
          <div className="p-8">
            <LoadingSpinner size="large" />
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">Lỗi tạo báo cáo</p>
              <p className="text-sm">{error}</p>
            </div>
            <button onClick={generateReport} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && !reportData && (
          <div className="p-8 text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chọn loại báo cáo và nhấn "Tạo báo cáo" để xem dữ liệu</p>
          </div>
        )}

        {!loading && !error && reportData && (
          <>
            {activeReportType === "revenue" && (
              <RevenueReport data={reportData} />
            )}

            {activeReportType === "products" && (
              <ProductAnalytics data={reportData} />
            )}

            {activeReportType === "analytics" && (
              <UserAnalytics data={reportData} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
