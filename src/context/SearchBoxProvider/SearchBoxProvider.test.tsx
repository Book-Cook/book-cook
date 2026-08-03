import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchBoxProvider, useSearchBox } from "./SearchBoxProvider";

const SearchInput: React.FC = () => {
  const { searchBoxValue, onSearchBoxValueChange } = useSearchBox();
  return (
    <input
      aria-label="search"
      value={searchBoxValue}
      onChange={(event) => onSearchBoxValueChange(event.target.value)}
    />
  );
};

describe("SearchBoxProvider", () => {
  it("exposes the current value to consumers", async () => {
    const user = userEvent.setup();

    render(
      <SearchBoxProvider>
        <SearchInput />
      </SearchBoxProvider>,
    );

    await user.type(screen.getByLabelText("search"), "tacos");

    expect(screen.getByLabelText("search")).toHaveValue("tacos");
  });

  it("does not re-render the app shell while the user types", async () => {
    const user = userEvent.setup();
    const shellRenders = jest.fn();

    // Stands in for AppShell, which wraps both the search input and the page.
    // While the search state lived in AppContainer this subtree was rebuilt on
    // every keystroke (measured: 6 renders for 5 characters). Owning the state
    // inside the provider keeps the subtree's element identity stable, so only
    // genuine `useSearchBox` consumers re-render.
    const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      shellRenders();
      return (
        <div>
          <SearchInput />
          {children}
        </div>
      );
    };

    render(
      <SearchBoxProvider>
        <Shell>
          <div>page content</div>
        </Shell>
      </SearchBoxProvider>,
    );

    expect(shellRenders).toHaveBeenCalledTimes(1);

    await user.type(screen.getByLabelText("search"), "tacos");

    expect(screen.getByLabelText("search")).toHaveValue("tacos");
    expect(shellRenders).toHaveBeenCalledTimes(1);
  });
});
