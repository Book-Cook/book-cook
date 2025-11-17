import type { Preview } from "@storybook/nextjs";
import { withGlobalProviders } from "../src/stories/globalProviders";
import { MOCK_BASE_DATE } from "../src/mocks/utils/mockDates";

// Mock Date globally for consistent Chromatic snapshots
// This ensures all stories use the same fixed date
const mockDate = new Date(MOCK_BASE_DATE);
const OriginalDate = Date;

// @ts-ignore - Mocking Date constructor
global.Date = class extends OriginalDate {
  constructor(...args: any[]) {
    if (args.length === 0) {
      super(MOCK_BASE_DATE);
    } else {
      // @ts-ignore
      super(...args);
    }
  }

  static now() {
    return mockDate.getTime();
  }
} as any;

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
