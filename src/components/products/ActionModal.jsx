import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Edit, Trash2 } from 'lucide-react';

const ActionModal = ({ isOpen, onClose, title, type, onConfirm, action, product }) => {
  const [reason, setReason] = useState('');
  const [selectedReasons, setSelectedReasons] = useState([]);

  // Di chuyển useEffect ra ngoài điều kiện
  useEffect(() => {
    if (selectedReasons.length > 0) {
      const prefix = action === 'reject' 
        ? 'Sản phẩm bị từ chối vì các lý do sau:'
        : 'Sản phẩm cần chỉnh sửa các vấn đề sau:';
      
      const reasonsList = selectedReasons.map(r => `- ${r.label}`).join('\n');
      setReason(`${prefix}\n\n${reasonsList}\n\nChi tiết: `);
    }
  }, [selectedReasons, action]);

  // Reset state khi modal đóng/mở
  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setSelectedReasons([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (value, label) => {
    if (selectedReasons.some(r => r.value === value)) {
      setSelectedReasons(selectedReasons.filter(r => r.value !== value));
    } else {
      setSelectedReasons([...selectedReasons, { value, label }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const data = {};
    // Sửa lại mapping cho đúng với ProductActions
    switch(action) {
      case 'reject':
        data.rejectionReason = reason;
        break;
      case 'request-edit': // Đảm bảo action name khớp
        data.editNotes = reason;
        break;
      case 'warn-agency':
        data.warningMessage = reason;
        break;
      case 'remove':
        data.removeReason = reason;
        break;
    }

    onConfirm(product.productId, action, data); // <-- Sửa ở đây
  };

  const getIcon = () => {
    switch (action) {
      case 'reject':
      case 'remove':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'request-edit':
        return <Edit className="w-6 h-6 text-yellow-500" />;
      case 'warn-agency':
        return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-gray-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getButtonText = () => {
    switch (action) {
      case 'reject':
        return 'Từ chối sản phẩm';
      case 'request-edit':
        return 'Gửi yêu cầu chỉnh sửa';
      case 'warn-agency':
        return 'Gửi cảnh báo';
      case 'remove':
        return 'Gỡ bỏ sản phẩm';
      default:
        return 'Xác nhận';
    }
  };

  const getReasonOptions = () => {
    switch (action) {
      case 'reject':
        return [
          { value: 'invalid-name', label: 'Tên sản phẩm vi phạm quy định' },
          { value: 'misleading-description', label: 'Mô tả sản phẩm gây hiểu lầm' },
          { value: 'poor-image-quality', label: 'Hình ảnh không rõ nét' },
          { value: 'unauthorized-claims', label: 'Tuyên bố y tế chưa được chứng minh' },
          { value: 'wrong-category', label: 'Sai danh mục sản phẩm' },
          { value: 'agency-unauthorized', label: 'Agency không có tư cách bán' }
        ];
      case 'request-edit':
        return [
          { value: 'improve-name', label: 'Cải thiện tên sản phẩm' },
          { value: 'improve-description', label: 'Cải thiện mô tả sản phẩm' },
          { value: 'better-images', label: 'Cung cấp hình ảnh chất lượng tốt hơn' },
          { value: 'adjust-price', label: 'Điều chỉnh giá bán' },
          { value: 'change-category', label: 'Thay đổi danh mục' },
          { value: 'add-documentation', label: 'Bổ sung giấy tờ chứng minh' }
        ];
      default:
        return [];
    }
  };

  const reasonOptions = getReasonOptions();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {getIcon()}
              <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {action === 'remove' && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-700">
                    <strong>Cảnh báo:</strong> Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống!
                  </p>
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-gray-600 mb-3">
                {action === 'reject' && `Bạn có chắc muốn từ chối sản phẩm: `}
                {action === 'request-edit' && `Gửi yêu cầu chỉnh sửa cho sản phẩm: `}
                {action === 'warn-agency' && `Gửi cảnh báo về sản phẩm: `}
                {action === 'remove' && `Bạn có chắc muốn gỡ bỏ sản phẩm: `}
                <strong>{product?.productName}</strong>?
              </p>
            </div>

            {reasonOptions.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {action === 'reject' ? 'Các vi phạm phổ biến:' : 'Các vấn đề cần chỉnh sửa:'}
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {reasonOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.value}
                        checked={selectedReasons.some(r => r.value === option.value)}
                        onChange={() => handleCheckboxChange(option.value, option.label)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={option.value} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {action === 'reject' && 'Lý do từ chối:'}
                {action === 'request-edit' && 'Ghi chú chỉnh sửa:'}
                {action === 'warn-agency' && 'Nội dung cảnh báo:'}
                {action === 'remove' && 'Lý do gỡ bỏ:'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                required
                placeholder={
                  action === 'reject' ? 'Nhập lý do từ chối sản phẩm...' :
                  action === 'request-edit' ? 'Mô tả chi tiết những điểm cần chỉnh sửa...' :
                  action === 'warn-agency' ? 'Nội dung cảnh báo gửi đến Agency...' :
                  action === 'remove' ? 'Nhập lý do gỡ bỏ sản phẩm...' : ''
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!reason.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonColor()}`}
              >
                {getButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;