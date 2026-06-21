import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setInput('');
    setIsLoading(true);
    try {
      const res = await chatWithAI(msg, serviceSlug);
      setMessages(p => [...p, { role: 'assistant', text: res.data.reply, isDemo: res.data.isDemo }]);
    } catch {
      setMessages(p => [...p, { role: 'assistant', text: 'Bağlantı xətası baş verdi.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = ['Hansı sənədlər lazımdır?', 'Müddət nə qədərdir?', 'Haqq nə qədərdir?'];

  return (
    <>
      {/* Açma düyməsi */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-asan-blue text-white rounded-full
                   shadow-lg hover:bg-asan-lightblue hover:scale-105 active:scale-95
                   transition-all flex items-center justify-center z-40"
        style={{ animation: 'pulse-ring 2.5s infinite' }}
        aria-label="AI Köməkçi"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat pəncərəsi */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-24px)]
                     bg-white rounded-3xl shadow-2xl border border-gray-100
                     flex flex-col z-50 animate-slideIn overflow-hidden"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-asan-blue to-asan-lightblue px-4 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">ASAN Köməkçi</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-blue-100 text-xs">AI ilə dəstəklənir · Groq</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white"
              aria-label="Bağla"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 animate-fadeIn ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-asan-blue' : 'bg-white border border-gray-200 shadow-sm'
                }`}>
                  {msg.role === 'user'
                    ? <User size={13} className="text-white" />
                    : <Bot size={13} className="text-asan-blue" />
                  }
                </div>
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-asan-blue text-white rounded-tr-sm'
                    : msg.isError
                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-sm'
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                }`}>
                  {msg.text}
                  {msg.isDemo && <p className="text-xs text-gray-400 mt-1 pt-1 border-t border-gray-100">Demo rejim</p>}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 animate-fadeIn">
                <div className="w-7 h-7 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                  <Bot size={13} className="text-asan-blue" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-asan-blue/40 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sürətli suallar */}
          {messages.length <= 2 && (
            <div className="px-4 pt-2 pb-0 flex gap-1.5 flex-wrap bg-gray-50/50">
              {quickQuestions.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-xs bg-asan-sky text-asan-blue border border-asan-blue/10
                             px-3 py-1.5 rounded-full hover:bg-asan-blue hover:text-white transition-all font-medium">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder="Sualınızı yazın..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl
                           focus:outline-none focus:border-asan-blue focus:ring-2 focus:ring-asan-blue/10
                           transition-all bg-gray-50 focus:bg-white"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-asan-blue text-white rounded-xl flex items-center justify-center
                           hover:bg-asan-lightblue transition-colors disabled:opacity-40 flex-shrink-0"
                aria-label="Göndər"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-300 mt-2 flex items-center justify-center gap-1">
              <Sparkles size={9} /> Groq Llama 3.3 70B ilə işləyir
            </p>
          </div>
        </div>
      )}
    </>
  );
}
