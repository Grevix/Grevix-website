'use client';

import React from 'react';

interface EmptyStateProps {
  message?: string;
  hasFilters?: boolean;
  onReset?: () => void;
}

export function EmptyState({
  message = 'No technical events match the selected criteria.',
  hasFilters = false,
  onReset,
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center border-t border-b border-[#1E2330] my-8">
      <div className="font-mono text-xs text-[#8D98A8] tracking-widest uppercase mb-2">
        0 RESULTS FOUND
      </div>
      <p className="text-sm text-[#5A6475] max-w-md mx-auto mb-6">
        {message} Try modifying your search keywords or clearing active filters.
      </p>
      {hasFilters && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 bg-[#F4F5F6] hover:bg-[#E5E7EB] text-[#050609] text-xs font-semibold rounded-[2px] transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </div>
  );
}
