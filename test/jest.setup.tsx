import '@testing-library/jest-dom';
import 'whatwg-fetch';

jest.mock('@mui/x-license', () => ({
  useLicenseVerifier: () => 'Valid',
  Watermark: () => null,
  LicenseInfo: {
    setLicenseKey: jest.fn(),
  },
}));

jest.mock('@/core/lib/analytics', () => ({
  default: {
    init: jest.fn(),
    identifyUser: jest.fn(),
    reset: jest.fn(),
    trackEvent: jest.fn(),
  },
}));

jest.mock('@/core/lib/feedback/feedback', () => ({
  default: {
    init: jest.fn(),
    close: jest.fn(),
    reset: jest.fn(),
    isInitialized: jest.fn(),
    isLoaded: jest.fn(),
  },
}));

jest.mock('@/api/http-client', () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock UI hooks globally
jest.mock('@/ui/dialog/hooks', () => ({
  useShowDialog: jest.fn(() => ({
    showDialog: jest.fn(),
  })),
}));

jest.mock('@/ui/toast/hooks', () => ({
  useShowToast: jest.fn(() => ({
    showToast: jest.fn(),
  })),
}));

jest.mock('@/ui/pagination/hooks', () => ({
  usePagination: jest.fn(() => ({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    goToPage: jest.fn(),
    goToNextPage: jest.fn(),
    goToPreviousPage: jest.fn(),
    isFirstPage: true,
    isLastPage: true,
  })),
}));
