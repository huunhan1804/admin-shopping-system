// components/support/ArticleList.jsx
import React from "react";
import {
  FileText,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  User,
  BarChart,
  Loader2,
} from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const ArticleList = ({
  articles,
  loading,
  onEditArticle,
  onDeleteArticle,
  onToggleVisibility,
  deletingArticleId, // <-- nhận prop mới
  togglingArticleId, // <-- nhận prop mới
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có bài viết nào
        </h3>
        <p className="text-gray-600">
          Bấm "Thêm bài viết" để tạo bài viết mới cho danh mục này
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <div
          key={article.articleId}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-3">
                    #{index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {article.articleTitle}
                  </h3>
                  {!article.isVisible && (
                    <span className="ml-3 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      Ẩn
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleVisibility(article.articleId)}
                  className={`p-2 rounded-lg transition-colors ${
                    article.isVisible
                      ? "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  }`}
                  title={
                    article.isVisible ? "Ẩn bài viết" : "Hiển thị bài viết"
                  }
                  disabled={togglingArticleId === article.articleId}
                >
                  {togglingArticleId === article.articleId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : article.isVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onEditArticle(article)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Sửa bài viết"
                  disabled={
                    deletingArticleId === article.articleId ||
                    togglingArticleId === article.articleId
                  }
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteArticle(article.articleId)}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa bài viết"
                  disabled={deletingArticleId === article.articleId}
                >
                  {deletingArticleId === article.articleId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Content Preview */}
            <div className="mb-4">
              <div className="text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: article.articleContent || '' }}/>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                {article.createdAt && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                )}
                {article.createdBy && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {article.createdBy}
                  </div>
                )}
              </div>
              {article.viewCount !== undefined && (
                <div className="flex items-center">
                  <BarChart className="w-4 h-4 mr-1" />
                  {article.viewCount} lượt xem
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
