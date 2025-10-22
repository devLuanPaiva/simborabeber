'use client'
import { useCallback, useEffect, useState } from "react";

type FetchFunction<T> = () => Promise<T>;

export function useFetchData<T>(fetchFn: FetchFunction<T>) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, error, loading, refetch: fetchData };
}