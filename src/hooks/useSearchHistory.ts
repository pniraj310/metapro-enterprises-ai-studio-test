import { useState, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'metapro_search_history_v1';
const MAX_HISTORY_ITEMS = 8;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).slice(0, MAX_HISTORY_ITEMS);
        }
      }
    } catch (e) {
      console.warn('Failed to read search history from localStorage:', e);
    }
    return [];
  });

  const addQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save search history:', e);
      }
      return updated;
    });
  };

  const removeQuery = (queryToRemove: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item !== queryToRemove);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update search history:', e);
      }
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (e) {
      console.warn('Failed to clear search history:', e);
    }
  };

  return {
    history,
    addQuery,
    removeQuery,
    clearHistory,
  };
}
