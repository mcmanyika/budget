"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

interface UseDataFetchOptions<T> {
  fetcher: (userId: string) => Promise<T[]>;
  errorMessage: string;
}

export function useDataFetch<T>({ fetcher, errorMessage }: UseDataFetchOptions<T>) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (authLoading) return;

    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await fetcher(user.uid);
      setData(result);
    } catch (error) {
      console.error(errorMessage, error);
      toast.error(errorMessage, { id: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [user, authLoading, fetcher, errorMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, setData, loading, refetch: fetchData };
}
