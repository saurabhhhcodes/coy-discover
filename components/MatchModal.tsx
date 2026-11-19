'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientProfile } from '@/lib/types';
import confetti from 'canvas-confetti';
import { Heart, MessageCircle, X, MessageSquareQuote } from 'lucide-react';

interface MatchModalProps {
  match: ClientProfile | null;
  onClose: () => void;
  onOpenMatches: () => void;
}

const ICEBREAKERS = [
  "“Wait, did you add me first or did I? 😂”",
  "“Okay but how long has this secret crush been going on? 👀”",
  "“Spill: what was your first impression of me?”",
  "“Is this real or did someone hack Coy? 🥂”"
];

export const MatchModal: React.FC<MatchModalProps> = ({
  match,
  onClose,
  onOpenMatches
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  useEffect(() => {
    if (match) {
      setSelectedPrompt(ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)]);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [match]);

  return (
    <AnimatePresence>
      {match && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="w-full max-w-sm bg-[#ffffff] border-3 border-[#15121d] shadow-[8px_8px_0_#15121d] rounded-[32px] p-6 text-center text-[#15121d] relative overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f6f4fa] text-[#15121d] border border-[#ece9f2]"
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Glowing Heart Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-[#ffe4ef] border-2 border-[#ff3d81] shadow-[3px_3px_0_#ff3d81] flex items-center justify-center mb-3">
              <Heart className="w-8 h-8 text-[#ff3d81] fill-[#ff3d81] animate-bounce" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-black tracking-tight text-[#15121d]">
              It&apos;s a Match!
            </h2>
            <p className="text-xs text-[#6d6979] mt-1 font-semibold">
              You and <span className="font-bold text-[#ff3d81]">{match.name}</span> secretly liked each other!
            </p>

            {/* Avatars */}
            <div className="flex items-center justify-center gap-4 my-5">
              <div className="relative">
                <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] bg-[#f6f4fa]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#15121d] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-white border border-[#ffffff]">
                  You
                </div>
              </div>

              {/* Heart connector */}
              <div className="w-8 h-8 rounded-full bg-[#ffe4ef] border-2 border-[#15121d] flex items-center justify-center text-[#ff3d81] shadow-[2px_2px_0_#15121d]">
                <Heart className="w-4 h-4 fill-[#ff3d81]" />
              </div>

              <div className="relative">
                <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] bg-[#f6f4fa]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={match.photo}
                    alt={match.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#ff3d81] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider text-white border border-[#15121d]">
                  {match.name.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Icebreaker Prompt Box */}
            <div className="p-3.5 rounded-2xl bg-[#f6f4fa] border-2 border-[#15121d] text-left mb-4 shadow-[2px_2px_0_#15121d]">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-[#ff3d81] uppercase tracking-wider">
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Instant Icebreaker</span>
              </div>
              <p className="mt-1 text-xs text-[#15121d] font-bold italic">
                {selectedPrompt}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenMatches();
                }}
                className="coy-btn w-full"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open Chat & Say Hello</span>
              </button>

              <button
                onClick={onClose}
                className="coy-btn quiet w-full"
              >
                Keep Swiping Discover
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
