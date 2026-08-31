'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event } from '@/types/event';
import { MOCK_EVENTS } from '@/data/mockEvents';

interface AdminAuthContextType {
  isAdmin: boolean;
  events: Event[];
  isLoginModalOpen: boolean;
  editingEvent: Event | null;
  isEditorOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  openEditorForEvent: (event?: Event) => void;
  closeEditor: () => void;
  saveEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  resetAllEvents: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ADMIN = 'grevix_is_admin';
const LOCAL_STORAGE_KEY_EVENTS = 'grevix_events_data';
const CORE_PASSCODE = 'grevix2026';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN);
      if (savedAdmin === 'true') {
        setIsAdmin(true);
      }

      const savedEvents = localStorage.getItem(LOCAL_STORAGE_KEY_EVENTS);
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  // Save events to localStorage whenever they change
  const persistEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_EVENTS, JSON.stringify(updatedEvents));
    } catch {
      // Storage error fallback
    }
  };

  const login = (password: string): boolean => {
    if (password.trim() === CORE_PASSCODE || password.trim().toLowerCase() === 'grevix') {
      setIsAdmin(true);
      localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN, 'true');
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ADMIN);
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
          label: '1 ? 4 Members',
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
    localStorage.removeItem(LOCAL_STORAGE_KEY_EVENTS);
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
