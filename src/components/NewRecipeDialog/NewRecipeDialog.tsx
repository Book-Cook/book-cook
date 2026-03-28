import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

import type { NewRecipeDialogProps } from "./NewRecipeDialog.types";
import { Button } from "../Button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../Dialog";
import { Input } from "../Input";

import { useCreateRecipe } from "../../clientToServer/post/useCreateRecipe";

export const NewRecipeDialog = ({ open, onOpenChange }: NewRecipeDialogProps) => {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const mutation = useCreateRecipe();

  const handleCreate = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    mutation.mutate(
      { title: trimmed, data: "", tags: [], imageURL: "" },
      {
        onSuccess: (response) => {
          void router.push(`/recipes/${response.recipeId}`);
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to create recipe. Please try again.");
        },
      }
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTitle("");
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>New recipe</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Input
            label="Title"
            placeholder="e.g. Spaghetti carbonara"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreate();
              }
            }}
            fullWidth
            autoFocus
          />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              disabled={mutation.isPending}
              onClick={() => setTitle("")}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            disabled={mutation.isPending}
            isLoading={mutation.isPending}
            onClick={handleCreate}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
