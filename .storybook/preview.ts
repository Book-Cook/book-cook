import type { Preview } from "@storybook/nextjs";
import { withGlobalProviders } from "../src/stories/globalProviders";

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
    chromatic: {
      disable: false,
      delay: 0,
      viewports: [1200],
      threshold: 0.3,
      pauseAnimationAtEnd: true,
    },
  },
  decorators: [withGlobalProviders],
};

export default preview;
