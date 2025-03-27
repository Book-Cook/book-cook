import * as React from "react";
import dynamic from "next/dynamic";
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
  Skeleton,
  SkeletonItem,
} from "@fluentui/react-components";
import "react-quill/dist/quill.snow.css";
import { useCreateRecipe } from "../clientToServer";

const DynamicReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <Skeleton style={{ minHeight: "200px" }}>
      <SkeletonItem />
    </Skeleton>
  ),
});

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
  quillEditor: {
    backgroundColor: tokens.colorNeutralBackground1,
    "> .ql-container": {
      minHeight: "200px",
      fontSize: tokens.fontSizeBase300,
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
    },
    "> .ql-toolbar": {
      ...shorthands.borderColor(tokens.colorNeutralStroke1),
      ...shorthands.borderRadius(
        `${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium} 0 0`
      ),
    },
    "> .ql-container.ql-snow": {
      ...shorthands.borderRadius(
        `0 0 ${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium}`
      ),
    },
  },
  submitContainer: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
});

const turndownService = new TurndownService();

const isQuillEmpty = (htmlValue: string | undefined): boolean => {
  if (!htmlValue) return true;
  const text = htmlValue.replace(/<[^>]*>/g, "").trim();
  return text.length === 0;
};

export default function NewRecipe() {
  const styles = useStyles();
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [recipeHtml, setRecipeHtml] = React.useState("");
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
    if (isQuillEmpty(recipeHtml)) {
      setRecipeError("Recipe content cannot be empty.");
      isValid = false;
    }

    if (!isValid) return;

    const recipeMarkdown = turndownService.turndown(recipeHtml);
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

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
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
          <div className={styles.quillEditor}>
            <DynamicReactQuill
              theme="snow"
              value={recipeHtml}
              onChange={(content) => {
                setRecipeHtml(content);
                if (recipeError) setRecipeError(undefined);
                if (apiError) setApiError(null);
              }}
              modules={quillModules}
              placeholder="Enter ingredients and instructions..."
              readOnly={isPending}
            />
          </div>
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
