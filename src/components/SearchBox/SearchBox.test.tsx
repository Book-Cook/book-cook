import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("renders with placeholder and value", () => {
    render(<SearchBox placeholder="Search..." value="hello" onChange={() => {}} />);

    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    expect(input.value).toBe("hello");
  });

  it("calls onChange with updated value", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<SearchBox placeholder="Search..." onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Search...");
    await user.type(input, "abc");

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange).toHaveBeenLastCalledWith(expect.anything(), "abc");
  });

  it("clears when allowClear and button pressed", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<SearchBox value="text" onChange={handleChange} allowClear />);

    const clearButton = screen.getByRole("button", { name: /clear/i });
    await user.click(clearButton);

    expect(handleChange).toHaveBeenLastCalledWith(expect.anything(), "");
  });

  it("hides clear button when allowClear is false", () => {
    render(<SearchBox value="text" onChange={() => {}} allowClear={false} />);

    expect(screen.queryByRole("button", { name: /clear/i })).toBeNull();
  });
});
