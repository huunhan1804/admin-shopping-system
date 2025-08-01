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
    sm: "pl-9 pr-8 py-2 text-sm",
    md: "pl-11 pr-10 py-3 text-base",
    lg: "pl-12 pr-11 py-4 text-lg",
  };

  const iconSizeClasses = {
    sm: { search: "left-3 h-4 w-4", clear: "right-2 h-4 w-4" },
    md: { search: "left-4 h-5 w-5", clear: "right-3 h-5 w-5" },
    lg: { search: "left-4 h-6 w-6", clear: "right-3 h-6 w-6" },
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
