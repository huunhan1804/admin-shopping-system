// pages/ProductReviewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  User, 
  Calendar, 
  DollarSign, 
  Tag, 
  Warehouse, 
  Check, 
  X, 
  Edit, 
  AlertTriangle, 
  Trash2,
  Eye,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import ActionModal from '../components/products/ActionModal';
import productService from '../services/productService';

const ProductReviewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(productId);
      
      if (response.success) {
        setProduct(response.product);
      } else {
        showToast('error', response.message || 'Không thể tải thông tin sản phẩm');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      showToast('error', 'Có lỗi xảy ra khi tải thông tin sản phẩm');
    } finally {
      setLoading(false);
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
        case 'request-edit':
          response = await productService.requestEdit(productId, data);
          break;
        case 'warn-agency':
          response = await productService.warnAgency(productId, data);
          break;
        case 'remove':
          response = await productService.removeProduct(productId, data);
          break;
        default:
          throw new Error('Invalid action');
      }
      
      if (response.success) {
        showToast('success', response.message);
        // Reload product to get updated status
        setTimeout(() => {
          loadProduct();
        }, 1000);
      } else {
        showToast('error', response.message);
      }
    } catch (error) {
      console.error('Error performing action:', error);
      showToast('error', 'Có lỗi xảy ra khi thực hiện thao tác');
    } finally {
      setActiveModal(null);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'REJECTED':
        return 'Từ chối';
      case 'SUSPENDED':
        return 'Tạm ngưng';
      default:
        return status;
    }
  };

  const renderActionButtons = () => {
    if (!product) return null;

    const actions = [];

    // Approve/Reject buttons for pending products
    if (product.status === 'PENDING') {
      actions.push(
        <button
          key="approve"
          onClick={() => {
            if (window.confirm('Phê duyệt sản phẩm này?')) {
              handleProductAction(product.productId, 'approve');
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
        >
          <Check className="w-4 h-4 mr-2" />
          Phê duyệt
        </button>
      );

      actions.push(
        <button
          key="reject"
          onClick={() => setActiveModal('reject')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
        >
          <X className="w-4 h-4 mr-2" />
          Từ chối
        </button>
      );
    }

    // Common actions for all products
    actions.push(
      <button
        key="edit"
        onClick={() => setActiveModal('edit')}
        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center"
      >
        <Edit className="w-4 h-4 mr-2" />
        Yêu cầu sửa
      </button>
    );

    actions.push(
      <button
        key="warn"
        onClick={() => setActiveModal('warn')}
        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Cảnh báo
      </button>
    );

    actions.push(
      <button
        key="remove"
        onClick={() => setActiveModal('remove')}
        className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 flex items-center"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Gỡ bỏ
      </button>
    );

    return actions;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Không tìm thấy sản phẩm
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Eye className="mr-3 text-blue-600" />
              Chi tiết sản phẩm
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {product.productId}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          {renderActionButtons()}
        </div>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'} 
              alt={product.productName}
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {product.productName}
              </h2>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(product.status)}`}>
                {translateStatus(product.status)}
              </span>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.productDescription || 'Không có mô tả'}
                </p>
              </div>

              {/* Price Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Giá bán</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(product.salePrice)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Giá niêm yết</p>
                    <p className="text-lg text-gray-500 line-through">
                      {formatCurrency(product.listPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inventory Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Warehouse className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Tồn kho</p>
                    <p className="text-lg font-semibold">
                      {product.inventoryQuantity} sản phẩm
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Đã bán</p>
                    <p className="text-lg font-semibold">
                      {product.soldAmount || 0} sản phẩm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agency & Category Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Agency</p>
                  <p className="font-medium">{product.agencyName}</p>
                  <p className="text-sm text-gray-600">{product.agencyEmail}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Danh mục</p>
                  <p className="font-medium">{product.categoryName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(product.createdDate)}</p>
                </div>
              </div>

              {product.updatedDate && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-medium">{formatDate(product.updatedDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {activeModal === 'reject' && (
        <ActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Từ chối sản phẩm"
          type="danger"
          onConfirm={handleProductAction}
          action="reject"
          product={product}
        />
      )}

      {activeModal === 'edit' && (
        <ActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Yêu cầu chỉnh sửa sản phẩm"
          type="warning"
          onConfirm={handleProductAction}
          action="request-edit"
          product={product}
        />
      )}

      {activeModal === 'warn' && (
        <ActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Cảnh báo Agency"
          type="warning"
          onConfirm={handleProductAction}
          action="warn-agency"
          product={product}
        />
      )}

      {activeModal === 'remove' && (
        <ActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Gỡ bỏ sản phẩm"
          type="danger"
          onConfirm={handleProductAction}
          action="remove"
          product={product}
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

export default ProductReviewPage;