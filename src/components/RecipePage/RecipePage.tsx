import { useRouter } from "next/router";
import { MarkdownParser, FallbackScreen, Display } from "..";
import {
  Divider,
  Text,
  Button,
  Tooltip,
  Input,
  Textarea,
} from "@fluentui/react-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRecipe, useDeleteRecipe } from "../../clientToServer";
import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  DeleteRegular,
  EditRegular,
  CheckmarkRegular,
  DismissRegular,
  AddRegular,
  ImageRegular,
} from "@fluentui/react-icons";
import { useStyles } from "./RecipePage.styles";

export const RecipePage = () => {
  const styles = useStyles();
  const router = useRouter();
  const { mutate: deleteMutate } = useDeleteRecipe();
  const { recipes } = router.query;
  const queryClient = useQueryClient();

  // Edit mode state
  const [isEditing, setIsEditing] = React.useState(false);

  // Editable fields state
  const [editableTitle, setEditableTitle] = React.useState("");
  const [editableContent, setEditableContent] = React.useState("");
  const [editableTags, setEditableTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState("");
  const [editableImageURL, setEditableImageURL] = React.useState("");

  // File input ref for image upload
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipes],
    queryFn: () => fetchRecipe(recipes as string),
    enabled: !!recipes,
  });

  // Mutation for updating recipe
  const updateMutation = useMutation({
    mutationFn: async (updatedRecipe: any) => {
      const response = await fetch(`/api/recipes/${recipe?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch the recipe data
      queryClient.invalidateQueries({ queryKey: ["recipe", recipes] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (error instanceof Error) {
        alert(`Failed to update recipe: ${error.message}`);
      }
    },
  });

  const onRecipeDelete = () => {
    if (recipe?._id) {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        deleteMutate(recipe?._id, {
          onSuccess: () => {
            router.push(`/`);
          },
          onError: (error) => {
            if (error instanceof Error) {
              alert(`Failed to delete recipe: ${error.message}`);
            }
          },
        });
      }
    }
  };

  const onEditRecipe = () => {
    setIsEditing(true);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    // Reset editable fields to original values
    setEditableTitle(recipe?.title || "");
    setEditableContent(recipe?.data || "");
    setEditableTags(recipe?.tags || []);
    setEditableImageURL(recipe?.imageURL || "");
  };

  const onSaveEdit = () => {
    if (!editableTitle.trim() || !editableContent.trim()) {
      alert("Title and content are required");
      return;
    }

    updateMutation.mutate({
      title: editableTitle,
      data: editableContent,
      tags: editableTags,
      imageURL: editableImageURL,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "" && !editableTags.includes(newTag.trim())) {
      setEditableTags([...editableTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditableTags(editableTags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a storage service
      // For now, just use a placeholder or URL.createObjectURL
      alert("In a real app, this would upload the image to storage");
      // For demonstration, let's assume we got a URL back
      setEditableImageURL("/placeholder-image.jpg");
    }
  };

  React.useEffect(() => {
    if (recipe) {
      setEditableTitle(recipe.title || "");
      setEditableContent(recipe.data || "");
      setEditableTags(recipe.tags || []);
      setEditableImageURL(recipe.imageURL || "");
    }
  }, [recipe]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.pageContainer}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className={styles.recipeCard}
      >
        <div className={styles.topSection}>
          {isEditing ? (
            <div
              className={styles.imageUploadContainer}
              onClick={() => fileInputRef.current?.click()}
            >
              {editableImageURL ? (
                <div className={styles.imageContainer}>
                  <Image
                    src={editableImageURL}
                    alt="Recipe preview"
                    fill
                    className={styles.recipeImage}
                    sizes="(max-width: 840px) 100vw, 840px"
                  />
                </div>
              ) : (
                <>
                  <ImageRegular fontSize={48} />
                  <Text>Click to upload an image</Text>
                </>
              )}
              <input
                title="Upload recipe image"
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          ) : (
            recipe?.imageURL && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={styles.imageContainer}
              >
                <Image
                  src={recipe.imageURL}
                  alt={recipe.title}
                  fill
                  className={styles.recipeImage}
                  sizes="(max-width: 840px) 100vw, 840px"
                  priority
                />
              </motion.div>
            )
          )}

          <div className={styles.contentContainer}>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={styles.headerSection}
            >
              <div className={styles.titleRow}>
                {isEditing ? (
                  <Input
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className={styles.titleInput}
                    placeholder="Recipe title"
                  />
                ) : (
                  <Display as="h1" className={styles.title}>
                    {recipe?.title}
                  </Display>
                )}

                {isEditing ? (
                  <div className={styles.actionButtons}>
                    <Tooltip content="Save changes" relationship="label">
                      <Button
                        icon={<CheckmarkRegular />}
                        appearance="primary"
                        onClick={onSaveEdit}
                        disabled={updateMutation.isPending}
                      />
                    </Tooltip>
                    <Tooltip content="Cancel editing" relationship="label">
                      <Button
                        icon={<DismissRegular />}
                        appearance="subtle"
                        onClick={onCancelEdit}
                      />
                    </Tooltip>
                  </div>
                ) : (
                  <div className={styles.actionButtons}>
                    <Tooltip content="Edit recipe" relationship="label">
                      <Button
                        icon={<EditRegular />}
                        appearance="subtle"
                        onClick={onEditRecipe}
                      />
                    </Tooltip>
                    <Tooltip content="Delete recipe" relationship="label">
                      <Button
                        icon={<DeleteRegular />}
                        appearance="subtle"
                        onClick={onRecipeDelete}
                      />
                    </Tooltip>
                  </div>
                )}
              </div>

              {recipe?.createdAt && !isEditing && (
                <Text size={200} italic className={styles.date}>
                  {new Date(recipe.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              )}

              <div className={styles.tagsContainer}>
                {isEditing ? (
                  <>
                    {editableTags.map((tag, index) => (
                      <motion.span
                        key={`${tag}-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className={styles.tag}
                        onClick={() => handleRemoveTag(tag)}
                        style={{ cursor: "pointer" }}
                      >
                        {tag} ✕
                      </motion.span>
                    ))}
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className={styles.tagInput}
                      placeholder="Add tag..."
                      onKeyDown={handleTagKeyPress}
                    />
                    <div className={styles.addTagButton} onClick={handleAddTag}>
                      <AddRegular />
                    </div>
                  </>
                ) : (
                  recipe?.tags?.map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.05 }}
                      className={styles.tag}
                    >
                      {tag}
                    </motion.span>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
        <Divider className={styles.divider} />
        <div className={styles.contentContainer}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <FallbackScreen
              isLoading={isLoading}
              isError={Boolean(error)}
              dataLength={recipe?.data?.length}
            >
              {isEditing ? (
                <Textarea
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className={styles.contentTextarea}
                  placeholder="Write your recipe content in markdown..."
                  resize="vertical"
                />
              ) : (
                recipe?.data && (
                  <div className={styles.recipeContent}>
                    <MarkdownParser markdownInput={recipe.data} />
                  </div>
                )
              )}
            </FallbackScreen>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
