import type { Preview } from "@storybook/nextjs";
import { withFullProviders } from "../src/stories/providers";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { recipeHandlers } from '../src/mocks/handlers';

// Initialize MSW with our handlers - add error handling for different environments
if (typeof window !== 'undefined') {
  try {
    // Skip MSW initialization in Chromatic to speed up rendering
    if (!window.navigator.userAgent.includes('HeadlessChrome')) {
      initialize({
        onUnhandledRequest: 'bypass',
        quiet: true
      }, recipeHandlers);
    }
  } catch (error) {
    console.warn('MSW initialization failed:', error);
  }
}

export const globalTypes = {
  themeMode: {
    name: "Theme",
    description: "Toggle light and dark mode",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Optimize for Chromatic visual testing
    chromatic: {
      // Disable animations for faster rendering
      disable: false,
      // Reduce delay for faster snapshots
      delay: 500,
      // Use specific viewports to reduce rendering time
      viewports: [1200],
      // Optimize for performance
      modes: {
        light: { themeMode: 'light' }
      }
    },
  },
  decorators: [withFullProviders],
  loaders: [mswLoader],
};

export default preview;
