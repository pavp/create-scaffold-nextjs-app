'use client';

import React from 'react';
import { Pagination as PaginationMui } from '@mui/material';

import styles from './styles.module.scss';

const { container } = styles;

export interface PaginationProps {
  totalPages: number;
  page: number;
  onChangePage: (value: number) => void;
}

const Pagination = ({ page, totalPages, onChangePage }: PaginationProps) => {
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onChangePage(value);
  };

  if (totalPages <= 1) return;

  return <PaginationMui className={container} count={totalPages} page={page} onChange={handlePageChange} />;
};

const MemoizedView = React.memo(Pagination);

export { MemoizedView as Pagination };
