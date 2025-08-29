'use client';

import { useEffect, useRef } from 'react';

export const useFirstRender = () => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) isFirstRender.current = false;
  }, []);

  return { isFirstRender: isFirstRender.current };
};
