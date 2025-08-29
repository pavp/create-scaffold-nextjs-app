export const removeFirstSegmentFromPathname = (pathname: string) => {
  const segments = pathname.split('/');

  segments.splice(1, 1);

  return segments.join('/');
};
