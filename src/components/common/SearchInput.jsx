import React from "react";
import { Search, X } from "lucide-react";

const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = "Tìm kiếm...",
  className = "",
  disabled = false,
  size = "md", // sm, md, lg
}) => {
  const sizeClasses = {
    // Đổi padding: pl (left) thành pr (right) và ngược lại
    sm: "pr-9 pl-8 py-2 text-sm",  // Đổi từ "pl-9 pr-8" thành "pr-9 pl-8"
    md: "pr-11 pl-10 py-3 text-base", // Đổi từ "pl-11 pr-10" thành "pr-11 pl-10"
    lg: "pr-12 pl-11 py-4 text-lg",   // Đổi từ "pl-12 pr-11" thành "pr-12 pl-11"
  };

  const iconSizeClasses = {
    // Đổi vị trí icon: left thành right, right thành left
    sm: { search: "right-3 h-4 w-4", clear: "left-2 h-4 w-4" }, // Đổi left-3 thành right-3, right-2 thành left-2
    md: { search: "right-4 h-5 w-5", clear: "left-3 h-5 w-5" }, // Đổi left-4 thành right-4, right-3 thành left-3
    lg: { search: "right-4 h-6 w-6", clear: "left-3 h-6 w-6" }, // Đổi left-4 thành right-4, right-3 thành left-3
  };

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tìm kiếm
      </label>
      <div className={`relative ${className}`}>
        <Search
          className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSizeClasses[size].search}`}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
          w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
          focus:border-blue-500 hover:border-gray-400 transition-colors duration-200 
          shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
        `}
        />
        {value && (
          <button
            onClick={handleClear}
            disabled={disabled}
            className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 ${iconSizeClasses[size].clear}`}
            title="Xóa tìm kiếm"
          >
            <X />
          </button>
        )}
      </div>
    </>
  );
};

export default SearchInput;