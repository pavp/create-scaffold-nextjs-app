import { act, renderHookWithProviders } from '@test/utils';

import { useDataSource } from './use-data-source.hook';

describe('useDataSource', () => {
  it('should initialize with provided data source', () => {
    const { result } = renderHookWithProviders(() => useDataSource('localStorage'));

    expect(result.current.dataSource).toBe('localStorage');
  });

  it('should initialize with http as default', () => {
    const { result } = renderHookWithProviders(() => useDataSource());

    expect(result.current.dataSource).toBe('http');
  });

  it('should switch data source when switchDataSource is called', () => {
    const { result } = renderHookWithProviders(() => useDataSource('http'));

    expect(result.current.dataSource).toBe('http');

    act(() => {
      result.current.switchDataSource('localStorage');
    });

    expect(result.current.dataSource).toBe('localStorage');
  });

  it('should return correct source info for http', () => {
    const { result } = renderHookWithProviders(() => useDataSource('http'));

    const sourceInfo = result.current.getDataSourceInfo();

    expect(sourceInfo.type).toBe('http');
    expect(sourceInfo.name).toBe('HTTP API Gateway');
    expect(sourceInfo.capabilities.offline).toBe(false);
    expect(sourceInfo.capabilities.realtime).toBe(true);
    expect(sourceInfo.capabilities.persistence).toBe(true);
  });

  it('should return correct source info for localStorage', () => {
    const { result } = renderHookWithProviders(() => useDataSource('localStorage'));

    const sourceInfo = result.current.getDataSourceInfo();

    expect(sourceInfo.type).toBe('localStorage');
    expect(sourceInfo.name).toBe('Local Storage Gateway');
    expect(sourceInfo.capabilities.offline).toBe(true);
    expect(sourceInfo.capabilities.realtime).toBe(false);
    expect(sourceInfo.capabilities.persistence).toBe(true);
  });

  it('should maintain state consistency across multiple calls', () => {
    const { result } = renderHookWithProviders(() => useDataSource('http'));

    // Switch to localStorage
    act(() => {
      result.current.switchDataSource('localStorage');
    });

    expect(result.current.dataSource).toBe('localStorage');

    // Get source info should match current data source
    const sourceInfo = result.current.getDataSourceInfo();

    expect(sourceInfo.type).toBe('localStorage');

    // Switch back to http
    act(() => {
      result.current.switchDataSource('http');
    });

    expect(result.current.dataSource).toBe('http');

    const httpSourceInfo = result.current.getDataSourceInfo();

    expect(httpSourceInfo.type).toBe('http');
  });

  it('should handle multiple rapid switches', () => {
    const { result } = renderHookWithProviders(() => useDataSource('http'));

    act(() => {
      result.current.switchDataSource('localStorage');
      result.current.switchDataSource('http');
      result.current.switchDataSource('localStorage');
    });

    expect(result.current.dataSource).toBe('localStorage');
  });

  it('should provide stable function references', () => {
    const { result, rerender } = renderHookWithProviders(() => useDataSource('http'));

    const initialSwitchDataSource = result.current.switchDataSource;
    const initialGetDataSourceInfo = result.current.getDataSourceInfo;

    rerender();

    expect(result.current.switchDataSource).toBe(initialSwitchDataSource);
    expect(result.current.getDataSourceInfo).toBe(initialGetDataSourceInfo);
  });

  it('should work with different initial values', () => {
    const { result: httpResult } = renderHookWithProviders(() => useDataSource('http'));
    const { result: localStorageResult } = renderHookWithProviders(() => useDataSource('localStorage'));

    expect(httpResult.current.dataSource).toBe('http');
    expect(localStorageResult.current.dataSource).toBe('localStorage');

    expect(httpResult.current.getDataSourceInfo().type).toBe('http');
    expect(localStorageResult.current.getDataSourceInfo().type).toBe('localStorage');
  });

  it('should not switch when trying to set the same data source', () => {
    const { result, queryClient } = renderHookWithProviders(() => useDataSource('http'));

    // Spy on invalidateQueries to ensure it's not called unnecessarily
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    act(() => {
      result.current.switchDataSource('http'); // Same as current
    });

    expect(result.current.dataSource).toBe('http');
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();

    // Clean up
    invalidateQueriesSpy.mockRestore();
  });

  it('should invalidate queries when switching data sources', () => {
    const { result, queryClient } = renderHookWithProviders(() => useDataSource('http'));

    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    act(() => {
      result.current.switchDataSource('localStorage'); // Different from current
    });

    expect(result.current.dataSource).toBe('localStorage');
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: [['todos', 'list', 'localStorage']] });

    // Clean up
    invalidateQueriesSpy.mockRestore();
  });

  it('should handle unknown data source types gracefully', () => {
    // Force an unknown data source by directly modifying the state
    const { result } = renderHookWithProviders(() => useDataSource('http'));

    // First switch to localStorage to get into switch logic
    act(() => {
      result.current.switchDataSource('localStorage');
    });

    // Now manually set state to unknown value to test default case
    // We need to simulate this by modifying the hook's internal state
    // Since we can't access setState directly, we'll use a different approach

    // Create a hook with an invalid initial source to test default case
    const TestHook = () => {
      const hook = useDataSource('invalidSource' as any);

      return hook;
    };

    const { result: unknownResult } = renderHookWithProviders(() => TestHook());

    const sourceInfo = unknownResult.current.getDataSourceInfo();

    expect(sourceInfo.type).toBe('unknown');
    expect(sourceInfo.name).toBe('Unknown');
    expect(sourceInfo.description).toBe('Unknown data source');
    expect(sourceInfo.icon).toBe('❓');
    expect(sourceInfo.online).toBe(false);
    expect(sourceInfo.capabilities).toEqual({
      offline: false,
      realtime: false,
      persistence: false,
    });
  });

  it('should provide complete source info structure for all data source types', () => {
    const { result } = renderHookWithProviders(() => useDataSource('http'));

    // Test HTTP source info completeness
    let sourceInfo = result.current.getDataSourceInfo();

    expect(sourceInfo).toHaveProperty('type', 'http');
    expect(sourceInfo).toHaveProperty('name', 'HTTP API Gateway');
    expect(sourceInfo).toHaveProperty('description', 'Remote server data');
    expect(sourceInfo).toHaveProperty('icon', '🌐');
    expect(sourceInfo).toHaveProperty('online', true);
    expect(sourceInfo).toHaveProperty('capabilities');
    expect(sourceInfo.capabilities).toHaveProperty('offline', false);
    expect(sourceInfo.capabilities).toHaveProperty('realtime', true);
    expect(sourceInfo.capabilities).toHaveProperty('persistence', true);

    // Switch to localStorage and test completeness
    act(() => {
      result.current.switchDataSource('localStorage');
    });

    sourceInfo = result.current.getDataSourceInfo();
    expect(sourceInfo).toHaveProperty('type', 'localStorage');
    expect(sourceInfo).toHaveProperty('name', 'Local Storage Gateway');
    expect(sourceInfo).toHaveProperty('description', 'Browser local storage');
    expect(sourceInfo).toHaveProperty('icon', '💾');
    expect(sourceInfo).toHaveProperty('online', false);
    expect(sourceInfo).toHaveProperty('capabilities');
    expect(sourceInfo.capabilities).toHaveProperty('offline', true);
    expect(sourceInfo.capabilities).toHaveProperty('realtime', false);
    expect(sourceInfo.capabilities).toHaveProperty('persistence', true);
  });
});
