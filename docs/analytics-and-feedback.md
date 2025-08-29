# Analytics and Feedback Systems

This project includes **template-friendly** analytics and feedback systems that can be easily customized for different projects without breaking template initialization.

## Overview

The analytics and feedback systems are designed to:

- ✅ Work seamlessly with template generation
- ✅ Support multiple analytics providers (MixPanel, etc.)
- ✅ Support multiple feedback providers (Screeb, etc.)
- ✅ Provide clean initialization hooks
- ✅ Enable/disable based on configuration
- ✅ Follow Clean Architecture patterns

## Analytics System

### Configuration

Analytics are configured through environment variables:

```env
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token_here
```

### Initialization

```typescript
// App initialization
import { useInitAnalytics } from '@/hooks/use-init-analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Automatically initializes analytics if configured
  useInitAnalytics();

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Usage

```typescript
import { analytics } from '@/core/lib/analytics';

// Track events
analytics.track('user_signup', {
  method: 'email',
  source: 'header_cta',
});

// Track page views (automatic with Next.js)
analytics.page('/dashboard');

// Identify users
analytics.identify('user-123', {
  email: 'user@example.com',
  plan: 'premium',
});
```

### Store Integration

The analytics system uses Zustand for state management:

```typescript
import { useAnalyticsInitializedSelector } from '@/core/lib/analytics';

const MyComponent = () => {
  const { isInitialized } = useAnalyticsInitializedSelector();

  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return <DashboardContent />;
};
```

## Feedback System

### Configuration

Feedback is configured through environment variables:

```env
NEXT_PUBLIC_SCREEB_WEBSITE_ID=your_screeb_website_id_here
```

### Initialization

```typescript
// App initialization
import { useInitFeedback } from '@/hooks/use-init-feedback';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Automatically initializes feedback if configured
  useInitFeedback();

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Usage

```typescript
import { feedback } from '@/core/lib/feedback';

// Initialize feedback system
feedback.init('your-website-id');

// Track user identity
feedback.identify('user-123', {
  email: 'user@example.com',
  userType: 'premium',
});

// Track events
feedback.track('feature_used', {
  feature: 'todo_creation',
  context: 'dashboard',
});
```

### Store Integration

```typescript
import { useFeedbackInitializedSelector } from '@/core/lib/feedback';

const MyComponent = () => {
  const { isInitialized } = useFeedbackInitializedSelector();

  // Component logic based on feedback initialization
  return (
    <div>
      {isInitialized && <FeedbackWidget />}
    </div>
  );
};
```

## Template-Friendly Design

### Environment-Based Activation

Both systems only activate when environment variables are present:

```typescript
// Analytics only runs if NEXT_PUBLIC_MIXPANEL_TOKEN exists
// Feedback only runs if NEXT_PUBLIC_SCREEB_WEBSITE_ID exists
```

### Clean Defaults

New projects get clean, working defaults:

```env
# .env.example
NEXT_PUBLIC_MIXPANEL_TOKEN=
NEXT_PUBLIC_SCREEB_WEBSITE_ID=
```

### No Breaking Changes

Projects can be created without any analytics/feedback configuration and will work perfectly.

## Architecture

### Store Structure

```typescript
// Analytics Store
interface AnalyticsStore {
  isInitialized: boolean;
  actions: {
    initialize: () => void;
    setInitialized: (initialized: boolean) => void;
  };
}

// Feedback Store
interface FeedbackStore {
  isInitialized: boolean;
  actions: {
    initialize: () => void;
    setInitialized: (initialized: boolean) => void;
  };
}
```

### Initialization Hooks

```typescript
// useInitAnalytics.hook.ts
export const useInitAnalytics = () => {
  useEffect(() => {
    if (config.mixpanelToken) {
      analytics.init(config.mixpanelToken);
      analyticsActions.setInitialized(true);
    }
  }, []);
};

// useInitFeedback.hook.ts
export const useInitFeedback = () => {
  useEffect(() => {
    if (config.screebWebsiteId) {
      feedback.init(config.screebWebsiteId);
      feedbackActions.setInitialized(true);
    }
  }, []);
};
```

## Testing

### Mock Implementation

```typescript
// test/__mocks__/mixpanel-browser.js
export default {
  init: jest.fn(),
  track: jest.fn(),
  identify: jest.fn(),
  page: jest.fn(),
};

// test/__mocks__/@screeb/sdk-browser.js
export const init = jest.fn();
export const track = jest.fn();
export const identify = jest.fn();
```

### Test Examples

```typescript
import { renderHookWithProviders } from '@test/utils';
import { useInitAnalytics } from './use-init-analytics.hook';

describe('useInitAnalytics', () => {
  it('should initialize analytics when token is present', () => {
    // Mock config
    jest.spyOn(config, 'mixpanelToken', 'get').mockReturnValue('test-token');

    renderHookWithProviders(() => useInitAnalytics());

    expect(analytics.init).toHaveBeenCalledWith('test-token');
  });

  it('should not initialize when token is empty', () => {
    jest.spyOn(config, 'mixpanelToken', 'get').mockReturnValue('');

    renderHookWithProviders(() => useInitAnalytics());

    expect(analytics.init).not.toHaveBeenCalled();
  });
});
```

## Benefits

### For Template Users

- **Zero configuration** required for basic functionality
- **Easy to customize** with their own analytics/feedback providers
- **No vendor lock-in** - can easily switch providers

### For Development

- **Clean Architecture** - follows established patterns
- **Testable** - comprehensive test coverage
- **Type Safe** - full TypeScript support
- **Maintainable** - clear separation of concerns

## Adding New Providers

### Analytics Provider

1. Create provider interface:

```typescript
interface AnalyticsProvider {
  init(token: string): void;
  track(event: string, properties?: Record<string, any>): void;
  identify(userId: string, properties?: Record<string, any>): void;
  page(path: string): void;
}
```

2. Implement provider:

```typescript
class GoogleAnalyticsProvider implements AnalyticsProvider {
  init(token: string) {
    // Initialize GA
  }

  track(event: string, properties?: Record<string, any>) {
    // Track GA event
  }

  // ... other methods
}
```

3. Update configuration:

```typescript
const provider = config.analyticsProvider === 'ga' ? new GoogleAnalyticsProvider() : new MixPanelProvider();
```

### Feedback Provider

Follow the same pattern for feedback providers.

This system provides a solid foundation for analytics and feedback that grows with your project needs while maintaining template compatibility.
