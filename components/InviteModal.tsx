'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Sparkles, X, Users, Gift, Check, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBonusUnlocked: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  onBonusUnlocked
}) => {
  const [copied, setCopied] = React.useState(false);
  const [claiming, setClaiming] = React.useState(false);

  const inviteLink = "https://app.getcoy.com/join?ref=campus-circle";

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateInvite = async () => {
    setClaiming(true);
    try {
      const res = await fetch('/api/invite', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
        onBonusUnlocked();
        onClose();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 290 }}
            className="w-full max-w-[440px] bg-[#ffffff] border-t-3 sm:border-3 border-[#15121d] sm:shadow-[8px_8px_0_#15121d] rounded-t-[32px] sm:rounded-[32px] p-6 text-[#15121d] relative max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#15121d]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#ffe4ef] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] flex items-center justify-center">
                  <Gift className="w-5 h-5 text-[#ff3d81] stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-[#15121d] leading-tight">
                    Invite & Unlock Slots
                  </h3>
                  <p className="text-xs text-[#6d6979] font-medium">
                    Expand your college circle
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#f6f4fa] text-[#15121d] border border-[#ece9f2] transition-colors"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Badge Highlight */}
            <div className="mt-5 p-4 rounded-2xl bg-[#fff275]/20 border-2 border-[#15121d] shadow-[3px_3px_0_#15121d]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff3d81] fill-[#ff3d81]" />
                <span className="text-base font-black text-[#15121d]">
                  +3 Secret Crush Slots per friend
                </span>
              </div>
              <p className="text-xs text-[#6d6979] mt-1.5 leading-relaxed font-medium">
                Coy works best when your friends & campus circles join. Whenever someone joins via your link, you instantly get 3 bonus crush slots!
              </p>
            </div>

            {/* Privacy Promise Pill */}
            <div className="mt-3.5 p-3 rounded-xl bg-[#f6f4fa] border-2 border-[#15121d] flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#ff3d81] shrink-0 stroke-[2.5]" />
              <p className="text-xs font-semibold text-[#15121d]">
                100% Confidential: Friends never see who invited them or who your crushes are.
              </p>
            </div>

            {/* Link Box */}
            <div className="mt-4">
              <label className="text-xs font-black text-[#15121d] uppercase tracking-wider block mb-2">
                Your Secret Invite Link
              </label>
              <div className="flex items-center gap-2 p-2 bg-[#f6f4fa] border-2 border-[#15121d] rounded-xl shadow-[2px_2px_0_#15121d]">
                <span className="text-xs font-mono font-semibold text-[#15121d] truncate flex-1 pl-1">
                  {inviteLink}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-[#ffffff] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-xs font-black text-[#15121d] hover:bg-[#ffe4ef] flex items-center gap-1.5 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#00b050] stroke-[3]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleSimulateInvite}
                disabled={claiming}
                className="w-full py-3.5 px-4 rounded-xl bg-[#ff3d81] hover:bg-[#e02d6f] border-2 border-[#15121d] shadow-[4px_4px_0_#15121d] font-black text-sm text-white flex items-center justify-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                {claiming ? 'Unlocking Slots...' : 'Simulate Friend Accepted (+3 Slots)'}
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold text-[#6d6979] hover:text-[#15121d] transition-colors"
              >
                Close & Return
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
