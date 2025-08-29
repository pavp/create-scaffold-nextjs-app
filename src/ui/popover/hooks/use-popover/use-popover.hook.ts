'use client';

import React, { useCallback, useState } from 'react';

export const usePopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closePopover = () => {
    setAnchorEl(null);
  };

  return { anchorEl, openPopover, closePopover };
};
