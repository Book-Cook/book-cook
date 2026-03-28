# Storybook API Mocking

This Storybook setup uses custom fetch mocking for realistic API simulation in stories.

## How It Works

1. **Fetch Interception**: `src/stories/mockApi.tsx` overrides `window.fetch` during story rendering
2. **Global Providers**: `.storybook/preview.ts` provides React Query, Session, and Theme contexts
3. **Story Decorators**: Each story uses decorator functions to configure API responses
4. **Clean Architecture**: Simple, predictable mocking without service workers

## Usage in Stories

### Basic Usage
```typescript
import { withRecipeMocks } from "./mockApi";

export const MyStory = {
  decorators: [withRecipeMocks]
}
```

### Available Decorators

- `withRecipeMocks` - Standard recipe data
- `withHomepageMocks` - Collections and recently viewed recipes  
- `withEmptyMocks` - Empty state for all endpoints
- `withErrorMocks` - 500 errors for all endpoints
- `withLoadingMocks` - 2-second delay for loading states

### Custom API Responses
```typescript
import { withApiMocks } from "./mockApi";

export const MyStory = {
  decorators: [withApiMocks({
    '/api/recipes': {
      response: [customRecipe1, customRecipe2],
      delay: 1000
    },
    '/api/user/collections': {
      response: [],
      status: 404
    }
  })]
}
```

## Example Stories

The `HomePage.stories.tsx` demonstrates all capabilities:
- **Default**: Standard mock data
- **Empty State**: No recipes to display
- **Loading State**: Shows skeleton loading with 2s delay
- **Error State**: API failures handled gracefully
- **Custom Scenarios**: Specific data combinations

## Benefits

✅ **Simple**: No service workers or complex setup  
✅ **Fast**: Direct fetch interception is instant  
✅ **Reliable**: No MSW loader conflicts or timing issues  
✅ **Flexible**: Easy custom responses per story  
✅ **Clean**: Automatic cleanup between stories