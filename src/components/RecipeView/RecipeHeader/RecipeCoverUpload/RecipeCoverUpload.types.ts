export type RecipeCoverUploadProps = {
  recipeId: string;
  imageURL: string;
};

export type UploadState =
  | { status: "idle" }
  | { status: "compressing" }
  | { status: "requesting" }
  | { status: "uploading"; progress: number }
  | { status: "confirming" }
  | { status: "error"; message: string };
