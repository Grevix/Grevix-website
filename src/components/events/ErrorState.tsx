import React from 'react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  errorMsg?: string;
  onRetry?: () => void;
}

export function ErrorState({ errorMsg = 'Failed to load opportunity feed.', onRetry }: ErrorStateProps) {
  return (
    <div className="bg-[#E24C4C]/5 border border-[#E24C4C]/30 rounded-[3px] p-4 my-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-[#E24C4C]">
      <div className="flex items-center gap-2">
        <span>[!] ERROR:</span>
        <span className="text-[#9090A0]">{errorMsg}</span>
      </div>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-[#E24C4C]/20 hover:bg-[#E24C4C]/30 text-[#D0F0F0] rounded-[2px] transition-colors"
        >
          [ RETRY ]
        </button>
      ) : (
        <Button asLink href="/events" variant="secondary" size="sm">
          RELOAD ARCHIVE
        </Button>
      )}
    </div>
  );
}
