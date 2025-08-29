'use client';

import { forwardRef } from 'react';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';
import { default as NextLink } from 'next/link';

type LinkProps = Omit<MuiLinkProps, 'component'>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, href = '', ...rest }, ref) => {
  return (
    <MuiLink ref={ref} component={NextLink} href={href} {...rest}>
      {children}
    </MuiLink>
  );
});

Link.displayName = 'Link';
