import type { Meta, StoryObj } from "@storybook/nextjs";

import { TextEditor } from "../../components/TextEditor";

const recipeMarkdown = `# Brown Butter Chocolate Chip Cookies

A deeply caramelized cookie with crisp edges, a soft center, and enough salt to balance the chocolate.

## Ingredients

- 225 g unsalted butter
- 200 g dark brown sugar
- 100 g granulated sugar
- 1 large egg
- 1 egg yolk
- 2 tsp vanilla extract
- 280 g all-purpose flour
- 1 tsp baking soda
- 1 tsp kosher salt
- 250 g dark chocolate, roughly chopped

## Method

1. Brown the butter until the milk solids are deeply golden and smell nutty.
2. Cool for 15 minutes, then whisk with both sugars until glossy.
3. Add the egg, yolk, and vanilla; whisk until the mixture lightens slightly.
4. Fold in the dry ingredients just until no flour streaks remain.
5. Add the chocolate and chill the dough for at least 1 hour.
6. Bake at 180°C for 11–13 minutes.

> Pull the cookies when the edges are set but the centers still look slightly underdone.

### Finish

Sprinkle with flaky salt immediately after baking. Rest on the tray for 10 minutes before transferring.

| Yield | Prep | Bake |
| --- | --- | --- |
| 16 cookies | 25 minutes | 12 minutes |

---

**Storage:** Keep airtight for 3 days, or freeze portioned dough for up to 2 months.`;

const meta: Meta<typeof TextEditor> = {
  title: "Components/TextEditor",
  component: TextEditor,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    text: recipeMarkdown,
  },
  decorators: [
    (Story) => (
      <main
        style={{
          width: "min(100%, 920px)",
          minHeight: "100vh",
          margin: "0 auto",
          padding: "72px 48px 120px",
        }}
      >
        <Story />
      </main>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TextEditor>;

export const Editable: Story = {
  args: {
    viewingMode: "editor",
  },
};

export const ReadOnly: Story = {
  args: {
    viewingMode: "viewer",
  },
};

export const CompactRecipe: Story = {
  args: {
    viewingMode: "viewer",
    text: `## Simple Vinaigrette

- 3 tbsp olive oil
- 1 tbsp lemon juice
- 1 tsp Dijon mustard
- Salt and pepper

1. Whisk the lemon juice, mustard, salt, and pepper.
2. Stream in the oil until emulsified.

**Use immediately.**`,
  },
};
