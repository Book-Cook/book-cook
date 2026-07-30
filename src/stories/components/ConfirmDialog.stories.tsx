import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../../components/Button";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmDialog>;

const ConfirmDialogPreview: React.FC<{
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "destructive";
  cancelVariant?: "secondary" | "ghost";
  triggerLabel: string;
}> = ({ triggerLabel, ...dialogProps }) => {
  const [open, setOpen] = React.useState(false);
  const [outcome, setOutcome] = React.useState<string | null>(null);

  return (
    <div style={{ display: "grid", gap: "12px", justifyItems: "start" }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {outcome && <span>Last choice: {outcome}</span>}
      <ConfirmDialog
        {...dialogProps}
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOutcome("confirmed")}
        onCancel={() => setOutcome("cancelled")}
      />
    </div>
  );
};

export const DiscardUnsavedChanges: Story = {
  render: () => (
    <ConfirmDialogPreview
      triggerLabel="Leave the recipe"
      title="Discard unsaved changes?"
      description="Your edits to this recipe have not been saved yet. They will be lost if you continue."
      confirmLabel="Discard changes"
      cancelLabel="Keep editing"
    />
  ),
};

export const WithoutDescription: Story = {
  render: () => (
    <ConfirmDialogPreview
      triggerLabel="Delete the recipe"
      title="Delete this recipe?"
      confirmLabel="Delete"
    />
  ),
};

export const NonDestructive: Story = {
  render: () => (
    <ConfirmDialogPreview
      triggerLabel="Publish the recipe"
      title="Publish this recipe?"
      description="Anyone with the link will be able to view it."
      confirmLabel="Publish"
      confirmVariant="primary"
      cancelVariant="ghost"
    />
  ),
};
