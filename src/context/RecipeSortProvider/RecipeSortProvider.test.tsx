import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RecipeSortProvider, useRecipeSort } from "./RecipeSortProvider";

const SortPicker: React.FC = () => {
  const { sortOption, onSortOptionChange } = useRecipeSort();
  return (
    <select
      aria-label="sort"
      value={sortOption}
      onChange={(event) => onSortOptionChange(event.target.value)}
    >
      <option value="dateNewest">Newest</option>
      <option value="ascTitle">Title</option>
    </select>
  );
};

describe("RecipeSortProvider", () => {
  it("defaults to newest first", () => {
    render(
      <RecipeSortProvider>
        <SortPicker />
      </RecipeSortProvider>,
    );

    expect(screen.getByLabelText("sort")).toHaveValue("dateNewest");
  });

  it("keeps the chosen sort when the consuming page unmounts and remounts", async () => {
    const user = userEvent.setup();

    // Stands in for leaving the gallery to open a recipe, then coming back
    const Routes: React.FC<{ onGallery: boolean }> = ({ onGallery }) =>
      onGallery ? <SortPicker /> : <p>recipe page</p>;

    const { rerender } = render(
      <RecipeSortProvider>
        <Routes onGallery />
      </RecipeSortProvider>,
    );

    await user.selectOptions(screen.getByLabelText("sort"), "ascTitle");

    rerender(
      <RecipeSortProvider>
        <Routes onGallery={false} />
      </RecipeSortProvider>,
    );
    expect(screen.queryByLabelText("sort")).not.toBeInTheDocument();

    rerender(
      <RecipeSortProvider>
        <Routes onGallery />
      </RecipeSortProvider>,
    );
    expect(screen.getByLabelText("sort")).toHaveValue("ascTitle");
  });
});
