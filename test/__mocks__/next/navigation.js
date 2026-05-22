export const useRouter = jest.fn().mockReturnValue({
  prefetch: () => jest.fn(),
  replace: jest.fn(),
  push: jest.fn(),
});

export const redirect = jest.fn();

export const useSearchParams = jest.fn();

export const usePathname = jest.fn().mockReturnValue({
  endsWith: jest.fn(),
});
