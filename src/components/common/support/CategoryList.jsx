// components/support/CategoryList.jsx
import React from "react";
import {
  Folder,
  FolderOpen,
  Edit2,
  Trash2,
  FileText,
  Loader2,
} from "lucide-react";

const CategoryList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  deletingCategoryId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Danh mục</h3>
      </div>
      <div className="p-4">
        {categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((category) => {
              const isSelected =
                selectedCategory?.supportCategoryId ===
                category.supportCategoryId;

              return (
                <div
                  key={category.supportCategoryId}
                  className={`
                    group relative rounded-lg border transition-all cursor-pointer
                    ${
                      isSelected
                        ? "bg-blue-50 border-blue-500"
                        : "hover:bg-gray-50 border-gray-200"
                    }
                  `}
                  onClick={() => onSelectCategory(category)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        {isSelected ? (
                          <FolderOpen className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                        ) : (
                          <Folder className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              isSelected ? "text-blue-900" : "text-gray-900"
                            }`}
                          >
                            {category.supportCategoryName}
                          </h4>
                          {category.supportCategoryDescription && (
                            <p className="text-sm text-gray-600 mt-1">
                              {category.supportCategoryDescription}
                            </p>
                          )}
                          {category.articleCount !== undefined && (
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <FileText className="w-4 h-4 mr-1" />
                              {category.articleCount} bài viết
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCategory(category);
                          }}
                          className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Sửa danh mục"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCategory(category.supportCategoryId);
                          }}
                          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Xóa danh mục"
                          disabled={
                            deletingCategoryId === category.supportCategoryId
                          }
                        >
                          {deletingCategoryId === category.supportCategoryId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có danh mục nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
