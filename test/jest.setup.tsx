import '@testing-library/jest-dom';
import 'whatwg-fetch';

jest.mock('@mui/x-license', () => ({
  useLicenseVerifier: () => 'Valid',
  Watermark: () => null,
}));

jest.mock('@/store/hooks', () => ({
  ...jest.requireActual('@/store/hooks'),
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('@/core/lib', () => ({
  Analytics: {
    init: jest.fn(),
    identifyUser: jest.fn(),
    reset: jest.fn(),
    trackEvent: jest.fn(),
  },
}));
