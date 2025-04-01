import * as React from "react";
import { useRouter } from "next/router";
import {
  Field,
  Input,
  Button,
  makeStyles,
  shorthands,
  tokens,
  Text,
  MessageBar,
  MessageBarBody,
  Spinner,
  FieldProps,
} from "@fluentui/react-components";
import { useCreateRecipe } from "../clientToServer";
import { TiptapEditor } from "../components/Editor/Editor";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    paddingTop: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalXXL,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "700px",
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  submitContainer: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
});

const isEditorContentEmpty = (htmlValue: string | undefined): boolean => {
  if (!htmlValue) return true;
  if (typeof document !== "undefined") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlValue;
    return (tempDiv.textContent || "").trim().length === 0;
  }
  return htmlValue.replace(/<[^>]*>/g, "").trim().length === 0; // Fallback
};

const getValidationProps = (
  error: string | undefined
): Pick<FieldProps, "validationMessage" | "validationState"> => {
  return error ? { validationMessage: error, validationState: "error" } : {};
};

export default function NewRecipe() {
  const styles = useStyles();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [editorContentHtml, setEditorContentHtml] = React.useState("");
  const [titleError, setTitleError] = React.useState<string | undefined>();
  const [recipeError, setRecipeError] = React.useState<string | undefined>();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const { mutate: createRecipe, isPending } = useCreateRecipe();
  const formTitleId = React.useId();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null);

    // Reset errors and validate
    let currentTitleError: string | undefined;
    let currentRecipeError: string | undefined;
    let isValid = true;

    if (!title.trim()) {
      currentTitleError = "Title is required.";
      isValid = false;
    }
    if (isEditorContentEmpty(editorContentHtml)) {
      currentRecipeError = "Recipe content cannot be empty.";
      isValid = false;
    }

    setTitleError(currentTitleError);
    setRecipeError(currentRecipeError);

    if (!isValid) return;

    createRecipe(
      { title: title.trim(), data: editorContentHtml, tags: [], imageURL: "" },
      {
        onSuccess: (data) => {
          if (data?.recipeId) {
            router.push(`/recipes/${data.recipeId}`);
          } else {
            console.warn("Recipe created, but no recipeId received:", data);
            setApiError("Recipe created, but failed to redirect.");
          }
        },
        onError: (error) => {
          console.error("Recipe creation API error:", error);
          setApiError(
            error instanceof Error ? error.message : "Unknown creation error."
          );
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      <form
        aria-labelledby={formTitleId}
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate
      >
        <Text as="h1" size={800} weight="semibold" block id={formTitleId}>
          Create a Recipe
        </Text>

        {apiError && (
          <MessageBar intent="error">
            <MessageBarBody>{apiError}</MessageBarBody>
          </MessageBar>
        )}

        <Field label="Title" required {...getValidationProps(titleError)}>
          <Input
            autoFocus
            value={title}
            placeholder="Recipe name"
            onChange={(_ev, data) => {
              setTitle(data.value);
              if (titleError) setTitleError(undefined);
              if (apiError) setApiError(null);
            }}
            disabled={isPending}
          />
        </Field>

        <Field
          label="Recipe Content"
          required
          {...getValidationProps(recipeError)}
        >
          <TiptapEditor
            value={editorContentHtml}
            onChange={(htmlContent) => {
              setEditorContentHtml(htmlContent);
              if (recipeError) setRecipeError(undefined);
              if (apiError) setApiError(null);
            }}
            placeholder="Enter ingredients and instructions..."
            readOnly={isPending}
          />
        </Field>
        <div className={styles.submitContainer}>
          <Button type="submit" appearance="primary" disabled={isPending}>
            {isPending ? "Creating..." : "Create Recipe"}
          </Button>
          {isPending && <Spinner size="tiny" aria-label="Creating recipe" />}
        </div>
      </form>
    </div>
  );
}
