'use client';

import React, { useState } from 'react';
import { MatchRecord } from '@/lib/types';
import { Heart, MessageSquare, MapPin, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { ChatModal } from './ChatModal';
import { ReportModal } from './ReportModal';
import { CoyWordmark } from './CoyWordmark';

interface MatchesTabProps {
  matches: MatchRecord[];
  onStartDiscover: () => void;
  onRefreshMatches: () => void;
}

export const MatchesTab: React.FC<MatchesTabProps> = ({
  matches,
  onStartDiscover,
  onRefreshMatches
}) => {
  const [activeChatMatch, setActiveChatMatch] = useState<MatchRecord | null>(null);
  const [reportTarget, setReportTarget] = useState<{ id: string; name: string } | null>(null);

  const handleUnmatch = async (profileId: string) => {
    if (confirm('Remove this crush connection? You won\'t be able to chat anymore.')) {
      try {
        const res = await fetch('/api/matches', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileId })
        });
        const data = await res.json();
        if (data.success) {
          if (activeChatMatch?.profile.id === profileId) {
            setActiveChatMatch(null);
          }
          onRefreshMatches();
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-20 w-full overflow-y-auto bg-[#ffffff] text-[#15121d]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#ece9f2]">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#15121d]">Mutual Crushes</h1>
          <p className="text-xs text-[#6d6979] mt-0.5 font-medium">
            Only revealed because you both liked each other ❤️
          </p>
        </div>
        <div className="coy-pill pink">
          <Heart className="w-3.5 h-3.5 fill-[#ff3d81] text-[#ff3d81]" />
          <span>{matches.length} Matches</span>
        </div>
      </div>

      {/* Matches List or Empty State */}
      {matches.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
          <div className="w-20 h-20 rounded-full bg-[#ffe4ef] border-2 border-[#ff3d81] flex items-center justify-center text-[#ff3d81] mb-4 shadow-[3px_3px_0_#ff3d81]">
            <Heart className="w-10 h-10 stroke-[2]" />
          </div>
          <h3 className="text-2xl font-black text-[#15121d]">No mutual crushes yet</h3>
          <p className="text-xs text-[#6d6979] mt-2 max-w-xs leading-relaxed font-medium">
            Matches happen when someone you secret-crush also confesses on you. Explore Discover to find your match!
          </p>
          <button
            onClick={onStartDiscover}
            className="coy-btn mt-6"
          >
            Start Swiping on Discover
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 mt-4 pb-4">
          {matches.map((item) => {
            const hasMessages = item.messages && item.messages.length > 0;
            const lastMessage = hasMessages ? item.messages[item.messages.length - 1].text : 'Say hello...';

            return (
              <div
                key={item.profile.id}
                className="bg-[#ffffff] rounded-2xl overflow-hidden border-2 border-[#15121d] shadow-[3px_3px_0_#15121d] hover:shadow-[5px_5px_0_#15121d] transition-shadow group flex flex-col relative"
              >
                {/* Photo & Quick Badges */}
                <div className="relative aspect-4/5 w-full bg-[#f6f4fa] overflow-hidden border-b-2 border-[#15121d]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.profile.photo}
                    alt={item.profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15121d]/90 via-transparent to-transparent" />

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnmatch(item.profile.id);
                    }}
                    title="Remove connection"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-[#ffffff] hover:bg-[#ffe4ef] text-[#d92d3a] border border-[#15121d] shadow-[1px_1px_0_#15121d] transition-colors z-10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <div className="font-black text-sm leading-snug">
                      {item.profile.name}, {item.profile.age}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-white/80 truncate font-semibold">
                      <MapPin className="w-3 h-3 text-[#ff3d81] shrink-0" />
                      <span className="truncate">{item.profile.location}</span>
                    </div>
                  </div>
                </div>

                {/* Details & Interactive Say Hello CTA */}
                <div className="p-3 flex-1 flex flex-col justify-between bg-[#ffffff]">
                  <p className="text-[11px] text-[#6d6979] truncate italic mb-2.5 font-medium">
                    &ldquo;{lastMessage}&rdquo;
                  </p>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => setActiveChatMatch(item)}
                      className="coy-btn small w-full text-xs font-black"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Say Hello
                    </button>

                    <button
                      onClick={() => setReportTarget({ id: item.profile.id, name: item.profile.name })}
                      className="w-full py-1 text-[10px] text-[#6d6979] hover:text-[#d92d3a] flex items-center justify-center gap-1 transition-colors font-bold"
                    >
                      <ShieldAlert className="w-3 h-3 text-[#d92d3a]" />
                      Report / Block
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Chat Window */}
      <ChatModal
        match={activeChatMatch}
        onClose={() => setActiveChatMatch(null)}
        onUnmatch={(id) => handleUnmatch(id)}
        onReport={(id, name) => setReportTarget({ id, name })}
        onRefreshMatches={onRefreshMatches}
      />

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={true}
          profileId={reportTarget.id}
          profileName={reportTarget.name}
          onClose={() => setReportTarget(null)}
          onReportSuccess={() => {
            if (activeChatMatch?.profile.id === reportTarget.id) {
              setActiveChatMatch(null);
            }
            onRefreshMatches();
          }}
        />
      )}
    </div>
  );
};
