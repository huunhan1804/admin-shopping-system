// hooks/useChatBox.js
import { useState, useCallback } from 'react';

export const useChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addUnreadMessage = useCallback(() => {
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  }, [isOpen]);

  return {
    isOpen,
    unreadCount,
    openChat,
    closeChat,
    addUnreadMessage
  };
};