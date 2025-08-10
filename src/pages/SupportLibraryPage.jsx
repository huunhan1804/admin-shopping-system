// pages/SupportLibraryPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  FolderPlus,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import supportService from '../services/supportService';
import ArticleModal from '../components/common/support/ArticleModal';
import Toast from '../components/common/Toast';
import CategoryModal from '../components/common/support/CategoryModal';
import ArticleList from '../components/common/support/ArticleList';
import SearchBar from '../components/common/support/SearchBar';
import CategoryList from '../components/common/support/CategoryList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SupportLibraryPage = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [categoryModal, setCategoryModal] = useState({
    show: false,
    mode: 'create',
    data: null
  });
  
  const [articleModal, setArticleModal] = useState({
    show: false,
    mode: 'create', 
    categoryId: null,
    data: null
  });

  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: ''
  });

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load articles when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadArticles(selectedCategory.supportCategoryId);
    }
  }, [selectedCategory]);

  // === API CALLS ===

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await supportService.getAllCategories();
      if (response.status === 200) {
        setCategories(response.data || []);
      }
    } catch (error) {
      showToast('error', 'Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = async (categoryId) => {
    try {
      setLoading(true);
      const response = await supportService.getArticlesByCategory(categoryId);
      if (response.status === 200) {
        setArticles(response.data || []);
      }
    } catch (error) {
      showToast('error', 'Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  // === CATEGORY HANDLERS ===

  const handleCreateCategory = () => {
    setCategoryModal({
      show: true,
      mode: 'create',
      data: null
    });
  };

  const handleEditCategory = (category) => {
    setCategoryModal({
      show: true,
      mode: 'edit',
      data: category
    });
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này? Tất cả bài viết trong danh mục cũng sẽ bị xóa.')) {
      return;
    }

    try {
      const response = await supportService.deleteCategory(categoryId);
      if (response.status === 200) {
        showToast('success', 'Xóa danh mục thành công');
        loadCategories();
        if (selectedCategory?.supportCategoryId === categoryId) {
          setSelectedCategory(null);
          setArticles([]);
        }
      }
    } catch (error) {
      showToast('error', 'Không thể xóa danh mục');
    }
  };

  const handleSaveCategory = async (data) => {
    try {
      let response;
      if (categoryModal.mode === 'create') {
        response = await supportService.createCategory(data);
        if (response.status === 200) {
          showToast('success', 'Thêm danh mục thành công');
          // Auto redirect to new category
          setSelectedCategory(response.data);
          // Open article modal for new category
          setTimeout(() => {
            handleCreateArticle(response.data.supportCategoryId);
          }, 500);
        }
      } else {
        response = await supportService.updateCategory(categoryModal.data.supportCategoryId, data);
        if (response.status === 200) {
          showToast('success', 'Cập nhật danh mục thành công');
        }
      }
      loadCategories();
      setCategoryModal({ show: false, mode: 'create', data: null });
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra');
    }
  };

  // === ARTICLE HANDLERS ===

  const handleCreateArticle = (categoryId) => {
    setArticleModal({
      show: true,
      mode: 'create',
      categoryId: categoryId || selectedCategory?.supportCategoryId,
      data: null
    });
  };

  const handleEditArticle = (article) => {
    setArticleModal({
      show: true,
      mode: 'edit',
      categoryId: selectedCategory?.supportCategoryId,
      data: article
    });
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      return;
    }

    try {
      const response = await supportService.deleteArticle(articleId);
      if (response.status === 200) {
        showToast('success', 'Xóa bài viết thành công');
        loadArticles(selectedCategory.supportCategoryId);
      }
    } catch (error) {
      showToast('error', 'Không thể xóa bài viết');
    }
  };

  const handleSaveArticle = async (data) => {
    try {
      let response;
      if (articleModal.mode === 'create') {
        response = await supportService.createArticle(articleModal.categoryId, data);
        if (response.status === 200) {
          showToast('success', 'Thêm bài viết thành công');
        }
      } else {
        response = await supportService.updateArticle(articleModal.data.articleId, data);
        if (response.status === 200) {
          showToast('success', 'Cập nhật bài viết thành công');
        }
      }
      loadArticles(selectedCategory.supportCategoryId);
      setArticleModal({ show: false, mode: 'create', categoryId: null, data: null });
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra');
    }
  };

  const handleToggleVisibility = async (articleId) => {
    try {
      const response = await supportService.toggleArticleVisibility(articleId);
      if (response.status === 200) {
        showToast('success', 'Cập nhật trạng thái thành công');
        loadArticles(selectedCategory.supportCategoryId);
      }
    } catch (error) {
      showToast('error', 'Không thể cập nhật trạng thái');
    }
  };

  // === SEARCH HANDLER ===

  const handleSearch = async (query) => {
    if (!query.trim()) {
      if (selectedCategory) {
        loadArticles(selectedCategory.supportCategoryId);
      }
      return;
    }

    try {
      setLoading(true);
      const response = await supportService.searchArticles(query);
      if (response.status === 200) {
        setArticles(response.data || []);
      }
    } catch (error) {
      showToast('error', 'Không thể tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  // === UTILITY ===

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000);
  };

  // === RENDER ===

  if (loading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="mr-3 text-blue-600" />
              Thư viện hỗ trợ
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tài liệu hướng dẫn và bài viết hỗ trợ người dùng
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCreateCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Thêm danh mục
            </button>
            <button
              onClick={loadCategories}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        {selectedCategory && (
          <div className="flex items-center mt-4 text-sm text-gray-600">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setArticles([]);
              }}
              className="hover:text-blue-600"
            >
              Tất cả danh mục
            </button>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-gray-900">
              {selectedCategory.supportCategoryName}
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-4">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </div>

        {/* Articles Content */}
        <div className="lg:col-span-8">
          {selectedCategory ? (
            <>
              {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Tìm kiếm bài viết..."
              />

              {/* Action Buttons */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Bài viết ({articles.length})
                </h2>
                <button
                  onClick={() => handleCreateArticle()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm bài viết
                </button>
              </div>

              {/* Articles List */}
              <ArticleList
                articles={articles}
                loading={loading}
                onEditArticle={handleEditArticle}
                onDeleteArticle={handleDeleteArticle}
                onToggleVisibility={handleToggleVisibility}
              />
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn danh mục để xem bài viết
              </h3>
              <p className="text-gray-600">
                Vui lòng chọn một danh mục từ danh sách bên trái để xem và quản lý các bài viết
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {categoryModal.show && (
        <CategoryModal
          isOpen={categoryModal.show}
          mode={categoryModal.mode}
          category={categoryModal.data}
          onClose={() => setCategoryModal({ show: false, mode: 'create', data: null })}
          onSave={handleSaveCategory}
        />
      )}

      {articleModal.show && (
        <ArticleModal
          isOpen={articleModal.show}
          mode={articleModal.mode}
          article={articleModal.data}
          categoryId={articleModal.categoryId}
          onClose={() => setArticleModal({ show: false, mode: 'create', categoryId: null, data: null })}
          onSave={handleSaveArticle}
        />
      )}

      {/* Toast */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ show: false, type: '', message: '' })}
      />
    </div>
  );
};

export default SupportLibraryPage;