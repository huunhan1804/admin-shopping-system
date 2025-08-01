// hooks/useConfirmation.js
import { useState } from 'react';

export const useConfirmation = () => {
    const [confirmationState, setConfirmationState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        type: 'warning',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    });

    const showConfirmation = ({
        title,
        message,
        onConfirm,
        type = 'warning',
        confirmText = 'Confirm',
        cancelText = 'Cancel'
    }) => {
        setConfirmationState({
            isOpen: true,
            title,
            message,
            onConfirm,
            type,
            confirmText,
            cancelText
        });
    };

    const closeConfirmation = () => {
        setConfirmationState(prev => ({ ...prev, isOpen: false }));
    };

    return {
        confirmationState,
        showConfirmation,
        closeConfirmation
    };
};