import { useCallback, useEffect, useState } from 'react';

export const useAsync = <T>(
  callback: (...args: any[]) => Promise<any>,
  dependencies: any[] = [],
  initialLoad = true,
) => {
  const [loading, setLoading] = useState(initialLoad ? true : false);
  const [error, setError] = useState<string>();
  const [value, setValue] = useState<T>();

  const callbackMemoized = useCallback(
    async (options = [] as any[]) => {
      setLoading(true);
      try {
        const data = await callback(...options);
        setValue(data.data);
        setLoading(false);
        return data.data;
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    },
    [...dependencies],
  );

  useEffect(() => {
    if (initialLoad) {
      callbackMemoized();
    }
  }, [initialLoad]);

  return { loading, error, value, callbackMemoized };
};
