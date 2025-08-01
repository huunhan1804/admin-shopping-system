// components/insurance/ContactModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Mail, Send } from 'lucide-react';

const ContactModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  type, 
  claimId, 
  recipientId, 
  recipientName, 
  claimCode 
}) => {
  const [formData, setFormData] = useState({
    emailSubject: '',
    emailContent: '',
    communicationType: type
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && type && claimCode && recipientName) {
      const isCustomer = type === 'ADMIN_TO_CUSTOMER';
      setFormData({
        emailSubject: `Yêu cầu bồi thường ${claimCode} - ${isCustomer ? 'Cần thêm thông tin' : 'Cần thông tin sản phẩm'}`,
        emailContent: isCustomer 
          ? `Kính chào ${recipientName},\n\nChúng tôi đang xem xét yêu cầu bồi thường của bạn (${claimCode}).\n\n`
          : `Kính chào ${recipientName},\n\nChúng tôi cần thông tin bổ sung về sản phẩm liên quan đến yêu cầu bồi thường ${claimCode}.\n\n`,
        communicationType: type
      });
    }
  }, [show, type, claimCode, recipientName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit({
        ...formData,
        claimId,
        recipientId
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!show) return null;

  const title = type === 'ADMIN_TO_CUSTOMER' 
    ? `Liên hệ khách hàng: ${recipientName}`
    : `Liên hệ Agency: ${recipientName}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-blue-600" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề email
              </label>
              <input
                type="text"
                name="emailSubject"
                id="emailSubject"
                value={formData.emailSubject}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="emailContent" className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung email
              </label>
              <textarea
                name="emailContent"
                id="emailContent"
                rows={8}
                value={formData.emailContent}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
            </div>
          </div>

          <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={loading}
            >
              Đóng
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Gửi email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;