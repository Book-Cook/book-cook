import * as React from "react";
import { Body1 } from "../components";
import { MDXRemote } from "next-mdx-remote";

const markdownInput = `**Ingredients:**

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
- Clarified butter for frying`;

export default function Home() {
  return <Body1>{markdownInput}</Body1>;
}
