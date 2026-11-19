'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ClientProfile, UserStats } from '@/lib/types';
import { SwipeCard } from './SwipeCard';
import { MatchModal } from './MatchModal';
import { InviteModal } from './InviteModal';
import { FilterModal, FilterState } from './FilterModal';
import { ReportModal } from './ReportModal';
import { CoyWordmark } from './CoyWordmark';
import { X, Heart, RotateCcw, Sparkles, SlidersHorizontal, Flame, Share2, ShieldAlert } from 'lucide-react';

interface DiscoverTabProps {
  onMatchFound: () => void;
  onOpenMatches: () => void;
}

export const DiscoverTab: React.FC<DiscoverTabProps> = ({
  onMatchFound,
  onOpenMatches
}) => {
  const [profiles, setProfiles] = useState<ClientProfile[]>([]);
  const [stats, setStats] = useState<UserStats>({
    confessionsLeft: 5,
    totalCrushSlots: 5,
    incomingSecretAdmirers: 3,
    invitedFriendsCount: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentMatch, setCurrentMatch] = useState<ClientProfile | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);
  const [swipeEffect, setSwipeEffect] = useState<'like' | 'pass' | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);

  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    interest: 'all',
    gender: 'all',
    ageMin: 18,
    ageMax: 30,
    maxDistanceKm: 50,
    useCurrentLocation: false,
    sortBy: 'recommended'
  });

  const handleRequestLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setFilters((prev) => ({ ...prev, useCurrentLocation: true }));
        },
        (err) => {
          console.warn('Geolocation not allowed, defaulting:', err);
          setUserCoords({ latitude: 28.6139, longitude: 77.2090 });
          setFilters((prev) => ({ ...prev, useCurrentLocation: true }));
        }
      );
    }
  };

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.location !== 'all') query.set('location', filters.location);
      if (filters.interest !== 'all') query.set('interest', filters.interest);
      if (filters.gender !== 'all') query.set('gender', filters.gender);
      if (filters.ageMin > 18) query.set('ageMin', filters.ageMin.toString());
      if (filters.ageMax < 30) query.set('ageMax', filters.ageMax.toString());
      if (filters.sortBy !== 'recommended') query.set('sortBy', filters.sortBy);

      if (filters.useCurrentLocation && userCoords) {
        query.set('userLat', userCoords.latitude.toString());
        query.set('userLon', userCoords.longitude.toString());
        query.set('maxDistanceKm', filters.maxDistanceKm.toString());
      }

      const res = await fetch(`/api/feed?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, userCoords]);

  const refreshStats = async () => {
    try {
      const res = await fetch('/api/invite');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (profiles.length === 0 || isSwiping) return;

    if (direction === 'like' && stats.confessionsLeft <= 0) {
      setIsInviteOpen(true);
      return;
    }

    setIsSwiping(true);
    setSwipeEffect(direction);
    const activeProfile = profiles[0];

    setProfiles((prev) => prev.slice(1));
    if (direction === 'like') {
      setStats((prev) => ({
        ...prev,
        confessionsLeft: Math.max(0, prev.confessionsLeft - 1)
      }));
    }

    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: activeProfile.id,
          direction
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.outOfSlots) {
          setIsInviteOpen(true);
          fetchFeed();
        } else if (data.isMatch) {
          setCurrentMatch(data.profile);
          onMatchFound();
          refreshStats();
        }
      }
    } catch (err) {
      console.error('Failed to register swipe:', err);
    } finally {
      setIsSwiping(false);
      setTimeout(() => setSwipeEffect(null), 700);
    }
  };

  const handleResetData = async () => {
    if (confirm('Reset all swipes, matches, and slots for demo?')) {
      await fetch('/api/reset', { method: 'POST' });
      fetchFeed();
      onMatchFound();
    }
  };

  const activeFiltersCount =
    (filters.location !== 'all' ? 1 : 0) +
    (filters.interest !== 'all' ? 1 : 0) +
    (filters.gender !== 'all' ? 1 : 0) +
    (filters.ageMax < 30 || filters.ageMin > 18 ? 1 : 0) +
    (filters.useCurrentLocation ? 1 : 0);

  return (
    <div className="relative w-full h-[100dvh] bg-[#ffffff] flex flex-col justify-between overflow-hidden select-none pb-16">
      {/* Top Header - Exact Coy styling */}
      <header className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-[#ece9f2] bg-[#ffffff] z-30">
        <div className="flex items-center gap-2">
          <CoyWordmark size="sm" textColor="text-[#15121d]" />
          <span className="coy-pill pink text-[10px] py-0.5 px-2">
            Discover
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#15121d] text-xs font-bold transition-all shadow-[2px_2px_0_#15121d] active:translate-x-[1px] active:translate-y-[1px] ${
              activeFiltersCount > 0
                ? 'bg-[#ffe45c] text-[#15121d]'
                : 'bg-[#ffffff] text-[#15121d] hover:bg-[#f6f4fa]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#15121d] text-[#ffffff] text-[10px] font-black flex items-center justify-center -mr-0.5">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ffe4ef] text-[#ff3d81] border-2 border-[#ff3d81] text-xs font-bold hover:bg-[#ffd1e3] transition-all shadow-[2px_2px_0_#ff3d81]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>+3 Slots</span>
          </button>

          <button
            onClick={handleResetData}
            title="Reset demo data"
            className="p-1.5 rounded-full bg-[#f6f4fa] hover:bg-[#ece9f2] text-[#15121d] border border-[#ece9f2] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Secret Admirer Ribbon */}
      <div className="px-4 py-2 bg-[#f6f4fa] border-b border-[#ece9f2] flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-xs font-bold text-[#15121d] truncate">
          <Flame className="w-4 h-4 text-[#ff3d81] fill-[#ff3d81] shrink-0" />
          <span className="truncate">
            <strong>{stats.incomingSecretAdmirers} secret admirers</strong> around you
          </span>
        </div>
        <div className="coy-pill yellow text-[10px] py-0.5 px-2 font-black shrink-0">
          {stats.confessionsLeft} slots left
        </div>
      </div>

      {/* FULL-SCREEN CARD DECK CANVAS */}
      <div className="relative w-full flex-1 p-3 flex items-center justify-center">
        {/* Full-Screen Animated Splash Feedback for Liking / Passing */}
        <AnimatePresence>
          {swipeEffect === 'like' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-[#cbf4e0] border-3 border-[#15121d] shadow-[5px_5px_0_#15121d] flex items-center justify-center">
                <Heart className="w-14 h-14 fill-[#0e8f48] text-[#0e8f48]" />
              </div>
              <span className="text-sm font-black mt-3 uppercase tracking-tight text-[#0e8f48] bg-[#ffffff] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] px-4 py-1 rounded-full">
                Secret Crush!
              </span>
            </motion.div>
          )}

          {swipeEffect === 'pass' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.25, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-40 pointer-events-none flex flex-col items-center justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-[#ffe4ef] border-3 border-[#15121d] shadow-[5px_5px_0_#15121d] flex items-center justify-center">
                <X className="w-14 h-14 stroke-[3.5] text-[#d92d3a]" />
              </div>
              <span className="text-sm font-black mt-3 uppercase tracking-tight text-[#d92d3a] bg-[#ffffff] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] px-4 py-1 rounded-full">
                Passed
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#ff3d81] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#6d6979]">Finding crushes in your circle...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#f6f4fa] rounded-[28px] border-2 border-[#15121d] shadow-[4px_4px_0_#15121d]">
            <div className="w-16 h-16 rounded-full bg-[#ffe4ef] border-2 border-[#ff3d81] flex items-center justify-center text-[#ff3d81] mb-3 shadow-[2px_2px_0_#ff3d81]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-[#15121d]">No Profiles Left</h2>
            <p className="text-xs text-[#6d6979] mt-2 max-w-xs leading-relaxed font-medium">
              {activeFiltersCount > 0
                ? 'Try expanding your campus radius or resetting filters to see more peers.'
                : 'You have browsed every candidate in this batch. Invite friends to unlock new circles!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 mt-5 w-full max-w-xs">
              {activeFiltersCount > 0 ? (
                <button
                  onClick={() =>
                    setFilters({
                      location: 'all',
                      interest: 'all',
                      gender: 'all',
                      ageMin: 18,
                      ageMax: 30,
                      maxDistanceKm: 50,
                      useCurrentLocation: false,
                      sortBy: 'recommended'
                    })
                  }
                  className="coy-btn small"
                >
                  Clear Filters
                </button>
              ) : (
                <button onClick={() => setIsInviteOpen(true)} className="coy-btn small">
                  Invite Friends (+3)
                </button>
              )}
              <button
                onClick={handleResetData}
                className="coy-btn quiet small"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <AnimatePresence>
              {profiles.slice(0, 2).map((profile, index) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  isFront={index === 0}
                  onSwipe={handleSwipe}
                />
              ))}
            </AnimatePresence>

            {/* In-feed Report Button */}
            {profiles.length > 0 && (
              <button
                onClick={() => setReportTarget({ id: profiles[0].id, name: profiles[0].name })}
                title="Report profile"
                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-[#ffffff] hover:bg-[#f6f4fa] text-[#15121d] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] transition-transform active:translate-x-[1px] active:translate-y-[1px]"
              >
                <ShieldAlert className="w-4 h-4 text-[#d92d3a]" />
              </button>
            )}

            {/* FLOATING ACTION DOCK: Authentic Coy Neo-Brutalist Pop Buttons */}
            <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-8 pointer-events-auto">
              {/* Pass Button */}
              <button
                onClick={() => handleSwipe('pass')}
                disabled={isSwiping}
                className="w-16 h-16 rounded-full bg-[#ffffff] hover:bg-[#ffe4ef] border-3 border-[#15121d] shadow-[4px_4px_0_#15121d] flex items-center justify-center text-[#d92d3a] transition-transform hover:scale-105 active:shadow-[1px_1px_0_#15121d] active:translate-x-[2px] active:translate-y-[2px]"
                aria-label="Pass"
              >
                <X className="w-8 h-8 stroke-[3]" />
              </button>

              {/* Secret Crush Like Button */}
              <button
                onClick={() => handleSwipe('like')}
                disabled={isSwiping}
                className="w-18 h-18 rounded-full bg-[#ff3d81] hover:bg-[#ff5a94] border-3 border-[#15121d] shadow-[5px_5px_0_#15121d] flex items-center justify-center text-[#15121d] transition-transform hover:scale-105 active:shadow-[1px_1px_0_#15121d] active:translate-x-[2px] active:translate-y-[2px] relative"
                aria-label="Secret Crush Like"
              >
                <Heart className="w-10 h-10 fill-[#ffffff] text-[#15121d] stroke-[2.5]" />
                {stats.confessionsLeft === 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ffe45c] text-[#15121d] text-[10px] font-black px-1.5 py-0.2 rounded-full border-2 border-[#15121d]">
                    0
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Match Celebration Dialog */}
      <MatchModal
        match={currentMatch}
        onClose={() => setCurrentMatch(null)}
        onOpenMatches={() => {
          setCurrentMatch(null);
          onOpenMatches();
        }}
      />

      {/* Invite Friends Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onBonusUnlocked={() => refreshStats()}
      />

      {/* Filters Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        filters={filters}
        onClose={() => setIsFilterOpen(false)}
        onApply={(newFilters) => setFilters(newFilters)}
        userCoords={userCoords}
        onRequestLocation={handleRequestLocation}
      />

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={true}
          profileId={reportTarget.id}
          profileName={reportTarget.name}
          onClose={() => setReportTarget(null)}
          onReportSuccess={() => {
            setProfiles((prev) => prev.filter((p) => p.id !== reportTarget.id));
          }}
        />
      )}
    </div>
  );
};
