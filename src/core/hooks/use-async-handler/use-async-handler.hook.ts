'use client';

import { useCallback, useState } from 'react';

interface UseAsyncHandlerState<T> {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string[];
  results: T[];
}

/**
 * Custom hook to handle asynchronous operations with loading, success, and error states.
 *
 * @template T - The type of the results expected from the promises.
 *
 * @returns {object} - An object containing the current state and a function to execute promises.
 *
 * @example
 * const { state, executePromises } = useAsyncHandler<MyType>();
 *
 * useEffect(() => {
 *   const promises = [fetchData1(), fetchData2()];
 *   executePromises(promises);
 * }, []);
 *
 * // state.isLoading - boolean indicating if the promises are being executed
 * // state.isSuccess - boolean indicating if all promises were successful
 * // state.isError - boolean indicating if any promise failed
 * // state.error - array of error messages if any promise failed
 * // state.results - array of results from successful promises
 */
export const useAsyncHandler = <T>() => {
  const [state, setState] = useState<UseAsyncHandlerState<T>>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: [],
    results: [],
  });

  const executePromises = useCallback(async (promises: Array<Promise<T>>) => {
    setState({ isLoading: true, isSuccess: false, isError: false, error: [], results: [] });

    try {
      const results = await Promise.all(promises.map((p) => p.catch((err) => err)));
      const hasError = results.some((result) => result instanceof Error);

      setState({
        isLoading: false,
        isSuccess: !hasError,
        isError: hasError,
        error: results
          .filter((result) => result instanceof Error)
          .map((err) => (err instanceof Error ? err.message : JSON.stringify(err))),
        results: results.filter((result) => !(result instanceof Error)) as T[],
      });
    } catch (err) {
      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: [err instanceof Error ? err.message : JSON.stringify(err)],
        results: [],
      });
    }
  }, []);

  return { ...state, executePromises };
};
