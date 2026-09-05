'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Event } from '@/types/event';
import { MOCK_EVENTS } from '@/data/mockEvents';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AdminAuthContextType {
  isAdmin: boolean;
  events: Event[];
  isLoginModalOpen: boolean;
  editingEvent: Event | null;
  isEditorOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  openEditorForEvent: (event?: Event) => void;
  closeEditor: () => void;
  saveEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  resetAllEvents: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_EVENTS = 'grevix_events_data';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Verify server-side session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkServerSession() {
      try {
        const res = await fetch('/api/admin/auth', { method: 'GET', credentials: 'same-origin' });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (isMounted && typeof data.isAdmin === 'boolean') {
            setIsAdmin(data.isAdmin);
          }
        }
      } catch {
        // Network failure; keep default unauthenticated state
      }
    }

    checkServerSession();

    // Load persisted community events from localStorage
    try {
      const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTS);
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
        }
      }
    } catch {
      // Malformed storage fallback
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Save events to localStorage whenever modified
  const persistEvents = useCallback((updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(updatedEvents));
    } catch {
      // Storage quota or restriction fallback
    }
  }, []);

  const login = async (password: string): Promise<LoginResult> => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setIsAdmin(true);
        setIsLoginModalOpen(false);
        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Authentication failed. Please verify passcode.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Connection to server failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
    } catch {
      // Ignore network errors on logout
    }
    setIsAdmin(false);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openEditorForEvent = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
    } else {
      // New Event template
      setEditingEvent({
        id: `evt-${Date.now().toString().slice(-4)}`,
        slug: `grevix-event-${Date.now().toString().slice(-4)}`,
        title: '',
        tagline: '',
        description: '',
        type: 'hackathon',
        status: 'upcoming',
        mode: 'online',
        location: 'Online',
        organizer: {
          name: 'GREViX Core Team',
          slug: 'grevix-core',
        },
        registrationUrl: '',
        sourceType: 'verified_admin',
        lastSyncedAt: new Date().toISOString(),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        registrationDeadline: new Date(Date.now() + 86400000).toISOString(),
        prizePool: {
          totalValue: '',
          currency: 'INR',
        },
        tracks: [],
        skills: [],
        eligibility: 'Open to all students',
        teamSize: {
          min: 1,
          max: 4,
          label: '1 – 4 Members',
        },
        entryFee: 'Free',
      });
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingEvent(null);
  };

  const saveEvent = (updatedEvent: Event) => {
    const existingIndex = events.findIndex((e) => e.id === updatedEvent.id);
    let newEvents: Event[];
    if (existingIndex >= 0) {
      newEvents = [...events];
      newEvents[existingIndex] = updatedEvent;
    } else {
      newEvents = [updatedEvent, ...events];
    }
    persistEvents(newEvents);
    closeEditor();
  };

  const deleteEvent = (eventId: string) => {
    const newEvents = events.filter((e) => e.id !== eventId);
    persistEvents(newEvents);
    closeEditor();
  };

  const resetAllEvents = () => {
    persistEvents(MOCK_EVENTS);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_EVENTS);
    } catch {
      // Fallback
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdmin,
        events,
        isLoginModalOpen,
        editingEvent,
        isEditorOpen,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        openEditorForEvent,
        closeEditor,
        saveEvent,
        deleteEvent,
        resetAllEvents,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
