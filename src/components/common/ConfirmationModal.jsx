import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    type = 'warning' // 'warning', 'danger', 'info'
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
                    confirmBtn: 'bg-red-600 hover:bg-red-700 text-white',
                    iconBg: 'bg-red-100'
                };
            case 'info':
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
                    confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white',
                    iconBg: 'bg-blue-100'
                };
            default: // warning
                return {
                    icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
                    confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                    iconBg: 'bg-yellow-100'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md mx-auto p-6">
                <div className="flex items-center mb-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center mr-3`}>
                        {styles.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="mb-6">
                    <p className="text-sm text-gray-600">{message}</p>
                </div>
                
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${styles.confirmBtn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;