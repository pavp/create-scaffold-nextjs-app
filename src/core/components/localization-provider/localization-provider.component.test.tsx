import { render, screen } from '@test/utils';
import dayjs from 'dayjs';
import { useLocale } from 'next-intl';

import { LocalizationProvider } from './localization-provider.component';

// Mock next-intl useLocale hook
jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}));

// Mock MUI LocalizationProvider
jest.mock('@mui/x-date-pickers-pro', () => ({
  LocalizationProvider: ({ children, adapterLocale }: { children: React.ReactNode; adapterLocale: string }) => (
    <div data-adapter-locale={adapterLocale} data-testid="mui-localization-provider">
      {children}
    </div>
  ),
}));

// Mock AdapterDayjs
jest.mock('@mui/x-date-pickers-pro/AdapterDayjs', () => ({
  AdapterDayjs: jest.fn(),
}));

// Mock dayjs
jest.mock('dayjs', () => ({
  locale: jest.fn(),
}));

const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;
const mockDayjsLocale = dayjs.locale as jest.MockedFunction<typeof dayjs.locale>;

describe('LocalizationProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocale.mockReturnValue('en');
  });

  it('should render children with MUI LocalizationProvider', () => {
    const testChild = <div data-testid="test-child">Test Content</div>;

    render(<LocalizationProvider>{testChild}</LocalizationProvider>);

    expect(screen.getByTestId('mui-localization-provider')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should set dayjs locale based on useLocale hook', () => {
    mockUseLocale.mockReturnValue('es');

    render(
      <LocalizationProvider>
        <div>Content</div>
      </LocalizationProvider>,
    );

    expect(mockDayjsLocale).toHaveBeenCalledWith('es');
  });

  it('should pass correct adapterLocale to MUI provider', () => {
    mockUseLocale.mockReturnValue('fr');

    render(
      <LocalizationProvider>
        <div>Content</div>
      </LocalizationProvider>,
    );

    const provider = screen.getByTestId('mui-localization-provider');

    expect(provider).toHaveAttribute('data-adapter-locale', 'fr');
  });

  it('should handle different locales correctly', () => {
    const testCases = ['en', 'es', 'fr', 'pt', 'de', 'nl', 'sv'];

    testCases.forEach((locale) => {
      mockUseLocale.mockReturnValue(locale);

      const { unmount } = render(
        <LocalizationProvider>
          <div data-testid={`content-${locale}`}>Content {locale}</div>
        </LocalizationProvider>,
      );

      expect(mockDayjsLocale).toHaveBeenCalledWith(locale);

      const provider = screen.getByTestId('mui-localization-provider');

      expect(provider).toHaveAttribute('data-adapter-locale', locale);
      expect(screen.getByTestId(`content-${locale}`)).toBeInTheDocument();

      // Clean up for next iteration
      unmount();
      jest.clearAllMocks();
    });
  });

  it('should handle multiple children', () => {
    render(
      <LocalizationProvider>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </LocalizationProvider>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });
});
