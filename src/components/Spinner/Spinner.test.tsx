import * as React from "react";
import { render, screen } from "@testing-library/react";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with a default accessible label", () => {
    render(<Spinner />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Loading"
    );
  });

  it("renders provided label text", () => {
    render(<Spinner label="Fetching recipes..." />);

    expect(screen.getByText("Fetching recipes...")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Fetching recipes..."
    );
  });

  it("applies size modifier and custom className", () => {
    render(<Spinner size="tiny" className="extra-class" />);

    expect(screen.getByRole("progressbar")).toHaveClass("spinner");
    expect(screen.getByRole("progressbar")).toHaveClass("tiny");
    expect(screen.getByRole("progressbar")).toHaveClass("extra-class");
  });

  it("uses ariaLabel when label is not a string", () => {
    render(
      <Spinner label={<span>Custom node</span>} ariaLabel="Loading data" />
    );

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Loading data"
    );
  });

  it("forwards refs to the outer element", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Spinner ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("spinner");
  });
});
