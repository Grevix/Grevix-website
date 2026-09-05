'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export function AdminLoginModal() {
  const { isLoginModalOpen, closeLoginModal, login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const result = await login(password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Incorrect passcode. Access denied.');
    } else {
      setPassword('');
      setErrorMessage(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060810]/80 backdrop-blur-sm p-4 font-mono"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={closeLoginModal} />

      <div className="relative w-full max-w-md bg-[#090D18] border border-[#1E2B45] rounded-[4px] shadow-2xl p-6 space-y-6 z-10">
        {/* Corner ticks */}
        <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t-2 border-l-2 border-[#60A5FA]"></div>
        <div className="absolute -top-[1px] -right-[1px] w-2 h-2 border-t-2 border-r-2 border-[#60A5FA]"></div>
        <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 border-b-2 border-l-2 border-[#60A5FA]"></div>
        <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b-2 border-r-2 border-[#60A5FA]"></div>

        <div className="flex items-center justify-between border-b border-[#141C2E] pb-3">
          <div>
            <h3 className="font-display font-bold text-base text-[#F1F5F9] uppercase tracking-wide">
              GREViX CORE ACCESS
            </h3>
            <p className="text-[10px] text-[#64748B] mt-0.5">Admin & Core Member Editing Controls</p>
          </div>
          <button
            type="button"
            onClick={closeLoginModal}
            className="text-[#8092A8] hover:text-[#FFFFFF] text-xs transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1.5">
              Core Passcode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(null);
              }}
              placeholder="Enter core team passcode..."
              autoFocus
              disabled={isLoading}
              className="w-full bg-[#060810] border border-[#1E293B] focus:border-[#60A5FA] text-[#F1F5F9] px-3 py-2.5 rounded-[2px] focus:outline-none disabled:opacity-50"
            />
            {errorMessage && (
              <p className="text-[#EF4444] text-[10px] mt-1.5 font-mono">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={closeLoginModal}
              disabled={isLoading}
              className="flex-1 py-2 text-[#8092A8] hover:text-[#FFFFFF] border border-[#1E293B] rounded-[2px] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="flex-1 py-2 bg-[#F1F5F9] hover:bg-[#FFFFFF] text-[#060810] font-bold rounded-[2px] transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {isLoading ? 'Verifying...' : 'Unlock Access ↗'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
