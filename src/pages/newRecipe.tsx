import * as React from "react";
import { Field, Input, Textarea, Button } from "@fluentui/react-components";
import { Display } from "../components";
import { useCreateRecipe } from "../clientToServer";

export default function NewRecipe() {
  const [title, setTitle] = React.useState("");
  const [recipe, setRecipe] = React.useState("");
  const { mutate, isError, error } = useCreateRecipe();

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!title || !recipe) {
      alert("Please provide both a title and recipe content.");
      return;
    }

    mutate(
      { title, data: recipe, tags: [], imageURL: "" },
      {
        onSuccess: () => {
          alert("Recipe created successfully!");
          setTitle("");
          setRecipe("");
        },
        onError: (err) => {
          if (err instanceof Error) {
            alert(`Failed to create recipe: ${err.message}`);
          }
        },
      }
    );
  };

  return (
    <div
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        marginTop: "20px",
      }}
    >
      <form
        title="Create a recipe"
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          maxWidth: "500px",
          gap: "15px",
        }}
        onSubmit={handleSubmit}
      >
        <Display>Create a recipe</Display>
        <Field label="Title">
          <Input
            value={title}
            placeholder="Enter the name of your recipe"
            onChange={(_ev, data) => setTitle(data.value)}
          />
        </Field>
        <Field label="Recipe">
          <Textarea
            value={recipe}
            placeholder="Enter the recipe description"
            onChange={(_ev, data) => setRecipe(data.value)}
          />
        </Field>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
}
