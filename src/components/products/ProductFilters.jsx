import React from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";

const ProductFilters = ({ filters, filterOptions, onFilterChange }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      status: "",
      categoryId: "", // Đổi từ category
      agencyId: "",   // Đổi từ agency
      keyword: "",
      sortBy: "createdDate",
      sortDir: "desc",
    });
  };

  const hasActiveFilters =
    filters.status || filters.categoryId || filters.agencyId || filters.keyword;

  // Helper functions với đúng field names
  const getCategoryNameById = (categoryId) => {
    const category = filterOptions.categories.find(
      (cat) => cat.category_id == categoryId // Dùng category_id thay vì categoryId
    );
    return category ? category.category_name : categoryId;
  };

  const getAgencyNameById = (agencyId) => {
    const agency = filterOptions.agencies.find(
      (agency) => agency.agencyId == agencyId
    );
    return agency ? agency.agencyName : agencyId;
  };

  const SelectField = ({
    label,
    value,
    onChange,
    options,
    placeholder = "Tất cả",
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => {
            // Xác định value và label cho từng loại option
            let optionValue, optionLabel;
            
            if (typeof option === 'object') {
              if (option.category_id) {
                // Cho categories
                optionValue = option.category_id;
                optionLabel = option.category_name;
              } else if (option.agencyId) {
                // Cho agencies
                optionValue = option.agencyId;
                optionLabel = option.agencyName;
              } else if (option.value) {
                // Cho sort options
                optionValue = option.value;
                optionLabel = option.label;
              }
            } else {
              // Cho statuses (string array)
              optionValue = option;
              optionLabel = option === "PENDING" ? "Chờ duyệt" : 
                           option === "APPROVED" ? "Đã duyệt" : 
                           option === "REJECTED" ? "Từ chối" :
                           option === "SUSPENDED" ? "Tạm ngưng" :
                           option === "UNDER_REVIEW" ? "Đang xem xét" : option;
            }
            
            return (
              <option key={index} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Bộ lọc tìm kiếm
              </h3>
              <p className="text-sm text-gray-600">
                Tìm kiếm và lọc sản phẩm theo tiêu chí
              </p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-6">
        {/* Search Bar - Full Width */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm sản phẩm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => handleInputChange("keyword", e.target.value)}
              placeholder="Nhập tên sản phẩm, mô tả..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SelectField
            label="Trạng thái"
            value={filters.status}
            onChange={(value) => handleInputChange("status", value)}
            options={filterOptions.statuses || []}
          />

          <SelectField
            label="Danh mục"
            value={filters.categoryId}
            onChange={(value) => handleInputChange("categoryId", value)}
            options={filterOptions.categories || []}
          />

          <SelectField
            label="Agency"
            value={filters.agencyId}
            onChange={(value) => handleInputChange("agencyId", value)}
            options={filterOptions.agencies || []}
          />
        </div>

        {/* Sort Options */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Sắp xếp theo"
              value={filters.sortBy}
              onChange={(value) => handleInputChange("sortBy", value)}
              options={[
                { value: "createdDate", label: "Ngày tạo" },
                { value: "productName", label: "Tên sản phẩm" },
                { value: "salePrice", label: "Giá bán" },
                { value: "soldAmount", label: "Đã bán" },
              ]}
              placeholder="Chọn tiêu chí"
            />

            <SelectField
              label="Thứ tự"
              value={filters.sortDir}
              onChange={(value) => handleInputChange("sortDir", value)}
              options={[
                { value: "desc", label: "Giảm dần" },
                { value: "asc", label: "Tăng dần" },
              ]}
              placeholder="Chọn thứ tự"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex items-center mb-3">
              <h4 className="text-sm font-medium text-gray-900">
                Bộ lọc đang áp dụng:
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Trạng thái:{" "}
                  {filters.status === "PENDING"
                    ? "Chờ duyệt"
                    : filters.status === "APPROVED"
                    ? "Đã duyệt"
                    : filters.status === "REJECTED"
                    ? "Từ chối"
                    : filters.status === "SUSPENDED"
                    ? "Tạm ngưng"
                    : filters.status === "UNDER_REVIEW"
                    ? "Đang xem xét"
                    : filters.status}
                  <button
                    onClick={() => handleInputChange("status", "")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.categoryId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Danh mục: {getCategoryNameById(filters.categoryId)}
                  <button
                    onClick={() => handleInputChange("categoryId", "")}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.agencyId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Agency: {getAgencyNameById(filters.agencyId)}
                  <button
                    onClick={() => handleInputChange("agencyId", "")}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.keyword && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Tìm kiếm: "{filters.keyword}"
                  <button
                    onClick={() => handleInputChange("keyword", "")}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;