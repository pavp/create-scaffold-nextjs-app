import { renderWithProviders, screen } from '@test/utils';

import { DataSourceSwitcher } from './data-source-switcher.component';

describe('DataSourceSwitcher', () => {
  const mockOnSourceChange = jest.fn();

  const defaultProps = {
    currentSource: 'http' as const,
    onSourceChange: mockOnSourceChange,
    sourceInfo: {
      name: 'HTTP API',
      description: 'Remote HTTP API',
      icon: '🌐',
      online: true,
    },
    isLoading: false,
  };

  beforeEach(() => {
    mockOnSourceChange.mockClear();
  });

  it('should render data source information', () => {
    renderWithProviders(<DataSourceSwitcher {...defaultProps} />);

    expect(screen.getByText('Data Source: 🌐 HTTP API')).toBeInTheDocument();
    expect(screen.getByText('Remote HTTP API')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('should show offline status when source is offline', () => {
    const offlineProps = {
      ...defaultProps,
      sourceInfo: {
        ...defaultProps.sourceInfo,
        online: false,
      },
    };

    renderWithProviders(<DataSourceSwitcher {...offlineProps} />);

    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('should show loading state when switching', () => {
    const loadingProps = {
      ...defaultProps,
      isLoading: true,
    };

    renderWithProviders(<DataSourceSwitcher {...loadingProps} />);

    expect(screen.getByText('Switching...')).toBeInTheDocument();
  });

  it('should have correct display name', () => {
    expect(DataSourceSwitcher.displayName).toBe('DataSourceSwitcher');
  });

  it('should render selector with correct options', () => {
    renderWithProviders(<DataSourceSwitcher {...defaultProps} />);

    // The selector should be present with the correct test id
    const selector = screen.getByTestId('selector-data-source-selector-testid');

    expect(selector).toBeInTheDocument();
  });

  it('should render Settings icon', () => {
    renderWithProviders(<DataSourceSwitcher {...defaultProps} />);

    // Check for svg icon (Settings icon)
    const settingsIcon = document.querySelector('svg');

    expect(settingsIcon).toBeInTheDocument();
  });

  it('should render with localStorage source', () => {
    const localStorageProps = {
      ...defaultProps,
      currentSource: 'localStorage' as const,
      sourceInfo: {
        name: 'Local Storage',
        description: 'Browser localStorage',
        icon: '💾',
        online: false,
      },
    };

    renderWithProviders(<DataSourceSwitcher {...localStorageProps} />);

    expect(screen.getByText('Data Source: 💾 Local Storage')).toBeInTheDocument();
    expect(screen.getByText('Browser localStorage')).toBeInTheDocument();
  });
});
