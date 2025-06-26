import type { Preview } from "@storybook/nextjs";
import { withFullProviders } from "../src/stories/providers";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { recipeHandlers } from '../src/mocks/handlers';

// Initialize MSW with our handlers - add error handling for different environments
if (typeof window !== 'undefined') {
  try {
    // Simple runtime detection without environment variables
    const isChromatic = window.navigator.userAgent.includes('HeadlessChrome') || 
                       window.navigator.userAgent.includes('Chrome-Lighthouse') ||
                       window.location.hostname.includes('chromatic');
    
    console.log('Storybook environment:', { 
      isChromatic, 
      userAgent: window.navigator.userAgent,
      hostname: window.location.hostname
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
  decorators: [], // Temporarily disable all decorators to debug DOM issues
  // Only load MSW in development, skip completely in Chromatic
  loaders: isChromatic ? [] : [mswLoader],
};

export default preview;
