// components/support/ArticleModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import RichTextEditor from "../RichTextEditor";

const ArticleModal = ({ isOpen, mode, article, categoryId, onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    articleTitle: '',
    articleContent: '',
    isVisible: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (article && mode === 'edit') {
      setFormData({
        articleTitle: article.articleTitle || '',
        articleContent: article.articleContent || '',
        isVisible: article.isVisible !== undefined ? article.isVisible : true
      });
    }
  }, [article, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleContentChange = React.useCallback((nextHtml) => {
    setFormData(prev => {
      if (prev.articleContent === nextHtml) return prev; // tránh set lại -> tránh chồng dữ liệu
      return { ...prev, articleContent: nextHtml || '' };
    });
    if (errors.articleContent) {
      setErrors(prev => ({ ...prev, articleContent: '' }));
    }
  }, [errors.articleContent]);


  const extractImagesFromHtml = (html) => {
  // tạo thẻ tạm để query
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html || "";

  // lấy tất cả ảnh trong editor (ưu tiên .image-list img, fallback toàn bộ img)
  const imgs = wrapper.querySelectorAll(".image-list img, img");
  const list = [];
  imgs.forEach(img => {
    const src = (img.getAttribute("src") || "").trim();
    if (src) list.push(src);
  });

  return Array.from(new Set(list)); // unique
};



  const validate = () => {
    const newErrors = {};

    if (!formData.articleTitle.trim()) {
      newErrors.articleTitle = "Tiêu đề bài viết là bắt buộc";
    }

    if (!formData.articleContent.trim()) {
      newErrors.articleContent = "Nội dung bài viết là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;

  const articleImages = extractImagesFromHtml(formData.articleContent);

  // gửi thêm field articleImages (array)
  onSave({
    ...formData,
    articleImages
  });
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}
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
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Article Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề bài viết <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="articleTitle"
                value={formData.articleTitle}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.articleTitle ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="VD: Hướng dẫn mua hàng cơ bản"
              />
              {errors.articleTitle && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.articleTitle}
                </p>
              )}
            </div>

            {/* Article Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung chi tiết <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.articleContent}
                onChange={handleContentChange}
                placeholder="Nhập nội dung bài viết..."
                error={errors.articleContent}
              />
              {errors.articleContent && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.articleContent}
                </p>
              )}
            </div>

            {/* Visibility */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVisible"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isVisible" className="ml-2 text-sm text-gray-700">
                Hiển thị bài viết ngay sau khi lưu
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              {mode === "create" &&
                "Sau khi lưu, bạn có thể tiếp tục thêm bài viết khác"}
            </div>
            <div className="flex space-x-3">
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
                  <>{mode === "create" ? "Thêm bài viết" : "Cập nhật"}</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleModal;
