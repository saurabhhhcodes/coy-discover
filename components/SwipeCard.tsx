'use client';

import React from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ClientProfile } from '@/lib/types';
import { MapPin, Sparkles, Users, GraduationCap, Navigation } from 'lucide-react';

interface SwipeCardProps {
  profile: ClientProfile;
  isFront: boolean;
  onSwipe: (direction: 'like' | 'pass') => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ profile, isFront, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-12, 12]);
  const opacity = useTransform(x, [-350, -120, 0, 120, 350], [0.6, 1, 1, 1, 0.6]);

  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-20, -120], [0, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 90;
    const velocityThreshold = 350;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 1,
        scale: isFront ? 1 : 0.96,
        y: isFront ? 0 : 8,
        zIndex: isFront ? 10 : 0
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isFront ? handleDragEnd : undefined}
      className={`absolute inset-0 w-full h-full rounded-[28px] overflow-hidden bg-[#ffffff] select-none border-2 border-[#15121d] shadow-[4px_4px_0_#15121d] ${
        isFront ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: isFront ? 1 : 0.96, opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
    >
      {/* Photo with unobstructed view */}
      <div className="relative w-full h-full bg-[#f6f4fa]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
        />

        {/* Smooth Gradient focused ONLY on the bottom text area */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#15121d] via-[#15121d]/60 to-transparent pointer-events-none" />

        {/* Top Badges (Pill tags cleanly spaced at top-left) */}
        <div className="absolute top-3 left-3 right-12 flex flex-wrap items-center gap-1.5 pointer-events-none z-10">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffffff] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-[11px] font-bold text-[#15121d]">
            <GraduationCap className="w-3.5 h-3.5 text-[#ff3d81] shrink-0" />
            <span className="truncate max-w-[170px]">{profile.campusCircle}</span>
          </div>

          {profile.distanceKm !== undefined && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#cbf4e0] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-[10px] font-black text-[#0e8f48]">
              <Navigation className="w-3 h-3 text-[#0e8f48]" />
              <span>{profile.distanceKm} km away</span>
            </div>
          )}

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffe45c] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d] text-[10px] font-black text-[#15121d]">
            <Users className="w-3 h-3" />
            <span>{profile.mutualFriendsCount} mutuals</span>
          </div>
        </div>

        {/* Animated Pop Stamps */}
        {isFront && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-16 left-6 border-3 border-[#15121d] bg-[#cbf4e0] text-[#0e8f48] font-black tracking-tight text-2xl uppercase px-4 py-1.5 rounded-2xl rotate-[-12deg] pointer-events-none shadow-[4px_4px_0_#15121d] z-20"
            >
              Secret Crush
            </motion.div>

            <motion.div
              style={{ opacity: passOpacity }}
              className="absolute top-16 right-6 border-3 border-[#15121d] bg-[#ffe4ef] text-[#d92d3a] font-black tracking-tight text-2xl uppercase px-4 py-1.5 rounded-2xl rotate-[12deg] pointer-events-none shadow-[4px_4px_0_#15121d] z-20"
            >
              Pass
            </motion.div>
          </>
        )}

        {/* Profile Details Container (Neatly stacked above the action buttons dock) */}
        <div className="absolute bottom-24 left-0 right-0 px-5 text-[#ffffff] pointer-events-none z-20">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#ffffff] drop-shadow-md">
              {profile.name}
            </h1>
            <span className="text-2xl font-bold text-[#ff3d81]">
              {profile.age}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#ff3d81] shrink-0" />
            <span className="font-semibold">{profile.location}</span>
          </div>

          <p className="mt-2 text-white/95 text-xs leading-relaxed max-w-xl font-medium drop-shadow-xs line-clamp-2">
            {profile.bio}
          </p>

          {/* Interest Chips */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#ffffff] text-[#15121d] border border-[#15121d] shadow-[1px_1px_0_#15121d]"
              >
                <Sparkles className="w-3 h-3 text-[#ff3d81]" />
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
