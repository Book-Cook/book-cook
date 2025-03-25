import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import { Button, Title1, Text, tokens } from "@fluentui/react-components";
import { useRouter } from "next/router";
import { RecentRecipesCarousel, RecentRecipe } from "../RecipeCarousel";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
    gap: "48px",
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
  sectionContainer: {
    width: "100%",
  },
});

const mockRecentRecipes: RecentRecipe[] = [
  {
    id: "1",
    title: "Homemade Margherita Pizza",
    tags: ["Italian", "Dinner", "Vegetarian"],
    createdDate: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Creamy Mushroom Risotto",
    tags: ["Italian", "Comfort Food", "Vegetarian"],
    createdDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: "3",
    title: "Avocado Toast with Poached Eggs",
    tags: ["Breakfast", "Healthy", "Quick"],
    createdDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: "4",
    title: "Chicken Tikka Masala",
    tags: ["Indian", "Dinner", "Spicy"],
    createdDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
  {
    id: "5",
    title: "Fresh Spring Rolls",
    tags: ["Vietnamese", "Appetizer", "Healthy"],
    createdDate: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  },
  {
    id: "6",
    title: "Berry Smoothie Bowl",
    tags: ["Breakfast", "Vegan", "Healthy"],
    createdDate: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
  },
];

const HomePage = () => {
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
      {/* Recently Viewed Recipes Carousel */}
      <div className={styles.sectionContainer}>
        <RecentRecipesCarousel recipes={mockRecentRecipes} />
      </div>
    </div>
  );
};

export default HomePage;
