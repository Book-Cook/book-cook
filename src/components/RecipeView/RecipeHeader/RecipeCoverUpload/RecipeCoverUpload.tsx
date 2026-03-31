import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CameraIcon, TrashIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";

import styles from "./RecipeCoverUpload.module.css";
import type {
  RecipeCoverUploadProps,
  UploadState,
} from "./RecipeCoverUpload.types";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// Magic byte signatures for client-side validation
const MAGIC_SIGNATURES: { type: string; bytes: number[] }[] = [
  { type: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { type: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { type: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header
  { type: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
];

async function validateMagicBytes(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  return MAGIC_SIGNATURES.some(({ bytes: sig }) =>
    sig.every((byte, i) => bytes[i] === byte),
  );
}

async function compressToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const MAX_WIDTH = 1920;
      const scale = Math.min(1, MAX_WIDTH / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Image compression failed"));
          }
        },
        "image/webp",
        0.85,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = objectUrl;
  });
}

function uploadWithProgress(
  blob: Blob,
  url: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error during upload")),
    );
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", "image/webp");
    xhr.send(blob);
  });
}

export const RecipeCoverUpload = ({
  recipeId,
  imageURL,
}: RecipeCoverUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const isUploading = state.status !== "idle" && state.status !== "error";
  const displayUrl = previewUrl ?? imageURL;
  const hasImage = Boolean(displayUrl);

  const handleFileSelect = async (file: File) => {
    setState({ status: "idle" });
    setPreviewUrl(null);

    // Basic type check
    if (!ALLOWED_TYPES.has(file.type)) {
      setState({
        status: "error",
        message: "Only JPEG, PNG, WebP, and GIF images are allowed.",
      });
      return;
    }

    // Size check
    if (file.size > MAX_SIZE_BYTES) {
      setState({ status: "error", message: "Image must be under 10 MB." });
      return;
    }

    // Magic bytes check — guards against renamed files
    const validBytes = await validateMagicBytes(file);
    if (!validBytes) {
      setState({
        status: "error",
        message: "File does not appear to be a valid image.",
      });
      return;
    }

    try {
      // Step 1: Compress to WebP
      setState({ status: "compressing" });
      const compressed = await compressToWebP(file);

      // Show preview immediately — before the upload completes
      const preview = URL.createObjectURL(compressed);
      setPreviewUrl(preview);

      // Step 2: Get presigned URL
      setState({ status: "requesting" });
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

      // Step 3: Upload directly to R2
      setState({ status: "uploading", progress: 0 });
      await uploadWithProgress(compressed, uploadUrl, (pct) => {
        setState({ status: "uploading", progress: pct });
      });

      // Step 4: Confirm — moves pending → public and updates DB
      setState({ status: "confirming" });
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

      // Optimistically update cache so the cover appears instantly
      queryClient.setQueryData(
        ["recipe", recipeId],
        (old: Record<string, unknown> | undefined) =>
          old ? { ...old, imageURL: url } : old,
      );
      void queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId],
        refetchType: "all",
      });

      // Clean up the blob URL now that the real URL is in cache
      URL.revokeObjectURL(preview);
      setPreviewUrl(null);
      setState({ status: "idle" });
    } catch (err) {
      setPreviewUrl(null);
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Upload failed",
      });
    }
  };

  const handleRemoveCover = async () => {
    setState({ status: "confirming" });
    try {
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageURL: "" }),
      });

      if (!res.ok) throw new Error("Failed to remove cover");

      queryClient.setQueryData(
        ["recipe", recipeId],
        (old: Record<string, unknown> | undefined) =>
          old ? { ...old, imageURL: "" } : old,
      );
      void queryClient.invalidateQueries({
        queryKey: ["recipe", recipeId],
        refetchType: "all",
      });

      setState({ status: "idle" });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to remove cover",
      });
    }
  };

  return (
    <div className={clsx(styles.root, hasImage && styles.hasCover)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className={styles.hiddenInput}
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFileSelect(file);
          // Reset so the same file can be re-selected after an error
          e.target.value = "";
        }}
      />

      {/* Cover image or empty area */}
      {hasImage ? (
        <div
          className={styles.cover}
          style={{ backgroundImage: `url(${displayUrl})` }}
          role="img"
          aria-label="Recipe cover photo"
        />
      ) : (
        <div className={styles.emptyArea} />
      )}

      {/* Upload progress bar */}
      {state.status === "uploading" && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${state.progress}%` }}
          />
        </div>
      )}

      {/* Controls overlay */}
      <div className={styles.overlay}>
        {state.status === "compressing" || state.status === "requesting" ? (
          <span className={styles.statusText}>Preparing…</span>
        ) : state.status === "confirming" ? (
          <span className={styles.statusText}>Saving…</span>
        ) : state.status === "uploading" ? (
          <span className={styles.statusText}>
            Uploading {state.progress}%…
          </span>
        ) : (
          <>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              aria-label={hasImage ? "Change cover photo" : "Add cover photo"}
            >
              <CameraIcon size={16} weight="bold" />
              {hasImage ? "Change cover" : "Add cover"}
            </button>

            {hasImage && !isUploading && (
              <button
                type="button"
                className={clsx(styles.controlButton, styles.removeButton)}
                onClick={() => void handleRemoveCover()}
                aria-label="Remove cover photo"
              >
                <TrashIcon size={16} weight="bold" />
                Remove
              </button>
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {state.status === "error" && (
        <div className={styles.errorBanner} role="alert">
          {state.message}
          <button
            type="button"
            className={styles.errorDismiss}
            onClick={() => setState({ status: "idle" })}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
