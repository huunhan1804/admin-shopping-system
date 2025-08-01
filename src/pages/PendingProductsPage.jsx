import React, { useState, useEffect } from 'react';
import { Clock, Check, X, Eye, RefreshCw, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ActionModal from '../components/products/ActionModal';
import Toast from '../components/common/Toast';
import productService from '../services/productService';

const PendingProductsPage = () => {
  const [products, setProducts] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 12,
    loading: false
  });

  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    loadPendingProducts(0, products.pageSize);
  }, []);

  const loadPendingProducts = async (page = products.currentPage, size = products.pageSize) => {
    try {
      setProducts(prev => ({ ...prev, loading: true }));

      const response = await productService.getPendingProducts({
        page,
        size
      });

      if (response.success) {
        setProducts({
          content: response.content || [],
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0,
          currentPage: response.currentPage || 0,
          pageSize: size,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error loading pending products:', error);
      setProducts(prev => ({ ...prev, loading: false }));
      showToast('error', 'Không thể tải danh sách sản phẩm chờ duyệt');
    }
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
        default:
          throw new Error('Invalid action');
      }
      
      if (response.success) {
        showToast('success', response.message);
        loadPendingProducts(); // Reload current page
      } else {
        showToast('error', response.message);
      }
    } catch (error) {
      showToast('error', 'Có lỗi xảy ra khi thực hiện thao tác');
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page) => {
    loadPendingProducts(page, products.pageSize);
  };

  const openModal = (modalType, product) => {
    setSelectedProduct(product);
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Clock className="mr-3 text-yellow-600" />
            Sản phẩm chờ duyệt
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {products.totalElements}
            </span>
          </h1>
          <p className="text-gray-600 mt-1">
            Kiểm duyệt và phê duyệt sản phẩm mới
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => window.open('/products', '_blank')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
          >
            Tất cả sản phẩm
          </button>
          <button 
            onClick={() => loadPendingProducts()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : products.content.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.content.map((product) => (
              <div key={product.productId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                {/* Product Image */}
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.productName}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Chờ duyệt
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.productName}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.productDescription}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Agency:</span>
                      <span className="ml-1 truncate">{product.agencyName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Danh mục:</span>
                      <span className="ml-1">{product.categoryName}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(product.salePrice)}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      {formatCurrency(product.listPrice)}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-500 mb-4">
                    {formatDate(product.createdDate)}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(`/products/review/${product.productId}`, '_blank')}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Xem
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Phê duyệt sản phẩm này?')) {
                          handleProductAction(product.productId, 'approve');
                        }
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Duyệt
                    </button>

                    <button
                      onClick={() => openModal('reject', product)}
                      className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {products.totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(products.currentPage - 1)}
                  disabled={products.currentPage === 0}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>

                {Array.from({ length: products.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      i === products.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(products.currentPage + 1)}
                  disabled={products.currentPage === products.totalPages - 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có sản phẩm nào chờ duyệt
          </h3>
          <p className="text-gray-600 mb-6">
            Tất cả sản phẩm đã được xử lý.
          </p>
          <button
            onClick={() => window.open('/products', '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      )}

      {/* Modal */}
      {activeModal === 'reject' && selectedProduct && (
        <ActionModal
          isOpen={true}
          onClose={closeModal}
          title="Từ chối sản phẩm"
          type="danger"
          onConfirm={handleProductAction}
          action="reject"
          product={selectedProduct}
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

export default PendingProductsPage;