export const createSharedPathnamesNavigation = jest.fn(() => {
  return {
    Link: jest.fn(),
    redirect: jest.fn(),
    usePathname: jest.fn(),
    useRouter: jest.fn(),
  };
});
