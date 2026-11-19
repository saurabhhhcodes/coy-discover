'use client';

import React from 'react';
import { Home, Compass, Heart } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'discover' | 'matches';
  setActiveTab: (tab: 'home' | 'discover' | 'matches') => void;
  matchesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  matchesCount
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff] border-t-2 border-[#15121d] px-6 py-2">
      <div className="max-w-[480px] mx-auto flex justify-around items-center h-14">
        {/* Placeholder Home Tab */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-16 transition-colors ${
            activeTab === 'home' ? 'text-[#15121d] font-bold' : 'text-[#6d6979] hover:text-[#15121d]'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[11px] mt-1 font-bold">Home</span>
        </button>

        {/* Discover Tab (Core Assignment) */}
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center justify-center w-16 transition-colors relative ${
            activeTab === 'discover' ? 'text-[#ff3d81] font-bold' : 'text-[#6d6979] hover:text-[#15121d]'
          }`}
          aria-label="Discover"
        >
          <div
            className={`p-1 rounded-full ${
              activeTab === 'discover'
                ? 'bg-[#ffe4ef] border border-[#ff3d81] text-[#ff3d81]'
                : ''
            }`}
          >
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[11px] mt-0.5 font-bold">Discover</span>
        </button>

        {/* Matches Tab */}
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex flex-col items-center justify-center w-16 transition-colors relative ${
            activeTab === 'matches' ? 'text-[#ff3d81] font-bold' : 'text-[#6d6979] hover:text-[#15121d]'
          }`}
          aria-label="Matches"
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 stroke-[2.2] ${
                activeTab === 'matches' ? 'fill-[#ff3d81] text-[#ff3d81]' : ''
              }`}
            />
            {matchesCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#ff3d81] text-[#15121d] text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center border-2 border-[#15121d] shadow-[1px_1px_0_#15121d]">
                {matchesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 font-bold">Matches</span>
        </button>
      </div>
    </nav>
  );
};
