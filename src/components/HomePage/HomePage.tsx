import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import { Button, Title1, Text, tokens } from "@fluentui/react-components";
import { useRouter } from "next/router";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
    gap: "48px",
    ...shorthands.padding("0", "12px", "64px"),
  },
  heroSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "24px",
    ...shorthands.padding("48px", "24px"),
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "48px",
    lineHeight: "1.2",
    fontWeight: "600",
  },
  heroSubtitle: {
    maxWidth: "600px",
    color: tokens.colorNeutralForeground2,
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
});

export const HomePage = () => {
  const styles = useStyles();
  const router = useRouter();

  const handleCreateRecipe = () => {
    router.push("/newRecipe");
  };

  const navigateToRecipes = () => {
    router.push("/recipes");
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <Title1 className={styles.heroTitle}>Welcome to BookCook</Title1>
        <Text className={styles.heroSubtitle} size={400}>
          Your personal recipe collection organized in one place. Create,
          discover, and cook with ease.
        </Text>
        <div className={styles.buttonGroup}>
          <Button
            appearance="primary"
            size="large"
            onClick={handleCreateRecipe}
          >
            Create New Recipe
          </Button>
          <Button appearance="outline" size="large" onClick={navigateToRecipes}>
            Browse Your Recipes
          </Button>
        </div>
      </div>
    </div>
  );
};
