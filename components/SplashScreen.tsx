'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { CoyWordmark } from './CoyWordmark';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'intro' | 'reveal' | 'exit'>('intro');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('reveal'), 900);
    const t2 = setTimeout(() => setStage('exit'), 2000);
    const t3 = setTimeout(() => onComplete(), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== 'exit' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#ffffff] flex flex-col items-center justify-between p-6 select-none overflow-hidden"
        >
          {/* Top Coy Privacy Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffe4ef] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-[#15121d] text-xs font-black tracking-tight"
          >
            <Lock className="w-3.5 h-3.5 text-[#ff3d81] stroke-[3]" />
            <span>100% CONFIDENTIAL & SAFE</span>
          </motion.div>

          {/* Authentic Neo-Brutalist Centerpiece Card */}
          <div className="flex flex-col items-center text-center my-auto w-full max-w-xs">
            <motion.div
              initial={{ scale: 0.8, rotate: -3, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="p-8 rounded-[32px] bg-[#ffffff] border-3 border-[#15121d] shadow-[8px_8px_0_#15121d] flex flex-col items-center w-full relative"
            >
              {/* Fun Corner Sticker */}
              <div className="absolute -top-3.5 -right-3 px-3 py-1 bg-[#fff275] border-2 border-[#15121d] rounded-full shadow-[2px_2px_0_#15121d] flex items-center gap-1 -rotate-6">
                <Sparkles className="w-3 h-3 text-[#15121d] fill-[#15121d]" />
                <span className="text-[10px] font-black uppercase text-[#15121d]">Campus 2026</span>
              </div>

              {/* Exact official Coy Wordmark */}
              <div className="py-2">
                <CoyWordmark size="xl" textColor="text-[#15121d]" />
              </div>

              {/* Coy value proposition */}
              <div className="mt-4 pt-4 border-t-2 border-[#15121d]/15 w-full">
                <p className="text-xs font-black text-[#15121d] leading-snug">
                  Find out if your crush likes you back.
                </p>
                <p className="text-[11px] font-semibold text-[#6d6979] mt-1 leading-snug">
                  If they don&apos;t, nobody ever knows.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom Security / Loading Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center gap-2.5 w-full max-w-xs"
          >
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#15121d]">
              <ShieldCheck className="w-4 h-4 text-[#00b050] stroke-[2.5]" />
              <span>Campus Verified • Zero Public Rejection</span>
            </div>

            {/* Neo-brutalist progress loader */}
            <div className="w-44 h-3 bg-[#f6f4fa] border-2 border-[#15121d] rounded-full shadow-[2px_2px_0_#15121d] overflow-hidden p-0.5">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                className="h-full rounded-full bg-[#ff3d81]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
