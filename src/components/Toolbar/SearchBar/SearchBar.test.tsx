import React from "react";
import { jest } from "@jest/globals";

import { SearchBar } from "./SearchBar";

import { render } from "../../../utils";

jest.mock("../../../context", () => ({
  useSearchBox: () => ({
    searchBoxValue: "",
    onSearchBoxValueChange: jest.fn(),
  }),
}));
jest.mock("next/router", () => jest.requireActual("next-router-mock"));

it("renders correctly and matches snapshot", () => {
  const { container } = render(<SearchBar />);
  expect(container).toMatchSnapshot();
});
