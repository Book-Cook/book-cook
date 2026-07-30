import userEvent from "@testing-library/user-event";

import { ConfirmDialog } from "./ConfirmDialog";

import { render, screen } from "../../utils/testing/TestUtils";

const setup = (overrides: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  const onOpenChange = jest.fn();

  render(
    <ConfirmDialog
      open
      onOpenChange={onOpenChange}
      title="Discard unsaved changes?"
      description="Your edits will be lost if you continue."
      confirmLabel="Discard changes"
      cancelLabel="Keep editing"
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...overrides}
    />
  );

  return { onConfirm, onCancel, onOpenChange };
};

describe("ConfirmDialog", () => {
  it("announces itself as an alert dialog with its title and description", () => {
    setup();

    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByText("Discard unsaved changes?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Your edits will be lost if you continue.")
    ).toBeInTheDocument();
  });

  it("renders nothing while closed", () => {
    setup({ open: false });

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("omits the close button so the choice must be explicit", () => {
    setup();

    expect(
      screen.queryByRole("button", { name: /close dialog/i })
    ).not.toBeInTheDocument();
  });

  it("confirms and closes when the confirming action is pressed", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel, onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: "Discard changes" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("cancels without confirming when the dismissing action is pressed", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel, onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: "Keep editing" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("cancels without confirming when Escape is pressed", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = setup();

    await user.keyboard("{Escape}");

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("defaults to a destructive confirming action and generic labels", () => {
    setup({
      confirmLabel: undefined,
      cancelLabel: undefined,
      description: undefined,
    });

    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
