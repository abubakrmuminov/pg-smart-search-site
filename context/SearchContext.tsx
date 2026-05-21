'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type SimulatorState = 'idle' | 'typing' | 'executing' | 'complete_fts' | 'complete_trigram' | 'aborted';

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  state: SimulatorState;
  setState: (s: SimulatorState) => void;
  ftsLatency: number;
  setFtsLatency: (l: number) => void;
  forceFail: boolean;
  setForceFail: (f: boolean) => void;
  triggerSearch: () => void;
  lastQueryTime: number;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SimulatorState>('idle');
  const [ftsLatency, setFtsLatency] = useState(120);
  const [forceFail, setForceFail] = useState(false);
  const [lastQueryTime, setLastQueryTime] = useState(0);

  const triggerSearch = useCallback(() => {
    setLastQueryTime(Date.now());
    setState('executing');
    const duration = forceFail ? ftsLatency * 0.5 : ftsLatency;
    setTimeout(() => {
      setState(forceFail ? 'aborted' : 'complete_fts');
      setTimeout(() => setState('idle'), 1500);
    }, duration + 100);
  }, [forceFail, ftsLatency]);

  return (
    <SearchContext.Provider value={{
      query, setQuery,
      state, setState,
      ftsLatency, setFtsLatency,
      forceFail, setForceFail,
      triggerSearch,
      lastQueryTime,
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
};
