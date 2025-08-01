// components/insurance/CommunicationHistory.jsx
import React from 'react';
import { MessageCircle, Mail, Send, ArrowRight, Clock } from 'lucide-react';

const CommunicationHistory = ({ communications }) => {
  if (!communications || communications.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Chưa có liên lạc nào</p>
      </div>
    );
  }

  const getCommunicationTypeInfo = (type) => {
    switch (type) {
      case 'ADMIN_TO_CUSTOMER':
        return {
          label: 'Admin → Khách hàng',
          bgColor: 'bg-green-50',
          borderColor: 'border-l-green-500',
          icon: Send,
          iconColor: 'text-green-600'
        };
      case 'ADMIN_TO_AGENCY':
        return {
          label: 'Admin → Agency',
          bgColor: 'bg-blue-50',
          borderColor: 'border-l-blue-500',
          icon: Send,
          iconColor: 'text-blue-600'
        };
      case 'CUSTOMER_TO_ADMIN':
        return {
          label: 'Khách hàng → Admin',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-l-yellow-500',
          icon: Mail,
          iconColor: 'text-yellow-600'
        };
      case 'AGENCY_TO_ADMIN':
        return {
          label: 'Agency → Admin',
          bgColor: 'bg-purple-50',
          borderColor: 'border-l-purple-500',
          icon: Mail,
          iconColor: 'text-purple-600'
        };
      default:
        return {
          label: type,
          bgColor: 'bg-gray-50',
          borderColor: 'border-l-gray-500',
          icon: MessageCircle,
          iconColor: 'text-gray-600'
        };
    }
  };

  // Sort communications by date (newest first)
  const sortedCommunications = [...communications].sort(
    (a, b) => new Date(b.sentDate) - new Date(a.sentDate)
  );

  return (
    <div className="space-y-4">
      {sortedCommunications.map((comm) => {
        const typeInfo = getCommunicationTypeInfo(comm.communicationType);
        const Icon = typeInfo.icon;

        return (
          <div
            key={comm.communicationId}
            className={`p-4 rounded-lg border-l-4 ${typeInfo.bgColor} ${typeInfo.borderColor}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${typeInfo.iconColor}`} />
                <span className="text-sm font-medium text-gray-600">
                  {typeInfo.label}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {new Date(comm.sentDate).toLocaleString('vi-VN')}
                </span>
              </div>
              
              {comm.isRead && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Đã đọc
                </span>
              )}
            </div>

            {/* Subject */}
            <h4 className="font-medium text-gray-900 mb-2">
              {comm.emailSubject}
            </h4>

            {/* Sender/Recipient Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{comm.senderName}</span>
                <span className="text-gray-400">({comm.senderEmail})</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="font-medium">{comm.recipientName}</span>
                <span className="text-gray-400">({comm.recipientEmail})</span>
              </div>
            </div>

            {/* Content */}
            <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {comm.emailContent}
            </div>

            {/* Read Date */}
            {comm.isRead && comm.readDate && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  Đã đọc lúc: {new Date(comm.readDate).toLocaleString('vi-VN')}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommunicationHistory;