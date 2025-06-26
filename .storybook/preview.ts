import type { Preview } from "@storybook/nextjs";
import { withFullProviders } from "../src/stories/providers";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { recipeHandlers } from '../src/mocks/handlers';

// Disable MSW for now - use staticQueryClient with pre-populated data instead

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

// Detect Chromatic environment for conditional configuration - use simple detection
const isChromatic = false; // Will be detected at runtime in browser

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
      disable: false,
      delay: 0,
      viewports: [1200],
      modes: {
        light: { 
          themeMode: 'light',
          prefersReducedMotion: 'reduce',
          reducedMotion: 'reduce'
        }
      },
      threshold: 0.3,
      pauseAnimationAtEnd: true,
    },
  },
  decorators: [withFullProviders], // Re-enable providers to test minimal setup
  // Disable MSW loaders - using staticQueryClient instead
  loaders: [],
};

export default preview;
