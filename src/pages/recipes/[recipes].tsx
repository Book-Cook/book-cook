import { useRouter } from "next/router";
import { MarkdownParser, FallbackScreen, Display } from "../../components";
import {
  tokens,
  Divider,
  Text,
  Button,
  Tooltip,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipe, useDeleteRecipe } from "../../clientToServer";
import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DeleteRegular, EditRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  pageContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    ...shorthands.padding("20px", "16px", "40px"),
  },
  recipeCard: {
    maxWidth: "840px",
    width: "100%",
    marginBottom: "100px",
    ...shorthands.padding("0", "0", "30px"),
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap("30px"),
    backgroundColor: "white",
    ...shorthands.borderRadius("12px"),
    boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 20px",
    overflow: "hidden",
  },
  topSection: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: "30px",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
  imageContainer: {
    width: "45%",
    height: "350px",
    position: "relative",
    "@media (max-width: 768px)": {
      width: "100%",
      height: "300px",
      marginBottom: "20px",
    },
  },
  recipeImage: {
    objectFit: "cover",
    borderRadius: "8px",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "30px",
    padding: "20px 30px",
    "@media (max-width: 768px)": {
      padding: "0 30px",
    },
  },
  headerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    margin: 0,
    fontWeight: "600",
    fontFamily: "'Georgia', serif",
  },
  actionButtons: {
    display: "flex",
    ...shorthands.gap("10px"),
  },
  date: {
    color: tokens.colorNeutralForeground3,
    marginTop: "4px",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    ...shorthands.gap("8px"),
    marginTop: "8px",
  },
  tag: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius("20px"),
    ...shorthands.padding("6px", "12px"),
    fontSize: "0.875rem",
    color: tokens.colorNeutralForeground2,
    display: "inline-block",
  },
  recipeContent: {
    lineHeight: "1.6",
    fontSize: "16px",
    fontFamily: "'Georgia', serif",
    "& h2": {
      marginTop: "30px",
      marginBottom: "15px",
      fontWeight: "600",
      borderBottom: "1px solid #eee",
      paddingBottom: "8px",
    },
    "& ul, & ol": {
      paddingLeft: "25px",
      margin: "15px 0",
    },
    "& li": {
      marginBottom: "10px",
      position: "relative",
    },
    "& p": {
      margin: "15px 0",
    },
  },
  divider: {
    margin: "10px 0",
  },
});

export default function Recipes() {
  const styles = useStyles();
  const router = useRouter();
  const { mutate: deleteMutate } = useDeleteRecipe();
  const { recipes } = router.query;

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipes],
    queryFn: () => fetchRecipe(recipes as string),
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
    if (recipe?._id) {
      router.push(`/edit/${recipe._id}`);
    }
  };

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
          {recipe?.imageURL && (
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
          )}

          <div className={styles.contentContainer}>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={styles.headerSection}
            >
              <div className={styles.titleRow}>
                <Display as="h1" className={styles.title}>
                  {recipe?.title}
                </Display>
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
              </div>

              {recipe?.createdAt && (
                <Text size={200} italic className={styles.date}>
                  {new Date(recipe.createdAt).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              )}

              <div className={styles.tagsContainer}>
                {recipe?.tags?.map((tag, index) => (
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
                ))}
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
              {recipe?.data && (
                <div className={styles.recipeContent}>
                  <MarkdownParser markdownInput={recipe.data} />
                </div>
              )}
            </FallbackScreen>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
