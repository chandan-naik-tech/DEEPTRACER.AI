import React, { createContext, useState, useContext, useEffect } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  // Try to load from localStorage first
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('deep_tracer_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { console.error(e); }
    }
    // Pre-seed some mock sessions if nothing saved
    return [
      {
        id: 'demo-1234',
        target: 'C:\\Users\\Demo\\Dataset',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: 'demo_user'
      },
      {
        id: 'ext-4412',
        target: '\\\\SERVER\\shared_logs',
        status: 'Threats Found',
        date: 'Sep 21, 2026',
        owner: 'security_analyst'
      }
    ];
  });

  // Save to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem('deep_tracer_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session) => {
    setSessions(prev => [session, ...prev]);
  };

  const updateSessionStatus = (id, status) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const updateSession = (id, updates) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession, updateSessionStatus, updateSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
