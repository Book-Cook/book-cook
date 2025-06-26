# MSW + Storybook Integration

This Storybook setup includes Mock Service Worker (MSW) integration for realistic API mocking in stories.

## How It Works

1. **MSW Worker**: `public/mockServiceWorker.js` intercepts browser network requests
2. **MSW Setup**: `.storybook/preview.ts` initializes MSW with `msw-storybook-addon` and your API handlers  
3. **Auto-initialization**: MSW starts automatically when Storybook loads via the addon
4. **Story-level control**: Each story can override handlers using parameters

## Usage in Stories

### Basic Usage (Uses Default Handlers)
```typescript
export const MyStory = {
  // Uses the default MSW handlers from src/mocks/handlers.ts
}
```

### Custom Handlers per Story
```typescript
import { createMockHandlers } from "../stories/mswDecorator";

export const MyStory = {
  parameters: {
    msw: {
      handlers: createMockHandlers.emptyCollections()
    }
  }
}
```

### Available Helper Functions

- `createMockHandlers.emptyCollections()` - Empty state
- `createMockHandlers.loadingState(delay)` - Loading with delay
- `createMockHandlers.apiErrors()` - API error responses
- `createMockHandlers.withData(collections, recentlyViewed)` - Custom data

### Custom Handlers
```typescript
import { http, HttpResponse } from 'msw';

export const MyStory = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/user/collections', () => {
          return HttpResponse.json([
            { _id: "recipe_001", title: "Custom Recipe" }
          ])
        })
      ]
    }
  }
}
```

## HomePage Stories

The `HomePage.real.stories.tsx` showcases all MSW capabilities:
- **Default**: Standard mock data from handlers
- **Empty State**: No recipes to display
- **Loading State**: Shows skeleton loading
- **Error State**: API failures handled gracefully
- **Custom Data**: Specific recipe collections

## Benefits

✅ **Realistic data**: API responses match production format  
✅ **Isolated testing**: Each story controls its own data  
✅ **Loading states**: Test skeleton UIs and async behavior  
✅ **Error handling**: Verify error boundary behavior  
✅ **No backend needed**: Stories work offline

## Troubleshooting

If MSW isn't working:
1. Check browser DevTools for service worker registration
2. Verify `mockServiceWorker.js` is accessible at `/mockServiceWorker.js`
3. Ensure stories use the `withMSW` decorator