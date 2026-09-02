'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, RefreshCw, Trash2, MessageCircle, HelpCircle } from 'lucide-react';
import { sound } from '../lib/sound';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome-1',
    role: 'assistant',
    content: '🤖 Bip bup! Merhaba minik kodlama ustası! Ben Robot Robi. Algoritmalar, sıralamalar, döngüler ve koşullar hakkında aklına takılan her şeyi bana sorabilirsin! Birlikte kodlamanın sırlarını keşfedelim mi? 🚀✨',
    timestamp: 'Şimdi',
  },
];

const SUGGESTED_QUESTIONS = [
  { id: 'q1', text: 'Döngü (Loop) nedir, nasıl çalışır? 🔄' },
  { id: 'q2', text: 'Bana bir kodlama bilmecesi sor! 🧩' },
  { id: 'q3', text: 'Algoritmada adımların sırası neden önemlidir? 👣' },
  { id: 'q4', text: 'Hata ayıklama (Debug) ne demek? 🐞' },
  { id: 'q5', text: 'Koşul (Eğer... İse...) nasıl kullanılır? ☔' },
];

export const RobiAIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(100);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    sound.playPop();

    messageCounterRef.current += 1;
    const userMessageId = `user-msg-${messageCounterRef.current}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: messageContent,
      timestamp: 'Az önce',
    };

    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // Direct fetch call to the server-side Next.js route: /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.text) {
        sound.playSuccess();
        messageCounterRef.current += 1;
        const assistantMessage: ChatMessage = {
          id: `robi-msg-${messageCounterRef.current}`,
          role: 'assistant',
          content: data.text,
          timestamp: 'Şimdi',
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Cevap alınamadı.');
      }
    } catch (err: unknown) {
      console.error('Chat error:', err);
      messageCounterRef.current += 1;
      const errorMessage: ChatMessage = {
        id: `err-msg-${messageCounterRef.current}`,
        role: 'assistant',
        content: '🤖 Bip bup! Küçük bir bağlantı hatası yaşadım ama merak etme! Bana tekrar bir soru sormayı dener misin? 🌟',
        timestamp: 'Şimdi',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    sound.playPop();
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-[32px] p-6 border-3 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#45AAF2] text-white flex items-center justify-center text-3xl shadow-[0_3px_0_0_#2d98da] shrink-0 transform hover:scale-105 transition-transform">
            🤖
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFEAA7] text-[#D35400] text-xs font-black border border-[#F1C40F] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FD9644]" />
              <span>Yapay Zeka Kodlama Arkadaşı</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2D3436] tracking-tight">
              Robot Robi ile Canlı Sohbet
            </h2>
            <p className="text-xs sm:text-sm text-[#636E72] font-semibold">
              Kodlama sorularını, algoritmaları ve mantık oyunlarını Robot Robi&apos;ye sor!
            </p>
          </div>
        </div>

        <button
          id="btn-clear-chat"
          onClick={handleClearChat}
          className="px-3.5 py-2 rounded-2xl bg-[#F1F2F6] hover:bg-[#DFE6E9] text-[#636E72] hover:text-[#2D3436] font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="Sohbeti Temizle"
        >
          <Trash2 className="w-4 h-4" />
          <span>Sohbeti Sıfırla</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-[36px] border-4 border-[#DFE6E9] shadow-[0_6px_0_0_#DFE6E9] overflow-hidden flex flex-col h-[560px]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FFF9F0]/60">
          {messages.map((msg) => {
            const isRobi = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isRobi ? 'justify-start' : 'justify-end'}`}
              >
                {isRobi && (
                  <div className="w-10 h-10 rounded-2xl bg-[#45AAF2] text-white flex items-center justify-center text-xl shrink-0 shadow-[0_2px_0_0_#2d98da]">
                    🤖
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-[24px] p-4 shadow-sm space-y-1.5 ${
                    isRobi
                      ? 'bg-white border-2 border-[#DFE6E9] text-[#2D3436]'
                      : 'bg-[#FF7675] text-white shadow-[0_3px_0_0_#D63031]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[11px] font-black opacity-80">
                    <span>{isRobi ? 'Robot Robi' : 'Sen'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="text-xs sm:text-sm font-bold leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </div>
                </div>

                {!isRobi && (
                  <div className="w-10 h-10 rounded-2xl bg-[#FF7675] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-[0_2px_0_0_#D63031]">
                    🧒
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start animate-pulse">
              <div className="w-10 h-10 rounded-2xl bg-[#45AAF2] text-white flex items-center justify-center text-xl shrink-0">
                🤖
              </div>
              <div className="bg-white rounded-[24px] p-4 border-2 border-[#DFE6E9] shadow-xs flex items-center gap-2">
                <span className="text-xs font-black text-[#636E72]">Robot Robi düşünüyor</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#45AAF2] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#55E6C1] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-[#FF7675] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="bg-white border-t-2 border-[#DFE6E9] p-3 overflow-x-auto scrollbar-none flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-black text-[#636E72] shrink-0 px-1">
            <HelpCircle className="w-3.5 h-3.5 text-[#FD9644]" />
            <span>Hızlı Sorular:</span>
          </div>
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q.id}
              disabled={isLoading}
              onClick={() => handleSendMessage(q.text)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#FFF9F0] border-2 border-[#DFE6E9] hover:border-[#45AAF2] hover:bg-[#45AAF2]/10 text-xs font-black text-[#2D3436] transition-all cursor-pointer disabled:opacity-50"
            >
              {q.text}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="bg-white p-3 sm:p-4 border-t-2 border-[#DFE6E9] flex items-center gap-2.5"
        >
          <input
            id="chat-user-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Robot Robi'ye bir kodlama sorusu sor... (Örn: Döngü nedir?)"
            className="flex-1 px-4 py-3 rounded-2xl bg-[#FFF9F0] border-2 border-[#DFE6E9] text-xs sm:text-sm font-bold text-[#2D3436] focus:outline-[#45AAF2] focus:border-[#45AAF2] transition-colors"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              !inputText.trim() || isLoading
                ? 'bg-[#DFE6E9] text-[#636E72] cursor-not-allowed shadow-none'
                : 'bg-[#55E6C1] hover:bg-[#26de81] text-white shadow-[0_4px_0_0_#26de81] hover:translate-y-[2px]'
            }`}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Gönder</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Pedagogical Safe AI Badge */}
      <div className="text-center text-xs text-[#636E72] font-semibold flex items-center justify-center gap-2">
        <Bot className="w-4 h-4 text-[#45AAF2]" />
        <span>Tüm yanıtlar güvenli sunucu tarafında işlenir ve ilkokul pedagojisine uygun olarak üretilir.</span>
      </div>
    </div>
  );
};
