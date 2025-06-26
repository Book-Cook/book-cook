import type { Preview } from "@storybook/nextjs";
import { withProviders } from "../src/stories/decorators";
import { initialize, mswLoader } from 'msw-storybook-addon';
import { recipeHandlers } from '../src/mocks/handlers';

// Initialize MSW with our handlers - add error handling for different environments
if (typeof window !== 'undefined') {
  try {
    initialize({
      onUnhandledRequest: 'warn'
    }, recipeHandlers);
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
  },
  decorators: [withProviders],
  loaders: [mswLoader],
};

export default preview;
