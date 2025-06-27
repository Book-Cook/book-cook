import type { Preview } from "@storybook/nextjs";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { withGlobalProviders } from "../src/stories/globalProviders";

console.log('🔧 Preview.ts loaded');

// Initialize MSW
initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: './mockServiceWorker.js',
    options: {
      scope: '/',
    }
  }
});
console.log('🔧 MSW initialized');

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
  decorators: [withGlobalProviders],
  // loaders: [mswLoader], // This breaks component rendering
};

export default preview;
