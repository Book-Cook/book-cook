import * as React from "react";
import {
  Button,
  Text,
  Card,
  CardPreview,
  CardHeader,
} from "@fluentui/react-components";
import {
  ArrowRight24Regular,
  Star24Regular,
  SparkleRegular,
  ClockRegular,
  CollectionsRegular,
} from "@fluentui/react-icons";
import { FadeIn, ScaleOnHover } from "../Animation";
import { mergeClasses } from "@fluentui/react-components";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

import { useStyles } from "./LandingPage.styles";

// Mock data for featured recipes
const featuredRecipes = [
  {
    id: 1,
    title: "Classic Chocolate Cake",
    time: "45 min",
    rating: 4.8,
    // image: "/images/chocolate-cake.jpg",
  },
  {
    id: 2,
    title: "Fresh Summer Salad",
    time: "15 min",
    rating: 4.5,
    // image: "/images/summer-salad.jpg",
  },
  {
    id: 3,
    title: "Homemade Pasta",
    time: "60 min",
    rating: 4.9,
    // image: "/images/homemade-pasta.jpg",
  },
];

const LandingPage = () => {
  const styles = useStyles();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Decorative animated elements */}
        <div
          className={mergeClasses(styles.floatingBubble, styles.floatLarge)}
          style={{ top: "10%", left: "10%", width: "300px", height: "300px" }}
        />

        <div
          className={mergeClasses(styles.floatingBubble, styles.floatSmall)}
          style={{
            bottom: "15%",
            right: "10%",
            width: "200px",
            height: "200px",
          }}
        />

        <div className={styles.heroContent}>
          <FadeIn up className={styles.heading}>
            Cook with Confidence, Create with Joy
          </FadeIn>

          <FadeIn up delay={0.2} className={styles.subHeading}>
            Discover, save, and create delicious recipes from around the world.
            Your personal cookbook, reimagined for the digital age.
          </FadeIn>

          <FadeIn up delay={0.4} className={styles.buttonGroup}>
            <Button
              className={styles.primaryButton}
              onClick={() => router.push("/recipes")}
              icon={<ArrowRight24Regular />}
              iconPosition="after"
            >
              Browse Recipes
            </Button>
            <Button
              className={styles.secondaryButton}
              onClick={() => router.push("/newRecipe")}
            >
              Create Recipe
            </Button>
          </FadeIn>

          <FadeIn up delay={0.6} className={styles.heroImageContainer}>
            {/* Replace with your hero image */}
            {/* <Image
              src="/hero-image.jpg"
              alt="Delicious food display"
              fill
              style={{ objectFit: "cover", borderRadius: "16px" }}
              priority
            /> */}
          </FadeIn>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className={styles.featuredSection}>
        <FadeIn up className={styles.sectionTitle}>Featured Recipes</FadeIn>

        <div className={styles.recipesGrid}>
          {featuredRecipes.map((recipe) => (
            <FadeIn up key={recipe.id}>
              <Card
                className={styles.recipeCard}
                onClick={() => router.push(`/recipes/${recipe.id}`)}
              >
                <CardPreview>
                  <Image
                    src={""}
                    alt={recipe.title}
                    width={300}
                    height={200}
                    className={styles.cardImage}
                  />
                </CardPreview>
                <CardHeader
                  header={<Text weight="semibold">{recipe.title}</Text>}
                  description={
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <ClockRegular fontSize={14} />
                        {recipe.time}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Star24Regular fontSize={14} />
                        {recipe.rating}
                      </span>
                    </div>
                  }
                />
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn up delay={0.4}>
          <Button
            className={styles.primaryButton}
            style={{ marginTop: "40px" }}
            onClick={() => router.push("/recipes")}
          >
            View All Recipes
          </Button>
        </FadeIn>
      </section>

      {/* Features Section */}
      {!session && (
        <>
          <section className={styles.featuresSection}>
            <FadeIn up className={styles.sectionTitle}>Why Choose Book Cook</FadeIn>

            <div className={styles.featuresGrid}>
              <FadeIn up className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <SparkleRegular />
                </div>
                <h3 className={styles.featureTitle}>Smart Recommendations</h3>
                <p className={styles.featureDesc}>
                  Discover new recipes tailored to your taste preferences and
                  cooking history.
                </p>
              </FadeIn>

              <FadeIn up className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <CollectionsRegular />
                </div>
                <h3 className={styles.featureTitle}>Organized Collections</h3>
                <p className={styles.featureDesc}>
                  Create custom collections to organize your favorite recipes by
                  occasion, cuisine, or diet.
                </p>
              </FadeIn>

              <FadeIn up className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <ClockRegular />
                </div>
                <h3 className={styles.featureTitle}>Time-Saving Tools</h3>
                <p className={styles.featureDesc}>
                  Meal planning and shopping lists all in one place to
                  streamline your cooking.
                </p>
              </FadeIn>
            </div>
          </section>
          <FadeIn className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>
              Ready to Start Your Culinary Journey?
            </h2>
            <p className={styles.ctaDesc}>
              Join others in creating and sharing amazing recipes every day.
            </p>
            <ScaleOnHover scale={1.05} style={{ display: 'inline-block' }}>
              <Button
                className={styles.ctaButton}
                onClick={() => signIn("google")}
              >
                Sign up
              </Button>
            </ScaleOnHover>
          </FadeIn>
        </>
      )}
    </div>
  );
};

export default LandingPage;
