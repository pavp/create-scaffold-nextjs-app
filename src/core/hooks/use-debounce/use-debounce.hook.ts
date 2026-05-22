'use client';

import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';

type DebouncedCallback = (...args: any[]) => void;

export const useDebounce = <T extends DebouncedCallback>(callback: T, delay: number) => {
  const ref = useRef<T | null>(null);

  // Update the ref whenever the callback changes
  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  // Create a debounced function
  const debouncedCallback = useMemo(() => {
    const func = (...args: Parameters<T>) => {
      ref.current?.(...args);
    };

    return debounce(func, delay);
  }, [delay]);

  // Cleanup the debounce on unmount
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
