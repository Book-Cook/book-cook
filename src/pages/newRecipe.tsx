import * as React from "react";
import { useRouter } from "next/router";
import TurndownService from "turndown";
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
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalM),
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

// Initialize Turndown Service
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
});
// Optional: turndownService.use(gfm);

// Check if editor content is effectively empty
const isEditorContentEmpty = (htmlValue: string | undefined): boolean => {
  if (!htmlValue) return true;
  if (typeof document !== "undefined") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlValue;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.trim().length === 0;
  }
  // Fallback for non-browser
  return htmlValue.replace(/<[^>]*>/g, "").trim().length === 0;
};

export default function NewRecipe() {
  const styles = useStyles();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [editorContentHtml, setEditorContentHtml] = React.useState("");
  const [titleError, setTitleError] = React.useState<string | undefined>();
  const [recipeError, setRecipeError] = React.useState<string | undefined>();
  const [apiError, setApiError] = React.useState<string | null>(null);

  const { mutate, isPending } = useCreateRecipe();
  const formTitleId = React.useId();

  const getValidationProps = (
    error: string | undefined
  ): Pick<FieldProps, "validationMessage" | "validationState"> => {
    return error ? { validationMessage: error, validationState: "error" } : {};
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTitleError(undefined);
    setRecipeError(undefined);
    setApiError(null);

    let isValid = true;
    if (!title.trim()) {
      setTitleError("Title is required.");
      isValid = false;
    }
    if (isEditorContentEmpty(editorContentHtml)) {
      setRecipeError("Recipe content cannot be empty.");
      isValid = false;
    }

    if (!isValid) return;

    let recipeMarkdown: string;
    try {
      // Convert HTML to Markdown before sending
      recipeMarkdown = turndownService.turndown(editorContentHtml);
    } catch (conversionError) {
      console.error("Markdown conversion failed:", conversionError);
      setApiError("Failed to process recipe content.");
      return;
    }

    mutate(
      { title, data: recipeMarkdown, tags: [], imageURL: "" },
      {
        onSuccess: (data) => {
          if (data?.recipeId) {
            router.push(`/recipes/${data.recipeId}`);
          } else {
            setApiError(
              "Recipe created, but could not get ID for redirection."
            );
          }
        },
        onError: (error) => {
          setApiError(
            error instanceof Error
              ? error.message
              : "An unknown error occurred creating the recipe."
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
          {isPending && <Spinner size="tiny" />}
        </div>
      </form>
    </div>
  );
}
