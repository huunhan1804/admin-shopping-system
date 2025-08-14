// components/common/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';

// ======= CẤU HÌNH CHỈ Ở CODE =======
// 1) Vite:    VITE_OPENAI_API_KEY
// 2) CRA:     REACT_APP_OPENAI_API_KEY
// 3) Hoặc:    dán trực tiếp vào chuỗi "" (KHÔNG khuyến nghị production)
const OPENAI_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OPENAI_API_KEY) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_OPENAI_API_KEY) ||
  "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"; // <-- có thể dán "sk-xxxx" để test cục bộ

const MODEL = "gpt-4o-mini";
const SYSTEM_PROMPT = "Bạn là trợ lý ảo của CTU Shop. Trả lời ngắn gọn, lịch sự, tiếng Việt.";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào! Tôi là trợ lý ảo của CTU Shop. Tôi có thể giúp gì cho bạn?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { if (isOpen && !isMinimized && inputRef.current) inputRef.current.focus(); }, [isOpen, isMinimized]);

  const formatTime = (t) => new Date(t).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Gọi OpenAI trực tiếp từ FE (stream)
  const streamChat = async ({ history, userInput, onDelta, onDone }) => {
    const payload = {
      model: MODEL,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
        { role: "user", content: userInput }
      ],
      temperature: 0.3
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify(payload)
    });

    if (!res.ok || !res.body) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let doneAll = false;

    while (!doneAll) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const data = line.replace(/^data:\s*/, "");
        if (data === "[DONE]") { doneAll = true; break; }
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content || "";
          if (delta) onDelta(delta);
        } catch { /* ignore */ }
      }
    }
    onDone();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const content = inputValue.trim();
    if (!content || isLoading) return;

    if (!OPENAI_API_KEY) {
      // Không hiện UI cài đặt — chỉ báo lỗi hướng dẫn sửa CODE
      const errId = Date.now();
      setMessages(prev => [...prev, { id: errId, text: "❌ Chưa cấu hình OpenAI API Key. Mở file ChatBox.jsx và gán biến OPENAI_API_KEY hoặc thiết lập biến môi trường (VITE_OPENAI_API_KEY / REACT_APP_OPENAI_API_KEY).", sender: 'bot', timestamp: new Date() }]);
      setInputValue('');
      return;
    }

    const userMessage = { id: Date.now(), text: content, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const botId = Date.now() + 1;
    let botText = "";
    setMessages(prev => [...prev, { id: botId, text: "", sender: 'bot', timestamp: new Date() }]);
    setIsTyping(true);
    setIsLoading(true);

    try {
      const history = messages.filter(m => m.id !== botId && m.sender !== 'system');
      await streamChat({
        history,
        userInput: content,
        onDelta: (delta) => {
          botText += delta;
          setMessages(prev => prev.map(m => (m.id === botId ? { ...m, text: botText } : m)));
        },
        onDone: () => { setIsTyping(false); setIsLoading(false); }
      });
    } catch (err) {
      setIsTyping(false);
      setIsLoading(false);
      const errMsg = (err?.message || "Lỗi không xác định").slice(0, 400);
      setMessages(prev => prev.map(m => (m.id === botId ? { ...m, text: `❌ Lỗi: ${errMsg}` } : m)));
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } };

  const quickActions = ["Hướng dẫn đặt hàng", "Chính sách đổi trả", "Liên hệ hỗ trợ", "Tình trạng đơn hàng"];
  const handleQuickAction = (action) => { setInputValue(action); inputRef.current?.focus(); };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        title="Mở chat hỗ trợ"
      >
        <MessageCircle className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">CTU Shop Assistant</h3>
            <p className="text-xs text-blue-100">{isTyping ? 'Đang trả lời...' : 'Trực tuyến'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* ĐÃ ẨN nút Cài đặt */}
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded transition-colors" title={isMinimized ? "Mở rộng" : "Thu gọn"}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded transition-colors" title="Đóng">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto h-96 bg-gray-50">
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-xs ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                      <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                      <p className={`text-xs mt-1 ${m.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{formatTime(m.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-xs">
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-600 mb-2">Câu hỏi thường gặp:</p>
              <div className="flex flex-wrap gap-1">
                {["Hướng dẫn đặt hàng", "Chính sách đổi trả", "Liên hệ hỗ trợ", "Tình trạng đơn hàng"].map((a, i) => (
                  <button key={i} onClick={() => { setInputValue(a); inputRef.current?.focus(); }} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">{a}</button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  rows={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isLoading}
                  style={{ maxHeight: '120px', minHeight: '40px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Gửi"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">Nhấn Enter để gửi, Shift + Enter để xuống dòng</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
