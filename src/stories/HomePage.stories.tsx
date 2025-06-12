import type { Meta, StoryObj } from "@storybook/nextjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

import { queryClient } from "../clients/react-query";
import { RecipeTags } from "../components/RecipePage/RecipeTags/RecipeTags";
import { RecipeProvider } from "../context/RecipeProvider";

const meta: Meta<typeof RecipeTags> = {
  title: "Pages/RecipeTags",
  component: RecipeTags,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RecipeProvider>
            <Story />
          </RecipeProvider>
        </SessionProvider>
      </QueryClientProvider>
    ),
  ],
};
export default meta;

export const Default: StoryObj<typeof RecipeTags> = {};
