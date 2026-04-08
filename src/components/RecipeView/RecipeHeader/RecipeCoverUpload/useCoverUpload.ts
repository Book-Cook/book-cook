import {
  type ForwardedRef,
  type RefObject,
  useCallback,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  ALLOWED_TYPES,
  MAX_SIZE_BYTES,
  compressToWebP,
  uploadWithProgress,
  validateMagicBytes,
} from "./imageUtils";
import type { UploadState } from "./RecipeCoverUpload.types";

interface UseCoverUploadProps {
  recipeId: string;
  imageURL: string;
  externalRef: ForwardedRef<HTMLInputElement>;
}

interface UseCoverUploadReturn {
  uploadState: UploadState;
  previewUrl: string | null;
  isUploading: boolean;
  displayUrl: string | undefined;
  hasImage: boolean;
  setInputRef: (el: HTMLInputElement | null) => void;
  handleFileSelect: (file: File) => Promise<void>;
  handleRemoveCover: () => Promise<void>;
  internalRef: RefObject<HTMLInputElement>;
}

/**
 * Manages cover photo upload state, validation, compression, and removal.
 */
export function useCoverUpload({
  recipeId,
  imageURL,
  externalRef,
}: UseCoverUploadProps): UseCoverUploadReturn {
  const internalRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const isUploading = uploadState.status !== "idle";
  const displayUrl = previewUrl ?? imageURL;
  const hasImage = Boolean(displayUrl);

  const setInputRef = useCallback(
    (el: HTMLInputElement | null) => {
      internalRef.current = el;
      if (typeof externalRef === "function") {
        externalRef(el);
      } else if (externalRef) {
        externalRef.current = el;
      }
    },
    [externalRef],
  );

  const handleFileSelect = async (file: File) => {
    setUploadState({ status: "idle" });
    setPreviewUrl(null);

    if (!ALLOWED_TYPES.has(file.type)) {
      toast.error("Only JPEG, PNG, WebP, and GIF images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image must be under 10 MB.");
      return;
    }
    if (!(await validateMagicBytes(file))) {
      toast.error("File does not appear to be a valid image.");
      return;
    }

    try {
      setUploadState({ status: "compressing" });
      const compressed = await compressToWebP(file);
      const preview = URL.createObjectURL(compressed);
      setPreviewUrl(preview);

      setUploadState({ status: "requesting" });
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: "image/webp",
          fileSize: compressed.size,
        }),
      });
      if (!presignRes.ok) {
        const { error } = (await presignRes.json()) as { error: string };
        throw new Error(error ?? "Failed to get upload URL");
      }
      const { uploadUrl, key } = (await presignRes.json()) as {
        uploadUrl: string;
        key: string;
      };

      setUploadState({ status: "uploading", progress: 0 });
      await uploadWithProgress(compressed, uploadUrl, (pct) =>
        setUploadState({ status: "uploading", progress: pct }),
      );

      setUploadState({ status: "confirming" });
      const confirmRes = await fetch("/api/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, recipeId }),
      });
      if (!confirmRes.ok) {
        const { error } = (await confirmRes.json()) as { error: string };
        throw new Error(error ?? "Failed to save image");
      }
      const { url } = (await confirmRes.json()) as { url: string };

      queryClient.setQueryData(
        ["recipe", recipeId],
        (old: Record<string, unknown> | undefined) =>
          old ? { ...old, imageURL: url } : old,
      );
      void queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId],
        refetchType: "all",
      });

      URL.revokeObjectURL(preview);
      setPreviewUrl(null);
      setUploadState({ status: "idle" });
    } catch (err) {
      setPreviewUrl(null);
      setUploadState({ status: "idle" });
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleRemoveCover = async () => {
    setUploadState({ status: "confirming" });
    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageURL: "" }),
      });
      if (!res.ok) {
        throw new Error("Failed to remove cover");
      }

      queryClient.setQueryData(
        ["recipe", recipeId],
        (old: Record<string, unknown> | undefined) =>
          old ? { ...old, imageURL: "" } : old,
      );
      void queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId],
        refetchType: "all",
      });
      setUploadState({ status: "idle" });
    } catch (err) {
      setUploadState({ status: "idle" });
      toast.error(
        err instanceof Error ? err.message : "Failed to remove cover",
      );
    }
  };

  return {
    uploadState,
    previewUrl,
    isUploading,
    displayUrl,
    hasImage,
    setInputRef,
    handleFileSelect,
    handleRemoveCover,
    internalRef,
  };
}
