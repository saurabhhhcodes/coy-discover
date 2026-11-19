'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Users, Flame, Lock, Gift, Share2, Compass, Plus } from 'lucide-react';
import { InviteModal } from './InviteModal';
import { CoyWordmark } from './CoyWordmark';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-20 justify-between overflow-y-auto bg-[#ffffff] text-[#15121d]">
      <div>
        {/* Header matching exact Coy sheet top */}
        <header className="flex items-center justify-between pb-3 border-b border-[#ece9f2]">
          <CoyWordmark size="sm" textColor="text-[#15121d]" />
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe4ef] text-[#ff3d81] border-2 border-[#ff3d81] text-xs font-bold hover:bg-[#ffd1e3] transition-colors"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Invite Link</span>
          </button>
        </header>

        {/* Hero Section */}
        <div className="mt-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe4ef] text-[#d81e63] text-xs font-bold border-2 border-[#ff3d81] shadow-[2px_2px_0_#ff3d81] mb-3">
            <Lock className="w-3.5 h-3.5 text-[#ff3d81]" />
            <span>100% Secret Until Both Like Back</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-[#15121d] tracking-tight leading-[1.05]">
            Who&apos;s your crush?
          </h1>
          <p className="text-base text-[#6d6979] mt-3 max-w-[32ch] font-medium leading-relaxed">
            Find out if your crush likes you back. If they don&apos;t, nobody ever knows.
          </p>
        </div>

        {/* Coy Crush List Mockup (Exact Neo-brutalist row style as on app.getcoy.com) */}
        <div className="mt-6 space-y-3">
          <div className="coy-row justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffe4ef] border-2 border-[#15121d] flex items-center justify-center font-black text-sm text-[#ff3d81]">
                A
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#15121d]">Ananya Sharma</h4>
                <p className="text-xs text-[#6d6979] font-medium">SPA Delhi • Batch of &apos;25</p>
              </div>
            </div>
            <span className="coy-pill mint">Matched! 🎉</span>
          </div>

          <div className="coy-row justify-between bg-[#f6f4fa] border-dashed border-[#6d6979] shadow-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffffff] border-2 border-[#6d6979] flex items-center justify-center font-bold text-sm text-[#6d6979]">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#6d6979]">Add another secret crush</h4>
                <p className="text-xs text-[#6d6979]">4 slots available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Viral Campus Alert Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-[#ffe45c] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#15121d] fill-[#15121d]" />
            <h4 className="font-black text-sm text-[#15121d]">Campus Pulse</h4>
          </div>
          <p className="text-xs font-semibold text-[#15121d] mt-1.5 leading-snug">
            Over 14 students from your college network joined this week. Check the Discover tab to find your match!
          </p>
        </div>
      </div>

      {/* CTA Navigation to Discover */}
      <div className="mt-6 space-y-2.5 pb-2">
        <button
          onClick={onGoToDiscover}
          className="coy-btn w-full"
        >
          <Compass className="w-5 h-5" />
          <span>Go to Discover Tab</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="coy-btn quiet w-full"
        >
          <Share2 className="w-4 h-4 text-[#ff3d81]" />
          <span>Invite Friends (+3 Free Slots)</span>
        </button>
      </div>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onBonusUnlocked={() => {}}
      />
    </div>
  );
};
