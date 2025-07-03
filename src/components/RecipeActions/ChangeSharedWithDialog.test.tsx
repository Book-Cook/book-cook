import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import ChangeSharedWithDialog from "./ChangeSharedWithDialog";

describe("ChangeSharedWithDialog", () => {
  const defaultProps = {
    isOpen: true,
    isPublic: false,
    onSave: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct initial state", () => {
    render(<ChangeSharedWithDialog {...defaultProps} />);
    
    expect(screen.getByText("Make Recipe Public")).toBeInTheDocument();
    expect(screen.getByLabelText("Private - Only you can view this recipe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("shows switch as unchecked when isPublic is false", () => {
    render(<ChangeSharedWithDialog {...defaultProps} isPublic={false} />);
    
    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();
  });

  it("shows switch as checked when isPublic is true", () => {
    render(<ChangeSharedWithDialog {...defaultProps} isPublic={true} />);
    
    expect(screen.getByText("Make Recipe Private")).toBeInTheDocument();
    expect(screen.getByLabelText("Public - Anyone can view this recipe")).toBeInTheDocument();
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
  });

  it("toggles switch when clicked", () => {
    render(<ChangeSharedWithDialog {...defaultProps} isPublic={false} />);
    
    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();
    
    fireEvent.click(switchElement);
    expect(switchElement).toBeChecked();
    
    fireEvent.click(switchElement);
    expect(switchElement).not.toBeChecked();
  });

  it("calls onSave with correct value when save is clicked", async () => {
    const onSave = jest.fn();
    render(<ChangeSharedWithDialog {...defaultProps} onSave={onSave} isPublic={false} />);
    
    // Toggle to true
    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    
    // Click save
    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith("true");
  });

  it("calls onSave with false when switch is toggled off", async () => {
    const onSave = jest.fn();
    render(<ChangeSharedWithDialog {...defaultProps} onSave={onSave} isPublic={true} />);
    
    // Toggle to false
    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);
    
    // Click save
    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);
    
    expect(onSave).toHaveBeenCalledWith("false");
  });

  it("calls onClose when cancel is clicked", () => {
    const onClose = jest.fn();
    render(<ChangeSharedWithDialog {...defaultProps} onClose={onClose} />);
    
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets state when isPublic prop changes", () => {
    const { rerender } = render(
      <ChangeSharedWithDialog {...defaultProps} isPublic={false} />
    );
    
    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();
    
    // User toggles switch
    fireEvent.click(switchElement);
    expect(switchElement).toBeChecked();
    
    // Props change (e.g., dialog reopened with different value)
    rerender(
      <ChangeSharedWithDialog {...defaultProps} isPublic={true} />
    );
    
    // Should reset to match new prop value
    expect(switchElement).toBeChecked();
  });

  it("resets state when dialog is reopened", async () => {
    const { rerender } = render(
      <ChangeSharedWithDialog {...defaultProps} isOpen={true} isPublic={false} />
    );
    
    const switchElement = screen.getByRole("switch");
    
    // Toggle switch to true
    fireEvent.click(switchElement);
    expect(switchElement).toBeChecked();
    
    // Close dialog
    rerender(
      <ChangeSharedWithDialog {...defaultProps} isOpen={false} isPublic={false} />
    );
    
    // Reopen dialog with same isPublic value
    rerender(
      <ChangeSharedWithDialog {...defaultProps} isOpen={true} isPublic={false} />
    );
    
    // Should reset to original value (false)
    await waitFor(() => {
      expect(screen.getByRole("switch")).not.toBeChecked();
    });
  });

  it("does not render when isOpen is false", () => {
    render(<ChangeSharedWithDialog {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText("Toggle Recipe Visibility")).not.toBeInTheDocument();
  });
});