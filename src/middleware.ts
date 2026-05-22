import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { localeToLowerCaseFromPathname } from './core/helpers';
import { config as appConfig } from './config';

export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    // A list of all locales that are supported
    locales: appConfig.translation.locales,
    // Used when no locale matches
    defaultLocale: appConfig.translation.defaultLocale,
  });
  const pathnameLowerCase = localeToLowerCaseFromPathname(request.nextUrl.pathname);

  request.nextUrl.pathname = pathnameLowerCase;
  const response = handleI18nRouting(request);

  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(en|fr)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!_next|_vercel|.*\\..*|!api).*)',
  ],
  unstable_allowDynamic: ['**/node_modules/lodash/_root.js'],
};
