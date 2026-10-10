import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { SidebarContent } from "./SidebarContent";

const push = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ push }),
}));

describe("SidebarContent", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders New recipe and Recipes without a Search recipes item", () => {
    render(<SidebarContent currentPath="/recipes" onNewRecipe={jest.fn()} />);

    expect(
      screen.getByRole("button", { name: "New recipe" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recipes" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.queryByRole("button", { name: "Search recipes" }),
    ).not.toBeInTheDocument();
  });

  it("calls onNewRecipe and navigates from the nav items", () => {
    const onNewRecipe = jest.fn();
    render(<SidebarContent currentPath="/" onNewRecipe={onNewRecipe} />);

    fireEvent.click(screen.getByRole("button", { name: "New recipe" }));
    fireEvent.click(screen.getByRole("button", { name: "Recipes" }));

    expect(onNewRecipe).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/recipes");
  });
});
