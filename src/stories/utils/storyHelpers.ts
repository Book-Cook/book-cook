import type { StoryObj } from "@storybook/nextjs";

import { withStoryProviders } from "../decorators/withStoryProviders";

type StoryDecorator = (Story: React.ComponentType) => JSX.Element;

interface CreateStoryOptions {
  name: string;
  decorators: StoryDecorator[];
}

export const createStory = <T extends React.ComponentType>({ 
  name, 
  decorators 
}: CreateStoryOptions): StoryObj<T> => ({
  name,
  decorators: [withStoryProviders(), ...decorators] as StoryObj<T>['decorators'],
});

export const createStorySet = <T extends React.ComponentType>(
  baseDecorators: StoryDecorator[] = []
) => ({
  create: (name: string, additionalDecorators: StoryDecorator[] = []) =>
    createStory<T>({
      name,
      decorators: [...baseDecorators, ...additionalDecorators],
    }),
});