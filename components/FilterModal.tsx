'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Check, RotateCcw, Navigation, ChevronDown, Sparkles } from 'lucide-react';

export interface FilterState {
  location: string;
  interest: string;
  gender: string;
  ageMin: number;
  ageMax: number;
  maxDistanceKm: number;
  useCurrentLocation: boolean;
  sortBy: 'recommended' | 'nearest' | 'mutuals';
}

interface FilterModalProps {
  isOpen: boolean;
  filters: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  userCoords: { latitude: number; longitude: number } | null;
  onRequestLocation: () => void;
}

const LOCATIONS = [
  { label: 'All Locations', value: 'all' },
  { label: '📍 Delhi / NCR (DU, SPA, IITD)', value: 'Delhi' },
  { label: '📍 Mumbai (NIFT, TISS, IITB)', value: 'Mumbai' },
  { label: '📍 Bangalore (IISc, NLSIU, St. Joseph\'s)', value: 'Bangalore' },
  { label: '📍 Pune (COEP, Symbiosis, FTII)', value: 'Pune' },
  { label: '📍 BITS Pilani Campus', value: 'BITS' },
  { label: '📍 Kolkata (Jadavpur, Presidency)', value: 'Kolkata' },
  { label: '📍 Chennai (IIT Madras)', value: 'Chennai' },
  { label: '📍 Goa University', value: 'Goa' },
  { label: '📍 Ahmedabad (CEPT)', value: 'Ahmedabad' }
];

const INTERESTS = [
  { label: 'All Interests', value: 'all' },
  { label: '🏛️ Architecture & Design', value: 'Architecture' },
  { label: '☕ Specialty Coffee & Cafes', value: 'Coffee' },
  { label: '🎵 Indie Rock & Music', value: 'Music' },
  { label: '💻 AI, Startups & Coding', value: 'AI' },
  { label: '📚 Literature & Poetry', value: 'Literature' },
  { label: '🏔️ Trekking & Bouldering', value: 'Trekking' },
  { label: '📸 35mm Photography', value: 'Photography' },
  { label: '🍳 Gastronomy & Baking', value: 'Baking' },
  { label: '⚽ Sports & Football', value: 'Football' },
  { label: '🎨 Fine Arts & Ceramics', value: 'Painting' },
  { label: '⚖️ Debate & Mock Trial', value: 'Debate' }
];

const GENDERS = [
  { label: 'Everyone', value: 'all' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' }
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  filters,
  onClose,
  onApply,
  userCoords,
  onRequestLocation
}) => {
  const [selectedLoc, setSelectedLoc] = useState(filters.location);
  const [selectedInterest, setSelectedInterest] = useState(filters.interest);
  const [selectedGender, setSelectedGender] = useState(filters.gender || 'all');
  const [ageMin, setAgeMin] = useState(filters.ageMin);
  const [ageMax, setAgeMax] = useState(filters.ageMax);
  const [distanceKm, setDistanceKm] = useState(filters.maxDistanceKm);
  const [useCurrentLoc, setUseCurrentLoc] = useState(filters.useCurrentLocation);
  const [sortBy, setSortBy] = useState(filters.sortBy);

  const handleReset = () => {
    setSelectedLoc('all');
    setSelectedInterest('all');
    setSelectedGender('all');
    setAgeMin(18);
    setAgeMax(30);
    setDistanceKm(50);
    setUseCurrentLoc(false);
    setSortBy('recommended');
  };

  const handleApply = () => {
    onApply({
      location: selectedLoc,
      interest: selectedInterest,
      gender: selectedGender,
      ageMin,
      ageMax,
      maxDistanceKm: distanceKm,
      useCurrentLocation: useCurrentLoc,
      sortBy
    });
    onClose();
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
            className="w-full max-w-[480px] bg-[#ffffff] border-t-3 sm:border-3 border-[#15121d] sm:shadow-[8px_8px_0_#15121d] rounded-t-[32px] sm:rounded-[32px] p-6 text-[#15121d] max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#15121d]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#ff3d81] stroke-[2.5]" />
                <div>
                  <h3 className="font-extrabold text-xl text-[#15121d]">Filters</h3>
                  <p className="text-xs text-[#6d6979] font-medium">Fine-tune who you see in Discover</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#f6f4fa] text-[#15121d] border border-[#ece9f2]"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* AGE FILTER: Full Granular Dual Range 18 to 60 */}
            <div className="mt-5 p-4 rounded-2xl bg-[#f6f4fa] border-2 border-[#15121d] shadow-[2px_2px_0_#15121d]">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-black text-[#15121d] uppercase tracking-wider">
                  Age Range
                </label>
                <span className="coy-pill yellow font-black text-xs py-0.5 px-3">
                  {ageMin} to {ageMax} years old
                </span>
              </div>

              {/* Min Age Slider */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-[#6d6979] mb-1">
                    <span>Minimum Age</span>
                    <span className="text-[#15121d] font-black">{ageMin} yrs</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={55}
                    value={ageMin}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val <= ageMax) setAgeMin(val);
                    }}
                    className="w-full accent-[#ff3d81] cursor-pointer"
                  />
                </div>

                {/* Max Age Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-[#6d6979] mb-1">
                    <span>Maximum Age</span>
                    <span className="text-[#15121d] font-black">{ageMax} yrs</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={60}
                    value={ageMax}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= ageMin) setAgeMax(val);
                    }}
                    className="w-full accent-[#ff3d81] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* SHOW ME / GENDER */}
            <div className="mt-5">
              <label className="text-xs font-black text-[#15121d] uppercase tracking-wider block mb-2">
                Interested In
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setSelectedGender(g.value)}
                    className={`py-2 px-3 rounded-full text-xs font-bold border-2 border-[#15121d] transition-all shadow-[2px_2px_0_#15121d] ${
                      selectedGender === g.value
                        ? 'bg-[#ffe4ef] text-[#d81e63] font-black'
                        : 'bg-[#ffffff] text-[#15121d] hover:bg-[#f6f4fa]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* GPS Live Proximity Toggle */}
            <div className="mt-5 p-3.5 rounded-2xl bg-[#f6f4fa] border-2 border-[#15121d] shadow-[3px_3px_0_#15121d]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#ff3d81] text-[#ffffff] flex items-center justify-center border border-[#15121d]">
                    <Navigation className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#15121d]">Live Proximity</h4>
                    <p className="text-[11px] text-[#6d6979] font-medium">
                      {userCoords ? `📍 Coords Active (${userCoords.latitude.toFixed(1)}, ${userCoords.longitude.toFixed(1)})` : 'Find students around your GPS'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!userCoords) onRequestLocation();
                    setUseCurrentLoc(!useCurrentLoc);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-black border-2 border-[#15121d] transition-all shadow-[2px_2px_0_#15121d] ${
                    useCurrentLoc
                      ? 'bg-[#cbf4e0] text-[#0e8f48]'
                      : 'bg-[#ffffff] text-[#15121d] hover:bg-[#ffe4ef]'
                  }`}
                >
                  {useCurrentLoc ? 'Enabled ✓' : 'Use GPS'}
                </button>
              </div>

              {useCurrentLoc && (
                <div className="mt-3 pt-3 border-t border-[#ece9f2]">
                  <div className="flex justify-between items-center text-xs font-bold text-[#15121d] mb-1.5">
                    <span>Max Distance Radius</span>
                    <span className="coy-pill pink text-xs font-black">
                      Within {distanceKm} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={150}
                    step={5}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(parseInt(e.target.value))}
                    className="w-full accent-[#ff3d81] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#6d6979] mt-1 font-bold">
                    <span>5 km (Campus)</span>
                    <span>50 km (City)</span>
                    <span>150 km (Zone)</span>
                  </div>
                </div>
              )}
            </div>

            {/* SORTING */}
            <div className="mt-5">
              <label className="text-xs font-black text-[#15121d] uppercase tracking-wider block mb-2">
                Sort Profiles By
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'recommended', label: '🔥 Best Match' },
                  { id: 'nearest', label: '📍 Closest' },
                  { id: 'mutuals', label: '👥 Most Mutuals' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold text-center border-2 border-[#15121d] transition-all ${
                      sortBy === s.id
                        ? 'bg-[#15121d] text-[#ffffff] shadow-[2px_2px_0_#ff3d81]'
                        : 'bg-[#f6f4fa] text-[#15121d] hover:bg-[#ece9f2]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LOCATIONS */}
            <div className="mt-5">
              <label className="text-xs font-black text-[#15121d] uppercase tracking-wider block mb-2">
                Campus / City Circle
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {LOCATIONS.map((loc) => {
                  const isSelected = selectedLoc === loc.value;
                  return (
                    <button
                      key={loc.value}
                      onClick={() => setSelectedLoc(loc.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 border-[#15121d] transition-all shadow-[2px_2px_0_#15121d] ${
                        isSelected
                          ? 'bg-[#ff3d81] text-[#ffffff]'
                          : 'bg-[#ffffff] text-[#15121d] hover:bg-[#f6f4fa]'
                      }`}
                    >
                      {loc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INTERESTS */}
            <div className="mt-5">
              <label className="text-xs font-black text-[#15121d] uppercase tracking-wider block mb-2">
                Interests & Passions
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {INTERESTS.map((int) => {
                  const isSelected = selectedInterest === int.value;
                  return (
                    <button
                      key={int.value}
                      onClick={() => setSelectedInterest(int.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 border-[#15121d] transition-all shadow-[2px_2px_0_#15121d] ${
                        isSelected
                          ? 'bg-[#ffe45c] text-[#15121d]'
                          : 'bg-[#ffffff] text-[#15121d] hover:bg-[#f6f4fa]'
                      }`}
                    >
                      {int.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handleReset}
                className="coy-btn quiet flex-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleApply}
                className="coy-btn flex-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Apply Filters</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
