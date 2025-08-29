import { act, renderHook } from '@testing-library/react';

import { usePopover } from './use-popover.hook';

describe('usePopover', () => {
  it('should have null anchor initially', () => {
    const { result } = renderHook(() => usePopover());

    expect(result.current.anchorEl).toBeNull();
  });

  it('should set anchor on openPopover and clear on closePopover', () => {
    const { result } = renderHook(() => usePopover());
    const button = document.createElement('button');
    // Simulate click event with currentTarget

    act(() => {
      result.current.openPopover({ currentTarget: button } as React.MouseEvent<HTMLButtonElement>);
    });
    expect(result.current.anchorEl).toBe(button);

    act(() => {
      result.current.closePopover();
    });
    expect(result.current.anchorEl).toBeNull();
  });
});
