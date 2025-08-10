// components/support/CategoryModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CategoryModal = ({ isOpen, mode, category, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    supportCategoryName: "",
    supportCategoryDescription: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category && mode === "edit") {
      setFormData({
        supportCategoryName: category.supportCategoryName || "",
        supportCategoryDescription: category.supportCategoryDescription || "",
      });
    }
  }, [category, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.supportCategoryName.trim()) {
      newErrors.supportCategoryName = "Tên danh mục là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="supportCategoryName"
                value={formData.supportCategoryName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.supportCategoryName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="VD: Hướng dẫn mua hàng"
              />
              {errors.supportCategoryName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.supportCategoryName}
                </p>
              )}
            </div>

            {/* Category Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="supportCategoryDescription"
                value={formData.supportCategoryDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mô tả ngắn về danh mục..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Đang lưu...
                </>
              ) : (
                <>{mode === "create" ? "Lưu danh mục" : "Cập nhật"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
