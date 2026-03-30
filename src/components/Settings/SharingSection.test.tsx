import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock the three sharing hooks
jest.mock("../../clientToServer/fetch/useSharedUsers", () => ({
  useSharedUsers: jest.fn(),
}));
jest.mock("../../clientToServer/post/useShareWithUser", () => ({
  useShareWithUser: jest.fn(),
}));
jest.mock("../../clientToServer/delete/useDeleteSharedUser", () => ({
  useDeleteSharedUser: jest.fn(),
}));

// Mock next-auth and other deps used by SettingsPage but not tested here
jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: null }),
  signOut: jest.fn(),
}));
jest.mock("../Theme/ThemeProvider", () => ({
  useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
}));

import { useDeleteSharedUser } from "../../clientToServer/delete/useDeleteSharedUser";
import { useSharedUsers } from "../../clientToServer/fetch/useSharedUsers";
import { useShareWithUser } from "../../clientToServer/post/useShareWithUser";
import { SettingsPage } from "./Settings";

const mockUseSharedUsers = useSharedUsers as jest.MockedFunction<typeof useSharedUsers>;
const mockUseShareWithUser = useShareWithUser as jest.MockedFunction<typeof useShareWithUser>;
const mockUseDeleteSharedUser = useDeleteSharedUser as jest.MockedFunction<typeof useDeleteSharedUser>;

function makeQueryWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
}

function makeMutateMock() {
  return jest.fn((_email: string, opts?: { onSuccess?: () => void; onError?: (e: Error) => void }) => {
    opts?.onSuccess?.();
  });
}

function makeErrorMutateMock(msg: string) {
  return jest.fn((_email: string, opts?: { onSuccess?: () => void; onError?: (e: Error) => void }) => {
    opts?.onError?.(new Error(msg));
  });
}

describe("SharingSection (within SettingsPage)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default: empty shared users, not loading
    mockUseSharedUsers.mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useSharedUsers>);

    mockUseShareWithUser.mockReturnValue({
      mutate: makeMutateMock(),
      isPending: false,
    } as unknown as ReturnType<typeof useShareWithUser>);

    mockUseDeleteSharedUser.mockReturnValue({
      mutate: makeMutateMock(),
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteSharedUser>);
  });

  function renderSettings() {
    return render(<SettingsPage />, { wrapper: makeQueryWrapper() });
  }

  it("renders the share input and Share button", () => {
    renderSettings();
    expect(screen.getByPlaceholderText("user@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("shows empty state when no users are shared", () => {
    renderSettings();
    expect(
      screen.getByText("You haven't shared your recipes with anyone yet.")
    ).toBeInTheDocument();
  });

  it("shows loading state while fetching shared users", () => {
    mockUseSharedUsers.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useSharedUsers>);

    renderSettings();
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders shared user list when users exist", () => {
    mockUseSharedUsers.mockReturnValue({
      data: ["alice@example.com", "bob@example.com"],
      isLoading: false,
    } as ReturnType<typeof useSharedUsers>);

    renderSettings();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(2);
  });

  it("shows validation error for invalid email", () => {
    renderSettings();

    const input = screen.getByPlaceholderText("user@example.com");
    fireEvent.change(input, { target: { value: "not-an-email" } });
    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(mockUseShareWithUser().mutate).not.toHaveBeenCalled();
  });

  it("calls shareWithUser mutation with trimmed valid email", () => {
    const mutateSpy = makeMutateMock();
    mockUseShareWithUser.mockReturnValue({
      mutate: mutateSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useShareWithUser>);

    renderSettings();

    const input = screen.getByPlaceholderText("user@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(mutateSpy).toHaveBeenCalledWith(
      "test@example.com",
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) })
    );
  });

  it("clears input on successful share", async () => {
    const mutateSpy = makeMutateMock(); // calls onSuccess immediately
    mockUseShareWithUser.mockReturnValue({
      mutate: mutateSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useShareWithUser>);

    renderSettings();

    const input = screen.getByPlaceholderText("user@example.com");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() => {
      expect((input as HTMLInputElement).value).toBe("");
    });
  });

  it("shows error text when share API fails", async () => {
    const mutateSpy = makeErrorMutateMock("User not found");
    mockUseShareWithUser.mockReturnValue({
      mutate: mutateSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useShareWithUser>);

    renderSettings();

    fireEvent.change(screen.getByPlaceholderText("user@example.com"), {
      target: { value: "unknown@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });
  });

  it("calls deleteSharedUser when Remove is clicked", () => {
    const mutateSpy = makeMutateMock();
    mockUseDeleteSharedUser.mockReturnValue({
      mutate: mutateSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useDeleteSharedUser>);

    mockUseSharedUsers.mockReturnValue({
      data: ["alice@example.com"],
      isLoading: false,
    } as ReturnType<typeof useSharedUsers>);

    renderSettings();

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(mutateSpy).toHaveBeenCalledWith(
      "alice@example.com",
      expect.objectContaining({ onError: expect.any(Function) })
    );
  });

  it("Share button is disabled when input is empty", () => {
    renderSettings();
    expect(screen.getByRole("button", { name: "Share" })).toBeDisabled();
  });

  it("Share button submits on Enter key", () => {
    const mutateSpy = makeMutateMock();
    mockUseShareWithUser.mockReturnValue({
      mutate: mutateSpy,
      isPending: false,
    } as unknown as ReturnType<typeof useShareWithUser>);

    renderSettings();

    const input = screen.getByPlaceholderText("user@example.com");
    fireEvent.change(input, { target: { value: "enter@example.com" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mutateSpy).toHaveBeenCalledWith(
      "enter@example.com",
      expect.any(Object)
    );
  });

  it("clears error messages when user starts typing again", () => {
    renderSettings();

    const input = screen.getByPlaceholderText("user@example.com");
    fireEvent.change(input, { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "b" } });
    expect(screen.queryByText("Enter a valid email address.")).not.toBeInTheDocument();
  });
});
