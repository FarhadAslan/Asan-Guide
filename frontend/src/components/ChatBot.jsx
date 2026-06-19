import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithAI } from '../api';

export default function ChatBot({ serviceSlug, serviceName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: serviceName
        ? `Salam! "${serviceName}" xidməti haqqında suallarınıza cavab verməyə hazıram. Nə öyrənmək istəyirsiniz?`
        : 'Salam! ASAN Xidmət köməkçisinə xoş gəldiniz. Hansı xidmət barədə məlumat almaq istəyirsiniz?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await chatWithAI(text, serviceSlug);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.data.reply, isDemo: res.data.isDemo },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Bağlantı xətası baş verdi. Backend-in işlədiyini yoxlayın.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'Hansı sənədlər lazımdır?',
    'Müddət nə qədərdir?',
    'Haqq nə qədərdir?',
  ];

  return (
    <>
      {/* Açma düyməsi */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-asan-blue text-white rounded-full shadow-lg
                   hover:bg-asan-lightblue transition-colors flex items-center justify-center z-40
                   hover:scale-105 active:scale-95"
        aria-label="AI Köməkçi"
        style={{ animation: 'pulse-ring 2s infinite' }}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat pəncərəsi */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl
                        shadow-2xl border border-gray-100 flex flex-col z-50 animate-fadeIn"
             style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-asan-blue text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm">ASAN Köməkçi</p>
                <p className="text-blue-200 text-xs">AI ilə dəstəklənir</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Bağla"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 animate-fadeIn ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-asan-blue' : 'bg-blue-50'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User size={14} className="text-white" />
                  ) : (
                    <Bot size={14} className="text-asan-blue" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-asan-blue text-white rounded-tr-sm'
                      : msg.isError
                      ? 'bg-red-50 text-red-700 rounded-tl-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                  {msg.isDemo && (
                    <p className="text-xs text-gray-400 mt-1">Demo rejim</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 animate-fadeIn">
                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                  <Bot size={14} className="text-asan-blue" />
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-sm">
                  <Loader2 size={16} className="animate-spin text-asan-blue" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sürətli suallar */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(sendMessage, 0);
                  }}
                  className="text-xs bg-blue-50 text-asan-blue px-2.5 py-1 rounded-full
                             hover:bg-blue-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Sual yazın..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl
                           focus:outline-none focus:border-asan-blue transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-asan-blue text-white rounded-xl flex items-center justify-center
                           hover:bg-asan-lightblue transition-colors disabled:opacity-40"
                aria-label="Göndər"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
