import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

const ModernSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Chọn...",
  className = "",
  disabled = false,
  required = false,
  error = "",
  searchable = true,
  clearable = true,
  size = "md",
  clearLabel = "Tất cả", // Tùy chỉnh label cho option "clear"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus vào search input khi mở dropdown
  useEffect(() => {
    if (isOpen && searchable && options.length > 5 && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen, searchable, options.length]);

  // Normalize options to consistent format
  const normalizedOptions = options.map((option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }
    if (option && typeof option === "object" && option.value !== undefined) {
      return {
        value: option.value,
        label: option.label || option.value,
        ...option // Giữ lại các properties khác nếu có
      };
    }
    return { value: option, label: String(option) };
  });

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    const option = normalizedOptions.find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-4 py-4 text-lg",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6",
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            relative w-full bg-white border rounded-lg shadow-sm text-left cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200 
            ${sizeClasses[size]}
            ${
              disabled
                ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                : error
                ? "border-red-300 hover:border-red-400"
                : "border-gray-300 hover:border-gray-400"
            }
            ${isOpen ? "ring-2 ring-blue-500 border-blue-500" : ""}
          `}
        >
          <span
            className={`block truncate ${
              !value ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {getDisplayValue()}
          </span>

          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {/* Clear button */}
            {clearable && value && !disabled && (
              <button
                onClick={handleClear}
                className="mr-1 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="Xóa lựa chọn"
              >
                <svg
                  className="h-4 w-4 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Dropdown arrow */}
            <ChevronDown
              className={`${iconSizeClasses[size]} text-gray-400 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-64 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none border border-gray-200">
            {/* Search input */}
            {searchable && normalizedOptions.length > 5 && (
              <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Options list */}
            <div className="max-h-48 overflow-auto">
              {/* Clear option */}
              {clearable && (
                <div
                  onClick={() => handleSelect("")}
                  className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-gray-50 transition-colors duration-150 ${
                    !value
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-900 hover:text-gray-900"
                  }`}
                >
                  <span className="block truncate font-medium">{clearLabel}</span>
                  {!value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>
              )}

              {/* Filtered options */}
              {filteredOptions.map((option, index) => {
                const isSelected = value === option.value;

                return (
                  <div
                    key={`${option.value}-${index}`}
                    onClick={() => handleSelect(option.value)}
                    className={`cursor-pointer select-none relative py-3 pl-4 pr-9 hover:bg-gray-50 transition-colors duration-150 ${
                      isSelected
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-900 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={`block truncate ${
                        isSelected ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                    {/* Hiển thị value nhỏ bên dưới nếu khác label */}
                    {option.label !== option.value && (
                      <span className="block truncate text-xs text-gray-500 mt-0.5">
                        {option.value}
                      </span>
                    )}
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                );
              })}

              {/* No results */}
              {filteredOptions.length === 0 && (
                <div className="cursor-default select-none relative py-3 pl-4 pr-9 text-gray-500 text-center">
                  {searchTerm
                    ? "Không tìm thấy kết quả nào"
                    : "Không có tùy chọn nào"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ModernSelect;