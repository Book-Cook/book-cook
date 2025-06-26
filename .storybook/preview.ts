import type { Preview } from "@storybook/nextjs";
import { withFullProviders } from "../src/stories/providers";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { recipeHandlers } from '../src/mocks/handlers';

// Initialize MSW with our handlers - add error handling for different environments
if (typeof window !== 'undefined') {
  try {
    // Detect Chromatic environment more reliably
    const isChromatic = window.navigator.userAgent.includes('HeadlessChrome') || 
                       window.navigator.userAgent.includes('Chrome-Lighthouse') ||
                       Boolean(process.env.CHROMATIC_PROJECT_TOKEN) ||
                       Boolean(process.env.STORYBOOK_CHROMATIC) ||
                       process.env.NODE_ENV === 'test';
    
    console.log('Storybook environment:', { 
      isChromatic, 
      userAgent: window.navigator.userAgent,
      chromaticToken: Boolean(process.env.CHROMATIC_PROJECT_TOKEN)
    });
    
    if (!isChromatic) {
      initialize({
        onUnhandledRequest: 'bypass',
        quiet: true
      }, recipeHandlers);
    } else {
      console.log('Skipping MSW initialization in Chromatic for faster rendering');
    }
  } catch (error) {
    console.warn('MSW initialization failed:', error);
    // Graceful fallback - continue without MSW
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

// Detect Chromatic environment for conditional configuration
const isChromatic = typeof process !== 'undefined' && 
  (Boolean(process.env.CHROMATIC_PROJECT_TOKEN) || Boolean(process.env.STORYBOOK_CHROMATIC));

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Optimize for Chromatic visual testing - maximum speed settings
    chromatic: {
      // Disable animations completely for instant rendering
      disable: false,
      // Minimal delay for maximum speed
      delay: 50,
      // Single viewport to minimize rendering overhead
      viewports: [1200],
      // Force hardware acceleration and optimize rendering
      modes: {
        light: { 
          themeMode: 'light',
          // Additional performance hints
          prefersReducedMotion: 'reduce'
        }
      },
      // Skip diffing for faster builds (if using paid plan)
      threshold: 0.2,
    },
  },
  decorators: [withFullProviders],
  // Only load MSW in development, skip completely in Chromatic
  loaders: isChromatic ? [] : [mswLoader],
};

export default preview;
