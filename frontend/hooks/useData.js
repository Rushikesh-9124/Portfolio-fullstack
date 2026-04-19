'use client';
import { useState, useEffect, useCallback } from 'react';

export function useData(fetchFn, deps = [], fallbackData = null) {
  // ✅ Start with fallback instead of null
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchFn();

      // ✅ Handle Strapi / normal API safely
      const apiData = res?.data?.data || res?.data || res;

      // ✅ Replace fallback with API data
      setData(apiData);

    } catch (err) {
      console.error('Using fallback data:', err);
      setError(err?.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}