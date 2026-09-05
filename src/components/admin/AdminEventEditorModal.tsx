'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Event, EventType, EventStatus, EventMode } from '@/types/event';
import { validateExternalUrl, sanitizeUrl } from '@/lib/security/urlSanitizer';

export function AdminEventEditorModal() {
  const { isEditorOpen, closeEditor, editingEvent, saveEvent, deleteEvent } = useAdminAuth();

  const [formData, setFormData] = useState<Event | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (editingEvent) {
      setFormData({ ...editingEvent });
      setUrlError(null);
    }
  }, [editingEvent]);

  if (!isEditorOpen || !formData) return null;

  const handleChange = (field: keyof Event, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    if (field === 'registrationUrl') {
      setUrlError(null);
    }
  };

  const handleTracksChange = (val: string) => {
    const arr = val.split(',').map((s) => s.trim()).filter(Boolean);
    handleChange('tracks', arr);
  };

  const handleSkillsChange = (val: string) => {
    const arr = val.split(',').map((s) => s.trim()).filter(Boolean);
    handleChange('skills', arr);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Validate registration URL against dangerous protocols
    if (formData.registrationUrl && formData.registrationUrl.trim()) {
      const check = validateExternalUrl(formData.registrationUrl);
      if (!check.isValid) {
        setUrlError(check.error || 'Invalid or unsafe URL format');
        return;
      }
      formData.registrationUrl = sanitizeUrl(formData.registrationUrl);
    }

    // Auto-generate slug if missing
    if (!formData.slug) {
      formData.slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    saveEvent(formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#060810]/80 backdrop-blur-sm p-4 font-mono overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={closeEditor} />

      <div className="relative w-full max-w-3xl bg-[#090D18] border border-[#1E2B45] rounded-[4px] shadow-2xl p-6 sm:p-8 space-y-6 z-10 my-8 max-h-[90vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#141C2E] pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-[#F1F5F9] uppercase tracking-wide">
              {editingEvent?.title ? `EDIT: ${editingEvent.title}` : 'CREATE NEW COMMUNITY EVENT'}
            </h3>
            <p className="text-[10px] text-[#64748B] mt-0.5">Update specifications, prizes, deadlines and links</p>
          </div>
          <button
            type="button"
            onClick={closeEditor}
            className="text-[#8092A8] hover:text-[#FFFFFF] text-sm transition-colors"
            aria-label="Close editor"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. GREViX Genesis Hack 2026"
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Event Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as EventType)}
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA] cursor-pointer"
              >
                <option value="hackathon">Hackathon (Flagship)</option>
                <option value="quiz">Quiz / Speed Contest</option>
                <option value="workshop">Workshop / Masterclass</option>
              </select>
            </div>
          </div>

          {/* Row 2: Tagline */}
          <div>
            <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
              Tagline (Short Summary)
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="One-line headline describing the event..."
              className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]"
            />
          </div>

          {/* Row 3: Description */}
          <div>
            <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
              Full Description & Overview
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detailed description of challenge, agenda, mentorship..."
              className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA] font-sans text-xs"
            />
          </div>

          {/* Row 4: Status, Mode, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as EventStatus)}
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA] cursor-pointer"
              >
                <option value="upcoming">Upcoming / Open</option>
                <option value="ongoing">Ongoing (Live Now)</option>
                <option value="completed">Completed / Concluded</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Mode
              </label>
              <select
                value={formData.mode}
                onChange={(e) => handleChange('mode', e.target.value as EventMode)}
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA] cursor-pointer"
              >
                <option value="online">Online</option>
                <option value="offline">Offline (In-Person)</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Venue / Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. GREViX Hub & Online"
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]"
              />
            </div>
          </div>

          {/* Row 5: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Event Start Date (ISO or readable)
              </label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                placeholder="e.g. 2026-10-16T09:00:00Z"
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Registration Deadline
              </label>
              <input
                type="text"
                value={formData.registrationDeadline}
                onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                placeholder="e.g. 2026-10-10T23:59:59Z"
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]"
              />
            </div>
          </div>

          {/* Row 6: Prize Pool & Registration Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Prize Pool / Perks
              </label>
              <input
                type="text"
                value={formData.prizePool.totalValue}
                onChange={(e) =>
                  handleChange('prizePool', { ...formData.prizePool, totalValue: e.target.value })
                }
                placeholder="e.g. ₹1,50,000 Cash + Certificates"
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Registration Link / Google Form URL
              </label>
              <input
                type="text"
                value={formData.registrationUrl}
                onChange={(e) => handleChange('registrationUrl', e.target.value)}
                placeholder="e.g. https://lnkd.in/gXffB4pT"
                className={`w-full bg-[#060810] border ${
                  urlError ? 'border-[#EF4444]' : 'border-[#1E293B]'
                } text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]`}
              />
              {urlError && (
                <p className="text-[#EF4444] text-[10px] mt-1 font-mono">{urlError}</p>
              )}
            </div>
          </div>

          {/* Row 7: Tracks & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Tracks (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tracks.join(', ')}
                onChange={(e) => handleTracksChange(e.target.value)}
                placeholder="AI/ML, Systems, Web3, DSA"
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#8092A8] uppercase tracking-wider mb-1">
                Skills (Comma separated)
              </label>
              <input
                type="text"
                value={formData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                placeholder="Python, Rust, Next.js, C++"
                className="w-full bg-[#060810] border border-[#1E293B] text-[#F1F5F9] px-3 py-2 rounded-[2px] focus:outline-none focus:border-[#60A5FA]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#141C2E] flex items-center justify-between gap-3">
            {editingEvent && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this event?')) {
                    deleteEvent(formData.id);
                  }
                }}
                className="py-2 px-3 text-[#EF4444] hover:bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-[2px] transition-colors"
              >
                Delete Event
              </button>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={closeEditor}
                className="py-2 px-4 text-[#8092A8] hover:text-[#FFFFFF] border border-[#1E293B] rounded-[2px] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-6 bg-[#F1F5F9] hover:bg-[#FFFFFF] text-[#060810] font-bold rounded-[2px] transition-colors"
              >
                Save & Publish Event ↗
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
