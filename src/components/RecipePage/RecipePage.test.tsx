import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import { RecipePage } from "./RecipePage";
import { useRecipeViewSaveState } from "../RecipeView/RecipeViewSaveStateContext";

import { fetchRecipe } from "../../clientToServer";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../clientToServer", () => ({
  fetchRecipe: jest.fn(),
}));

// Stubbed so the test exercises RecipePage's guard wiring rather than the
// full recipe view. The stub still drives the real save-state context.
jest.mock("../RecipeView", () => ({
  RecipeView: () => {
    const saveState = useRecipeViewSaveState();
    return (
      <button type="button" onClick={() => saveState?.updateTitle("Edited")}>
        Make an edit
      </button>
    );
  },
}));

const recipe = {
  _id: "abc",
  title: "Original",
  data: "Body",
  emoji: "🍲",
  tags: [],
  createdAt: "2026-01-01T00:00:00.000Z",
};

const routeHandlers = new Set<(url: string) => void>();
let popStateHandler: (state: { url: string }) => boolean = () => true;
const push = jest.fn(() => Promise.resolve(true));

const navigate = (url: string) => {
  let blocked = false;
  routeHandlers.forEach((handler) => {
    try {
      handler(url);
    } catch {
      blocked = true;
    }
  });
  return blocked;
};

beforeEach(() => {
  routeHandlers.clear();
  popStateHandler = () => true;
  push.mockClear();
  (fetchRecipe as jest.Mock).mockResolvedValue(recipe);
  (useRouter as jest.Mock).mockReturnValue({
    asPath: "/recipes/abc",
    query: { recipes: "abc" },
    push,
    beforePopState: (handler: (state: { url: string }) => boolean) => {
      popStateHandler = handler;
    },
    events: {
      on: (event: string, handler: (url: string) => void) => {
        if (event === "routeChangeStart") {
          routeHandlers.add(handler);
        }
      },
      off: (event: string, handler: (url: string) => void) => {
        if (event === "routeChangeStart") {
          routeHandlers.delete(handler);
        }
      },
      emit: jest.fn(),
    },
  });
});

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RecipePage />
    </QueryClientProvider>
  );
};

const makeDirty = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(await screen.findByRole("button", { name: "Make an edit" }));
  await screen.findByRole("button", { name: "Save" });
};

describe("RecipePage unsaved changes", () => {
  it("lets navigation through while nothing is edited", async () => {
    renderPage();
    await screen.findByRole("button", { name: "Make an edit" });

    expect(navigate("/recipes/other")).toBe(false);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("prompts instead of leaving when navigation is attempted mid-edit", async () => {
    const user = userEvent.setup();
    renderPage();
    await makeDirty(user);

    let blocked = false;
    act(() => {
      blocked = navigate("/recipes/other");
    });
    expect(blocked).toBe(true);

    expect(
      await screen.findByText("Discard unsaved changes?")
    ).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it("prompts instead of leaving when the back button is pressed mid-edit", async () => {
    const user = userEvent.setup();
    renderPage();
    await makeDirty(user);

    let allowed = true;
    act(() => {
      allowed = popStateHandler({ url: "/recipes/other" });
    });
    expect(allowed).toBe(false);

    expect(
      await screen.findByText("Discard unsaved changes?")
    ).toBeInTheDocument();
  });

  it("keeps the edit and stays put when the user chooses to keep editing", async () => {
    const user = userEvent.setup();
    renderPage();
    await makeDirty(user);
    act(() => {
      navigate("/recipes/other");
    });

    await user.click(
      await screen.findByRole("button", { name: "Keep editing" })
    );

    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
    );
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("completes the navigation when the user chooses to discard", async () => {
    const user = userEvent.setup();
    renderPage();
    await makeDirty(user);
    act(() => {
      navigate("/recipes/other");
    });

    await user.click(
      await screen.findByRole("button", { name: "Discard changes" })
    );

    await waitFor(() => expect(push).toHaveBeenCalledWith("/recipes/other"));
  });

  it("prompts before the Cancel button throws the edit away", async () => {
    const user = userEvent.setup();
    renderPage();
    await makeDirty(user);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      await screen.findByText("Discard unsaved changes?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("discards the edit only after Cancel is confirmed", async () => {
    const user = userEvent.setup();
    renderPage();
    await makeDirty(user);
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await user.click(
      await screen.findByRole("button", { name: "Discard changes" })
    );

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Save" })
      ).not.toBeInTheDocument()
    );
  });
});
