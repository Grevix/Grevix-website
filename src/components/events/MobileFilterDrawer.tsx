'use client';

import React, { useEffect } from 'react';
import { EventMode } from '@/types/event';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: string;
  currentTrack: string;
  currentLocation: string;
  currentSort: string;
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  totalResults: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  currentMode,
  currentTrack,
  currentLocation,
  currentSort,
  onFilterChange,
  onReset,
  totalResults,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const eventModes: { value: EventMode | 'all'; label: string }[] = [
    { value: 'all', label: 'All Modes' },
    { value: 'online', label: 'Online Only' },
    { value: 'offline', label: 'In-Person' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const tracks = [
    { value: 'all', label: 'All Tracks' },
    { value: 'ai', label: 'AI & Multi-Modal' },
    { value: 'web3', label: 'Web3 & ZK' },
    { value: 'systems', label: 'Systems & Rust' },
    { value: 'dsa', label: 'DSA & Speed Coding' },
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'usa', label: 'United States' },
    { value: 'india', label: 'India' },
    { value: 'global', label: 'Global Remote' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#050609]/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-drawer-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-[#0B0D14] border-l border-[#1E2330] h-full flex flex-col z-10 overflow-y-auto text-xs shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1E2330]">
          <div>
            <h2 className="font-display font-semibold text-sm text-[#F4F5F6]" id="filter-drawer-title">
              REFINE DISCOVERY
            </h2>
            <p className="text-[11px] text-[#5A6475] mt-0.5">{totalResults} matching opportunities</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8D98A8] hover:text-[#F4F5F6] text-xs font-mono p-1"
            aria-label="Close filters"
          >
            ? Close
          </button>
        </div>

        {/* Filters Content */}
        <div className="py-6 space-y-6 flex-1">
          {/* Mode */}
          <div>
            <label className="block font-mono text-[10px] text-[#8D98A8] uppercase tracking-wider mb-2.5">
              01 / FORMAT & MODE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {eventModes.map((m) => {
                const isSelected = currentMode === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => onFilterChange('mode', m.value)}
                    className={`px-3 py-2 text-left rounded-[2px] border transition-colors ${
                      isSelected
                        ? 'bg-[#1E2330] border-[#6F9FFF] text-[#F4F5F6] font-medium'
                        : 'border-[#1E2330] text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#050609]'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Domain Track */}
          <div>
            <label className="block font-mono text-[10px] text-[#8D98A8] uppercase tracking-wider mb-2.5">
              02 / DOMAIN TRACK
            </label>
            <div className="flex flex-wrap gap-2">
              {tracks.map((tr) => {
                const isSelected = currentTrack === tr.value;
                return (
                  <button
                    key={tr.value}
                    type="button"
                    onClick={() => onFilterChange('track', tr.value)}
                    className={`px-3 py-1.5 rounded-[2px] border transition-colors ${
                      isSelected
                        ? 'bg-[#1E2330] border-[#6F9FFF] text-[#F4F5F6] font-medium'
                        : 'border-[#1E2330] text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#050609]'
                    }`}
                  >
                    {tr.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Geography */}
          <div>
            <label className="block font-mono text-[10px] text-[#8D98A8] uppercase tracking-wider mb-2.5">
              03 / LOCATION / REGION
            </label>
            <div className="grid grid-cols-2 gap-2">
              {locations.map((loc) => {
                const isSelected = currentLocation === loc.value;
                return (
                  <button
                    key={loc.value}
                    type="button"
                    onClick={() => onFilterChange('location', loc.value)}
                    className={`px-3 py-2 text-left rounded-[2px] border transition-colors ${
                      isSelected
                        ? 'bg-[#1E2330] border-[#6F9FFF] text-[#F4F5F6] font-medium'
                        : 'border-[#1E2330] text-[#8D98A8] hover:text-[#F4F5F6] hover:bg-[#050609]'
                    }`}
                  >
                    {loc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block font-mono text-[10px] text-[#8D98A8] uppercase tracking-wider mb-2.5">
              04 / SORT ORDER
            </label>
            <select
              value={currentSort}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="w-full bg-[#050609] border border-[#1E2330] text-[#F4F5F6] p-2.5 rounded-[2px] focus:outline-none focus:border-[#6F9FFF]"
            >
              <option value="deadline_asc">Closing Soonest</option>
              <option value="start_asc">Chronological Start Date</option>
              <option value="prize_desc">Prize Value</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#1E2330] flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-2.5 text-[#8D98A8] hover:text-[#F4F5F6] border border-[#1E2330] rounded-[2px] transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#F4F5F6] hover:bg-[#E5E7EB] text-[#050609] font-semibold rounded-[2px] transition-colors"
          >
            View {totalResults} Results
          </button>
        </div>
      </div>
    </div>
  );
}
