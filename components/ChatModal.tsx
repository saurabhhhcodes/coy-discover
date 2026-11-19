'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchRecord } from '@/lib/types';
import { ArrowLeft, Send, Sparkles, UserMinus, ShieldAlert, MoreVertical } from 'lucide-react';

interface ChatModalProps {
  match: MatchRecord | null;
  onClose: () => void;
  onUnmatch: (profileId: string) => void;
  onReport: (profileId: string, name: string) => void;
  onRefreshMatches: () => void;
}

const QUICK_PROMPTS = [
  "Hey! Coy matched us! 🎉",
  "How long have you had me on your list? 👀",
  "Coffee on campus tomorrow? ☕"
];

export const ChatModal: React.FC<ChatModalProps> = ({
  match,
  onClose,
  onUnmatch,
  onReport,
  onRefreshMatches
}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(match?.messages || []);
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (match) {
      setMessages(match.messages || []);
    }
  }, [match]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!match) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || sending) return;

    const optimisticId = `temp_${Date.now()}`;
    const userMsg = {
      id: optimisticId,
      sender: 'user' as const,
      text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSending(true);

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: match.profile.id,
          message: text
        })
      });
      const data = await res.json();
      if (data.success) {
        onRefreshMatches();

        setTimeout(() => {
          const replyOptions = [
            "Haha I was so hoping you'd swipe back! 🙈",
            "Yes definitely! Let's do it 😊",
            "No way, I've had you on my list since mid-terms! 😂",
            "I'm free between lectures, let me know when!"
          ];
          const randomReply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
          setMessages((prev) => [
            ...prev,
            {
              id: `reply_${Date.now()}`,
              sender: 'match',
              text: randomReply,
              timestamp: new Date().toISOString()
            }
          ]);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className="fixed inset-0 z-50 bg-[#ffffff] flex flex-col max-w-[480px] mx-auto w-full border-x-2 border-[#15121d]"
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#15121d] bg-[#ffffff]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 -ml-1 rounded-full hover:bg-[#f6f4fa] text-[#15121d] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={match.profile.photo}
                alt={match.profile.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#15121d]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#0e8f48] border-2 border-[#ffffff] rounded-full" />
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-[#15121d] leading-tight">
                {match.profile.name}
              </h3>
              <p className="text-[11px] text-[#ff3d81] font-bold">
                Mutual Secret Crush • Active
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-[#f6f4fa] text-[#15121d] transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 w-52 bg-[#ffffff] border-2 border-[#15121d] shadow-[4px_4px_0_#15121d] rounded-2xl py-1.5 z-30">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onUnmatch(match.profile.id);
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-[#d92d3a] hover:bg-[#ffe4ef] flex items-center gap-2 font-bold"
                >
                  <UserMinus className="w-4 h-4" />
                  Remove Connection
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onReport(match.profile.id, match.profile.name);
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs text-[#15121d] hover:bg-[#f6f4fa] flex items-center gap-2 font-semibold"
                >
                  <ShieldAlert className="w-4 h-4 text-[#6d6979]" />
                  Report & Block
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mutual Match Banner */}
        <div className="bg-[#ffe4ef] border-b-2 border-[#ff3d81] px-4 py-2 text-center text-xs text-[#d81e63] font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#ff3d81]" />
          <span>You both confessed secret crushes on Coy! Keep it fun.</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f6f4fa]">
          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-semibold border-2 border-[#15121d] ${
                    isMe
                      ? 'bg-[#ff3d81] text-[#ffffff] rounded-tr-xs shadow-[2px_2px_0_#15121d]'
                      : 'bg-[#ffffff] text-[#15121d] rounded-tl-xs shadow-[2px_2px_0_#15121d]'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-[#6d6979] mt-1 px-1 font-bold">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Icebreakers */}
        <div className="px-3 pt-2 bg-[#ffffff] border-t-2 border-[#15121d] flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#f6f4fa] hover:bg-[#ffe4ef] hover:text-[#d81e63] text-[#15121d] shrink-0 border border-[#15121d] shadow-[1px_1px_0_#15121d] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#ffffff] border-t border-[#ece9f2] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Say hello to ${match.profile.name.split(' ')[0]}...`}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#f6f4fa] text-xs font-semibold text-[#15121d] border-2 border-transparent focus:border-[#15121d] focus:bg-[#ffffff] outline-none transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || sending}
            className="w-10 h-10 rounded-xl bg-[#ff3d81] hover:bg-[#ff5a94] text-[#15121d] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] flex items-center justify-center disabled:opacity-40 transition-all active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
