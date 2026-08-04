import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent } from "@testing-library/react";

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { email: "cook@example.com" } } }),
}));
jest.mock("next/router", () => ({
  useRouter: () => ({ pathname: "/recipes", push: jest.fn() }),
}));
jest.mock("../../clientToServer/fetch/fetchRecentlyViewed", () => ({
  fetchRecentlyViewed: jest.fn().mockResolvedValue([]),
}));
jest.mock("../../clientToServer/post/useCreateRecipe", () => ({
  useCreateRecipe: () => ({ mutate: jest.fn() }),
}));
jest.mock("../../hooks/useMediaQuery", () => ({
  useMediaQuery: () => false,
}));
jest.mock("../Sidebar", () => ({
  AppSidebar: ({ onSearch }: { onSearch: () => void }) => (
    <button onClick={onSearch}>Open search</button>
  ),
}));
jest.mock("../RecipeSearchFlyout", () => ({
  RecipeSearchFlyout: () => <div data-testid="search-flyout" />,
}));

import { AppShell } from "./AppShell";

const renderShell = (): void => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <AppShell>
        <p>page content</p>
      </AppShell>
    </QueryClientProvider>,
  );
};

describe("AppShell search flyout deferral", () => {
  it("renders page content without mounting the search flyout", () => {
    renderShell();

    expect(screen.getByText("page content")).toBeInTheDocument();
    expect(screen.queryByTestId("search-flyout")).not.toBeInTheDocument();
  });

  it("mounts the search flyout only once search is opened", async () => {
    renderShell();

    fireEvent.click(screen.getByRole("button", { name: "Open search" }));

    expect(await screen.findByTestId("search-flyout")).toBeInTheDocument();
  });
});
