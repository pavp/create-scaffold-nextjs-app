'use client';

import { usePathname } from 'next/navigation';

import { removeFirstSegmentFromPathname } from '@/core/helpers';

export const useGetPathnameWithoutLocale = () => {
  const pathname = usePathname();
  const currentPathname = removeFirstSegmentFromPathname(pathname);

  return {
    pathname: currentPathname,
  };
};
