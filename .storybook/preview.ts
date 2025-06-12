import type { Preview } from "@storybook/nextjs";
import { withProviders } from "../src/stories/decorators";

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
};

export default preview;
