import * as React from "react";
import { Body1, Display, LargeTitle } from "../components";
import Markdown from "react-markdown";
import { tokens } from "@fluentui/react-components";

const markdownInput = `
# French Toast

**Ingredients:**

- 8 slices of thick-cut Brioche or Challah bread
- 160ml whole milk
- 80ml heavy cream
- 6 egg yolks
- 67 grams granulated sugar
- 1 Tahitian vanilla bean, split and scraped, or 1 tablespoon high-quality vanilla bean paste
- 1/4 teaspoon ground cardamom
- 1/2 teaspoon ground cinnamon
- 1/4 teaspoon freshly grated nutmeg
- 1/8 teaspoon of salt
- Clarified butter for frying

**Instructions:**

1. **Lightly Toast Bread:** Toast the Brioche until slightly firmed up.
2. **Infuse the Custard:** Warm the whole milk and heavy cream in a saucepan with the vanilla bean (pod and seeds), cardamom, cinnamon, nutmeg to 180F. Remove from heat and allow too steep for 10-15 minutes to fully develop the flavors. Remove the vanilla pod afterward.
3. **Prepare the Custard Mixture:** Whisk the egg yolks and sugar until pale and fluffy. Gradually and slowly add the infused whole milk, constantly whisking. Strain the mixture through a fine mesh to ensure it's completely smooth.
4. **Soak the Bread:** Submerge the bread slices in the custard mixture, allowing them to soak on each side for 45 seconds, ensuring they are thoroughly soaked yet retain their structure.
5. **Cook the French Toast:** Heat a non-stick skillet over medium-low heat (350f-375f) and add a knob of butter. Once melted, add the soaked bread slices and cook for 2-3 minutes per side until golden brown and the custard is set.
`;

interface ListItemProps {
  children?: React.ReactNode;
  listStyleType?: React.CSSProperties["listStyleType"];
}

export default function Home() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        backgroundColor: tokens.colorNeutralBackground2,
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          marginTop: "40px",
          marginBottom: "100px",
        }}
      >
        <Markdown
          components={{
            p: ({ children }) => <Body1 as="p">{children}</Body1>,
            title: ({ children }) => <Display as="h1">{children}</Display>,
            h1: ({ children }) => (
              <LargeTitle as="h1" style={{ display: "block" }}>
                {children}
              </LargeTitle>
            ),
            strong: ({ children }) => (
              <Body1 as="strong" weight="bold">
                {children}
              </Body1>
            ),
            li: ({ children, ...props }: ListItemProps) => (
              <li
                style={{
                  display: "list-item",
                  listStyleType: props.listStyleType || "inherit",
                }}
              >
                <Body1 as="p" style={{ display: "block" }}>
                  {children}
                </Body1>
              </li>
            ),
          }}
        >
          {markdownInput}
        </Markdown>
      </div>
    </div>
  );
}
