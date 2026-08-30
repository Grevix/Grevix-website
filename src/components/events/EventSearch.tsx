'use client';

import React, { useEffect, useRef } from 'react';

interface EventSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export function EventSearch({ searchQuery, onSearchChange, onClear }: EventSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global '/' keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1 min-w-[260px]">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by event, technology, or organizer..."
          aria-label="Search opportunities by title, technology, or host"
          className="w-full bg-transparent border-b border-[#1E2330] hover:border-[#8D98A8] focus:border-[#F4F5F6] text-[#F4F5F6] text-sm py-2.5 pr-14 placeholder:text-[#5A6475] focus:outline-none transition-colors"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-0 text-xs text-[#8D98A8] hover:text-[#F4F5F6] px-1 py-0.5"
            aria-label="Clear search"
          >
            Clear ?
          </button>
        ) : (
          <span
            className="hidden sm:inline absolute right-0 font-mono text-[10px] text-[#5A6475] border border-[#1E2330] px-1.5 py-0.5 rounded-[2px] select-none"
            title="Press '/' to search"
          >
            /
          </span>
        )}
      </div>
    </div>
  );
}
