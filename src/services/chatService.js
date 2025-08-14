// services/chatService.js
class ChatService {
  static async sendMessage(message, conversationId = null) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message,
          conversationId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }
}

export default ChatService;