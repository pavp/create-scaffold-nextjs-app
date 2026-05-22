import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

import { config } from '@/config';

export const routing = defineRouting({
  locales: config.translation.locales, // A list of all locales that are supported
  defaultLocale: config.translation.defaultLocale, // Used when no locale matches
});

export const { Link, getPathname, redirect, usePathname, useRouter } = createNavigation(routing);
