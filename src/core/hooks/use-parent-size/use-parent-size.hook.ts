'use client';

import { RefObject, useCallback, useEffect, useState } from 'react';

type Dimension = {
  width: number | null;
  height: number | null;
};

export const useParentSize = (parentRef: RefObject<Element>): Dimension => {
  const [dimension, setDimension] = useState<Dimension>({
    width: null,
    height: null,
  });

  const handleResize = useCallback(() => {
    if (parentRef.current) {
      const { current } = parentRef;
      const { width, height } = current.getBoundingClientRect();

      setDimension({ width, height });
    }
  }, [parentRef]);

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return dimension;
};
