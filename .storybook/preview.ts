import type { Preview } from "@storybook/nextjs";
import { initialize, mswDecorator } from "msw-storybook-addon";
import { withProviders } from "../src/stories/decorators";
import { handlers } from "../src/mocks/handlers";

initialize({ onUnhandledRequest: "bypass" });

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
    msw: { handlers },
  },
  decorators: [mswDecorator, withProviders],
};

export default preview;
