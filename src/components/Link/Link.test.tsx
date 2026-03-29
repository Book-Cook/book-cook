import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Link } from "./Link";

describe("Link", () => {
  it("renders internal links with Next.js behavior", () => {
    render(<Link href="/recipes">Recipes</Link>);

    const anchor = screen.getByRole("link", { name: "Recipes" });
    expect(anchor).toHaveAttribute("href", "/recipes");
  });

  it("renders external links with rel noopener noreferrer when target is _blank", () => {
    render(
      <Link href="https://example.com" target="_blank">
        External
      </Link>
    );

    const anchor = screen.getByRole("link", { name: "External" });
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("respects provided rel for external links", () => {
    render(
      <Link href="https://example.com" target="_blank" rel="nofollow">
        External
      </Link>
    );

    const anchor = screen.getByRole("link", { name: "External" });
    expect(anchor).toHaveAttribute("rel", "nofollow");
  });

  it("applies underline mode classes", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Link href="/a" underline="hover">
          Hover
        </Link>
        <Link href="/b" underline="always">
          Always
        </Link>
        <Link href="/c" underline="none">
          None
        </Link>
      </>
    );

    const hover = screen.getByRole("link", { name: "Hover" });
    const always = screen.getByRole("link", { name: "Always" });
    const none = screen.getByRole("link", { name: "None" });

    expect(hover.className).toMatch(/underlineHover/);
    expect(always.className).toMatch(/underlineAlways/);
    expect(none.className).toMatch(/underlineNone/);

    await user.hover(hover);
    expect(hover).toHaveClass("underlineHover");
  });

  it("applies tone class when muted", () => {
    render(
      <Link href="/muted" tone="muted">
        Muted
      </Link>
    );

    expect(screen.getByRole("link", { name: "Muted" }).className).toMatch(
      /muted/
    );
  });
});
