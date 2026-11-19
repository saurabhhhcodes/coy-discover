'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { DiscoverTab } from '@/components/DiscoverTab';
import { MatchesTab } from '@/components/MatchesTab';
import { HomeTab } from '@/components/HomeTab';
import { SplashScreen } from '@/components/SplashScreen';
import { MatchRecord } from '@/lib/types';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'matches'>('discover');
  const [matches, setMatches] = useState<MatchRecord[]>([]);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return (
    <div className="w-full h-[100dvh] bg-slate-950 flex flex-col items-center justify-center overflow-hidden antialiased">
      {/* Animated Coy Brand Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <main className="w-full h-full max-w-md mx-auto bg-slate-950 relative overflow-hidden flex flex-col shadow-2xl">
        {activeTab === 'home' && (
          <HomeTab onGoToDiscover={() => setActiveTab('discover')} />
        )}

        {activeTab === 'discover' && (
          <DiscoverTab
            onMatchFound={fetchMatches}
            onOpenMatches={() => setActiveTab('matches')}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesTab
            matches={matches}
            onStartDiscover={() => setActiveTab('discover')}
            onRefreshMatches={fetchMatches}
          />
        )}

        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          matchesCount={matches.length}
        />
      </main>
    </div>
  );
}
