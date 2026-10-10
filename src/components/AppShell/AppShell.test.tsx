import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { email: "cook@example.com" } } }),
}));
jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: "/recipes", push: jest.fn() }),
}));
jest.mock("../../hooks/useMediaQuery", () => ({
  useMediaQuery: () => false,
}));
jest.mock("../Sidebar", () => ({
  AppSidebar: () => <nav aria-label="Main navigation" />,
}));

import { AppShell } from "./AppShell";

const renderShell = (): void => {
  render(
    <AppShell>
      <p>page content</p>
    </AppShell>,
  );
};

describe("AppShell", () => {
  it("renders page content inside the shell", () => {
    renderShell();

    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Main navigation" }),
    ).toBeInTheDocument();
  });

  // Search lives on the recipes page itself, not in the app chrome
  it("does not render a search button in the mobile header", () => {
    renderShell();

    expect(
      screen.queryByRole("button", { name: "Search recipes" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });
});
