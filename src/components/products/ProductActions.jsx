import React, { useState } from 'react';
import { 
  Eye, 
  Check, 
  X, 
  Edit, 
  AlertTriangle, 
  Trash2, 
  MoreHorizontal 
} from 'lucide-react';
import ActionModal from './ActionModal';

const ProductActions = ({ product, onAction }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const handleAction = (action, data = {}) => {
    onAction(product.productId, action, data);
    setActiveModal(null);
  };

  const actions = [
    {
      key: 'view',
      label: 'Xem chi tiết',
      icon: Eye,
      color: 'text-blue-600',
      onClick: () => window.open(`/products/review/${product.productId}`, '_blank')
    },
    ...(product.status === 'pending' ? [
      {
        key: 'approve',
        label: 'Phê duyệt',
        icon: Check,
        color: 'text-green-600',
        onClick: () => {
          if (window.confirm('Phê duyệt sản phẩm này?')) {
            handleAction('approve');
          }
        }
      },
      {
        key: 'reject',
        label: 'Từ chối',
        icon: X,
        color: 'text-red-600',
        onClick: () => setActiveModal('reject')
      }
    ] : []),
    {
      key: 'edit',
      label: 'Yêu cầu sửa',
      icon: Edit,
      color: 'text-yellow-600',
      onClick: () => setActiveModal('edit')
    },
    {
      key: 'warn',
      label: 'Cảnh báo',
      icon: AlertTriangle,
      color: 'text-orange-600',
      onClick: () => setActiveModal('warn')
    },
    {
      key: 'remove',
      label: 'Gỡ bỏ',
      icon: Trash2,
      color: 'text-red-600',
      onClick: () => setActiveModal('remove')
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {actions.map((action) => (
                <button
                  key={action.key}
                  onClick={() => {
                    setShowDropdown(false);
                    action.onClick();
                  }}
                  className={`group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${action.color}`}
                >
                  <action.icon className="w-4 h-4 mr-3" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

{/* Modals */}
      {activeModal === 'reject' && (
        <ActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Từ chối sản phẩm"
          type="danger"
          onConfirm={handleAction}
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
          onConfirm={handleAction}
          action="request-edit"
          product={product}
        />
      )}

      {activeModal === 'warn' && (
        <ActionModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="Gửi cảnh báo đến Agency"
          type="warning"
          onConfirm={handleAction}
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
          onConfirm={handleAction}
          action="remove"
          product={product}
        />
      )}
    </div>
  );
};

export default ProductActions;