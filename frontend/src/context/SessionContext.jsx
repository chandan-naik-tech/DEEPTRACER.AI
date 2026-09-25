import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  // Pre-seed some mock sessions
  const [sessions, setSessions] = useState([
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
  ]);

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
