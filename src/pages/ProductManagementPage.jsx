import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  Clock,
  RefreshCw,
} from "lucide-react";
import PaginatedTable from "../components/common/PaginatedTable";
import ProductFilters from "../components/products/ProductFilters";
import ProductActions from "../components/products/ProductActions";
import Toast from "../components/common/Toast";
import productService from "../services/productService";

const ProductManagementPage = () => {
  const [products, setProducts] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    loading: false,
  });

  const [filters, setFilters] = useState({
    status: "",
    categoryId: "", // Đổi từ category thành categoryId
    agencyId: "", // Đổi từ agency thành agencyId
    keyword: "",
    sortBy: "createdDate",
    sortDir: "desc",
  });

  // Cập nhật loadProducts function
  const loadProducts = useCallback(async (
    page = 0,
    size = 20,
    currentFilters = null
  ) => {
    try {
      setProducts((prev) => ({ ...prev, loading: true }));

      // Sử dụng currentFilters nếu được truyền, không thì dùng filters hiện tại
      const filtersToUse = currentFilters || filters;

      const params = {
        page,
        size,
        sortBy: filtersToUse.sortBy,
        sortDir: filtersToUse.sortDir,
        ...(filtersToUse.status && { status: filtersToUse.status }),
        ...(filtersToUse.categoryId && { categoryId: filtersToUse.categoryId }),
        ...(filtersToUse.agencyId && { agencyId: filtersToUse.agencyId }),
        ...(filtersToUse.keyword && { keyword: filtersToUse.keyword }),
      };

      console.log('Loading products with params:', params); // Debug

      const response = await productService.getProducts(params);

      if (response.success) {
        setProducts({
          content: response.content || [],
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
          currentPage: response.currentPage || page,
          pageSize: size,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts((prev) => ({ ...prev, loading: false }));
      showToast("error", "Không thể tải danh sách sản phẩm");
    }
  }, [filters]);

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    agencies: [],
    statuses: [],
  });

  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  useEffect(() => {
    loadFilterOptions();
    loadProducts(0, products.pageSize);
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await productService.getFilterOptions();
      if (response.success) {
        setFilterOptions(response);
      }
    } catch (error) {
      console.error("Error loading filter options:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    setFilters(updatedFilters);
    loadProducts(0, products.pageSize, updatedFilters);
  };

  const handlePageChange = (page) => {
    loadProducts(page, products.pageSize);
  };

  const handlePageSizeChange = (newPageSize) => {
    loadProducts(0, newPageSize);
  };

  const handleProductAction = async (productId, action, data = {}) => {
    try {
      let response;
      
      switch (action) {
        case 'approve':
          response = await productService.approveProduct(productId);
          break;
        case 'reject':
          response = await productService.rejectProduct(productId, data);
          break;
        case 'request-edit':
          response = await productService.requestEdit(productId, data);
          break;
        case 'warn-agency':
          response = await productService.warnAgency(productId, data);
          break;
        case 'remove':
          response = await productService.removeProduct(productId, data);
          break;
        default:
          throw new Error('Invalid action');
      }

      if (response.success) {
        showToast("success", response.message);
        loadProducts(); // Reload current page
      } else {
        showToast("error", response.message);
      }
    } catch (error) {
      showToast("error", "Có lỗi xảy ra khi thực hiện thao tác");
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return statusMap[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const translateStatus = (status) => {
    const statusTranslations = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Từ chối",
    };
    return statusTranslations[status?.toLowerCase()] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      header: "Hình ảnh",
      key: "imageUrl",
      render: (row) => (
        <img
          src={row.imageUrl}
          alt="Product"
          className="w-16 h-16 object-cover rounded-lg"
        />
      ),
      cellClassName: "w-20",
    },
    {
      header: "Tên sản phẩm",
      key: "productName",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.productName}</div>
          <div className="text-sm text-gray-500 max-w-xs truncate">
            {row.productDescription}
          </div>
        </div>
      ),
    },
    {
      header: "Agency",
      key: "agencyName",
      render: (row) => (
        <div>
          <div className="text-sm font-medium">{row.agencyName}</div>
          <div className="text-sm text-gray-500">{row.agencyEmail}</div>
        </div>
      ),
    },
    {
      header: "Danh mục",
      key: "categoryName",
      render: (row) => <span className="text-sm">{row.categoryName}</span>,
    },
    {
      header: "Giá bán",
      key: "salePrice",
      render: (row) => (
        <div>
          <div className="font-semibold text-green-600">
            {formatCurrency(row.salePrice)}
          </div>
          <div className="text-sm text-gray-500 line-through">
            {formatCurrency(row.listPrice)}
          </div>
        </div>
      ),
      cellClassName: "text-right",
    },
    {
      header: "Đã bán",
      key: "soldAmount",
      render: (row) => (
        <div>
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {row.soldAmount}
          </span>
          <div className="text-sm text-gray-500">
            Còn: {row.inventoryQuantity}
          </div>
        </div>
      ),
      cellClassName: "text-center",
    },
    {
      header: "Trạng thái",
      key: "status",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            row.status
          )}`}
        >
          {translateStatus(row.status)}
        </span>
      ),
    },
    {
      header: "Ngày tạo",
      key: "createdDate",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {formatDate(row.createdDate)}
        </span>
      ),
    },
    {
      header: "Thao tác",
      key: "actions",
      render: (row) => (
        <ProductActions product={row} onAction={handleProductAction} />
      ),
      cellClassName: "w-32",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="mr-3 text-blue-600" />
            Quản lý Sản phẩm
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý và kiểm duyệt sản phẩm trong hệ thống
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.open("/products/pending", "_blank")}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center"
          >
            <Clock className="w-4 h-4 mr-2" />
            Chờ duyệt
          </button>
          <button
            onClick={() => loadProducts()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <ProductFilters
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
      />

      {/* Products Table */}
      <PaginatedTable
        data={products.content}
        columns={columns}
        currentPage={products.currentPage}
        totalPages={products.totalPages}
        totalElements={products.totalElements}
        pageSize={products.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        loading={products.loading}
        emptyMessage="Không có sản phẩm nào trong hệ thống"
        pageSizeOptions={[10, 20, 50, 100]}
      />

      {/* Toast */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ show: false, type: "", message: "" })}
      />
    </div>
  );
};

export default ProductManagementPage;
