'use client';

import { useState } from 'react';

export const usePagination = (defaultPage: number = 1) => {
  const [page, setPage] = useState<number>(defaultPage);

  return {
    page,
    onChangePage: setPage,
  };
};
