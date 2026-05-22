export const localeToLowerCaseFromPathname = (pathname: string) => {
  const [, locale, ...segments] = pathname.split('/');
  const localeLowerCase = locale.toLowerCase();

  return `/${localeLowerCase}/${segments.join('/')}`;
};
