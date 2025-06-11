import * as React from "react";
import {
  Dropdown,
  Option,
  Title2,
  Button,
  Card,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { useQuery } from "@tanstack/react-query";

import { fetchAllRecipes } from "src/clientToServer";
import { RecipeCard } from "../components/RecipeCard";
import { useStyles as galleryStyles } from "../components/RecipeGallery/RecipeGallery.styles";

const useMealPlanStyles = makeStyles({
  container: { maxWidth: "1200px", margin: "0 auto", padding: "20px" },
  dayRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: tokens.spacingVerticalM,
  },
  dayLabel: { width: "120px" },
  dropdown: { maxWidth: "400px" },
  actions: { marginTop: tokens.spacingVerticalL },
});

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MealPlanPage() {
  const styles = useMealPlanStyles();
  const recipeGalleryStyles = galleryStyles();
  const { data: recipes } = useQuery({
    queryKey: ["allRecipes"],
    queryFn: () => fetchAllRecipes("", "dateNewest", []),
  });

  const [mealPlan, setMealPlan] = React.useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mealPlan");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  React.useEffect(() => {
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  const handleSelect = (day: string, recipeId: string) => {
    setMealPlan((prev) => ({ ...prev, [day]: recipeId }));
  };

  const clearPlan = () => {
    setMealPlan({});
  };

  return (
    <div className={styles.container}>
      <Title2 as="h1" style={{ marginBottom: tokens.spacingVerticalL }}>
        Weekly Meal Plan
      </Title2>
      <Card>
        {daysOfWeek.map((day) => (
          <div key={day} className={styles.dayRow}>
            <div className={styles.dayLabel}>{day}</div>
            <Dropdown
              className={styles.dropdown}
              value={recipes?.find((r) => r._id === mealPlan[day])?.title ?? ""}
              selectedOptions={mealPlan[day] ? [mealPlan[day]] : []}
              onOptionSelect={(_, data) =>
                handleSelect(day, data.optionValue as string)
              }
            >
              {recipes?.map((recipe) => (
                <Option key={recipe._id} value={recipe._id}>
                  {recipe.title}
                </Option>
              ))}
            </Dropdown>
          </div>
        ))}
        <div className={styles.actions}>
          <Button appearance="secondary" onClick={clearPlan}>
            Clear Plan
          </Button>
        </div>
      </Card>
      {Object.keys(mealPlan).length > 0 && (
        <>
          <Title2 as="h2" style={{ margin: `${tokens.spacingVerticalL} 0` }}>
            Selected Recipes
          </Title2>
          <div className={recipeGalleryStyles.grid}>
            {daysOfWeek.map((day, index) => {
              const recipe = recipes?.find((r) => r._id === mealPlan[day]);
              return (
                recipe && (
                  <div
                    key={day}
                    className={`${recipeGalleryStyles.fadeIn} ${recipeGalleryStyles.cardWrapper}`}
                    style={
                      {
                        "--fadeInDelay": `${Math.min(index * 0.1, 0.3)}s`,
                      } as React.CSSProperties
                    }
                  >
                    <RecipeCard
                      title={recipe.title}
                      id={recipe._id}
                      emoji={recipe.emoji || ""}
                      createdDate={
                        recipe.createdAt &&
                        new Date(recipe.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      }
                      imageSrc={recipe.imageURL}
                      tags={recipe.tags}
                    />
                  </div>
                )
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
