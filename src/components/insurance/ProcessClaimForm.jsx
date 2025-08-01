// components/insurance/ProcessClaimForm.jsx
import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, DollarSign, FileText, XCircle } from 'lucide-react';
import ClaimStatusBadge from './ClaimStatusBadge';

const ProcessClaimForm = ({ claim, onSubmit, processing }) => {
  const [formData, setFormData] = useState({
    claimStatus: claim.claimStatus || 'SUBMITTED',
    compensationAmount: claim.compensationAmount || '',
    compensationType: claim.compensationType || '',
    rejectionReason: claim.rejectionReason || '',
    adminNotes: claim.adminNotes || ''
  });

  const [showCompensationFields, setShowCompensationFields] = useState(false);
  const [showRejectionField, setShowRejectionField] = useState(false);

  useEffect(() => {
    setShowCompensationFields(formData.claimStatus === 'APPROVED');
    setShowRejectionField(formData.claimStatus === 'REJECTED');
  }, [formData.claimStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields based on status
    if (formData.claimStatus === 'APPROVED' && !formData.compensationAmount) {
      alert('Vui lòng nhập mức bồi thường');
      return;
    }
    
    if (formData.claimStatus === 'REJECTED' && !formData.rejectionReason) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    onSubmit(formData);
  };

  const statusOptions = [
    { value: 'SUBMITTED', label: 'Đã nộp', disabled: false },
    { value: 'UNDER_REVIEW', label: 'Đang xem xét', disabled: false },
    { value: 'PENDING_DOCUMENTS', label: 'Chờ bổ sung', disabled: false },
    { value: 'APPROVED', label: 'Chấp thuận', disabled: false },
    { value: 'REJECTED', label: 'Từ chối', disabled: false },
    { value: 'CLOSED', label: 'Đóng', disabled: false }
  ];

  const compensationTypes = [
    { value: '', label: 'Chọn hình thức' },
    { value: 'CASH', label: 'Tiền mặt' },
    { value: 'VOUCHER', label: 'Voucher' },
    { value: 'PRODUCT_REPLACEMENT', label: 'Thay thế sản phẩm' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Status Display */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Trạng thái hiện tại:</p>
        <ClaimStatusBadge status={claim.claimStatus} />
      </div>

      {/* Status Selection */}
      <div>
        <label htmlFor="claimStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái mới
        </label>
        <select
          name="claimStatus"
          id="claimStatus"
          value={formData.claimStatus}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusOptions.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Compensation Fields - Show when APPROVED */}
      {showCompensationFields && (
        <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700 mb-2">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="font-medium">Thông tin bồi thường</span>
          </div>
          
          <div>
            <label htmlFor="compensationAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Mức bồi thường (VND) *
            </label>
            <input
              type="number"
              name="compensationAmount"
              id="compensationAmount"
              value={formData.compensationAmount}
              onChange={handleChange}
              min="0"
              step="1000"
              required={showCompensationFields}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập số tiền bồi thường"
            />
          </div>

          <div>
            <label htmlFor="compensationType" className="block text-sm font-medium text-gray-700 mb-1">
              Hình thức bồi thường
            </label>
            <select
              name="compensationType"
              id="compensationType"
              value={formData.compensationType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {compensationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Rejection Field - Show when REJECTED */}
      {showRejectionField && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700 mb-2">
            <XCircle className="w-4 h-4 mr-2" />
            <span className="font-medium">Lý do từ chối</span>
          </div>
          
          <div>
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
              Lý do từ chối *
            </label>
            <textarea
              name="rejectionReason"
              id="rejectionReason"
              rows={3}
              value={formData.rejectionReason}
              onChange={handleChange}
              required={showRejectionField}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              placeholder="Nhập lý do từ chối yêu cầu bồi thường"
            />
          </div>
        </div>
      )}

      {/* Admin Notes */}
      <div>
        <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
          <FileText className="w-4 h-4 inline mr-1" />
          Ghi chú của Admin
        </label>
        <textarea
          name="adminNotes"
          id="adminNotes"
          rows={4}
          value={formData.adminNotes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          placeholder="Nhập ghi chú về quá trình xử lý yêu cầu..."
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={processing}
          className="w-full btn btn-primary flex items-center justify-center"
        >
          {processing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {processing ? 'Đang xử lý...' : 'Cập nhật yêu cầu'}
        </button>
      </div>

      {/* Warning for status changes */}
      {formData.claimStatus !== claim.claimStatus && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">Lưu ý:</p>
              <p>
                Bạn đang thay đổi trạng thái từ{' '}
                <span className="font-medium">{claim.claimStatus}</span> thành{' '}
                <span className="font-medium">{formData.claimStatus}</span>.
                {formData.claimStatus === 'APPROVED' && ' Khách hàng sẽ nhận được email thông báo về việc chấp thuận bồi thường.'}
                {formData.claimStatus === 'REJECTED' && ' Khách hàng sẽ nhận được email thông báo về việc từ chối bồi thường.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProcessClaimForm;