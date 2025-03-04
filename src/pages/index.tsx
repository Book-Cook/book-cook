import * as React from "react";
import { makeStyles, shorthands } from "@griffel/react";
import {
  Button,
  Text,
  Title3,
  LargeTitle,
  Card,
  CardPreview,
  tokens,
  CardHeader,
  Body1,
} from "@fluentui/react-components";
import {
  ArrowRight24Regular,
  Star24Regular,
  SparkleRegular,
  ClockRegular,
  CollectionsRegular,
} from "@fluentui/react-icons";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { Toolbar } from "../components/Toolbar/Toolbar";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    boxSizing: "border-box",
    ...shorthands.overflow("hidden"),
  },

  // Hero section
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    minHeight: "90vh",
    position: "relative",
    ...shorthands.padding("80px", "20px"),
    backgroundColor: tokens.colorNeutralBackground1,
  },

  heroContent: {
    maxWidth: "1200px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 2,
  },

  heading: {
    fontSize: "64px",
    lineHeight: 1.1,
    fontWeight: "800",
    marginBottom: "20px",
    background: "linear-gradient(135deg, #9272e6 0%, #6943d1 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textAlign: "center",
    maxWidth: "800px",
  },

  subHeading: {
    fontSize: "20px",
    lineHeight: 1.6,
    color: tokens.colorNeutralForeground2,
    marginBottom: "40px",
    maxWidth: "600px",
    textAlign: "center",
  },

  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginTop: "20px",
  },

  primaryButton: {
    backgroundColor: "#9272e6",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    height: "48px",
    ...shorthands.padding("0", "28px"),
    ...shorthands.borderRadius("24px"),
    transition: "all 0.3s ease",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 15px rgba(146, 114, 230, 0.2)",
    },
  },

  secondaryButton: {
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
    fontSize: "16px",
    fontWeight: "600",
    height: "48px",
    ...shorthands.padding("0", "28px"),
    ...shorthands.borderRadius("24px"),
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: tokens.colorNeutralBackground2,
      transform: "translateY(-2px)",
    },
  },

  // Featured recipes section
  featuredSection: {
    ...shorthands.padding("80px", "20px"),
    backgroundColor: tokens.colorNeutralBackground2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "48px",
    textAlign: "center",
  },

  recipesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
    width: "100%",
    maxWidth: "1200px",
  },

  recipeCard: {
    transition: "all 0.3s ease",
    cursor: "pointer",
    ":hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
    },
  },

  cardImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    ...shorthands.borderRadius("8px"),
  },

  // Features section
  featuresSection: {
    ...shorthands.padding("100px", "20px"),
    backgroundColor: tokens.colorNeutralBackground1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "40px",
    maxWidth: "1200px",
    width: "100%",
  },

  featureItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    ...shorthands.padding("20px"),
  },

  featureIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80px",
    height: "80px",
    ...shorthands.borderRadius("40px"),
    backgroundColor: "rgba(146, 114, 230, 0.1)",
    marginBottom: "24px",
    color: "#9272e6",
    fontSize: "32px",
    transition: "transform 0.3s ease",
    ":hover": {
      transform: "scale(1.1)",
    },
  },

  featureTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
  },

  featureDesc: {
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.6,
  },

  // CTA section
  ctaSection: {
    backgroundColor: "#9272e6",
    color: "white",
    ...shorthands.padding("80px", "20px"),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  ctaTitle: {
    fontSize: "40px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "white",
  },

  ctaDesc: {
    fontSize: "18px",
    marginBottom: "40px",
    maxWidth: "600px",
    lineHeight: 1.6,
  },

  ctaButton: {
    backgroundColor: "white",
    color: "#9272e6",
    fontSize: "18px",
    fontWeight: "600",
    height: "52px",
    ...shorthands.padding("0", "32px"),
    ...shorthands.borderRadius("26px"),
    transition: "all 0.3s ease",
    ":hover": {
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
    },
  },

  // Decorative elements
  floatingBubble: {
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "rgba(146, 114, 230, 0.1)",
    zIndex: 1,
  },

  heroImageContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "1000px",
    height: "400px",
    marginTop: "40px",
  },
});

// Mock data for featured recipes
const featuredRecipes = [
  {
    id: 1,
    title: "Classic Chocolate Cake",
    time: "45 min",
    rating: 4.8,
    image: "/images/chocolate-cake.jpg",
  },
  {
    id: 2,
    title: "Fresh Summer Salad",
    time: "15 min",
    rating: 4.5,
    image: "/images/summer-salad.jpg",
  },
  {
    id: 3,
    title: "Homemade Pasta",
    time: "60 min",
    rating: 4.9,
    image: "/images/homemade-pasta.jpg",
  },
];

// Animation variants for Framer Motion
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  const styles = useStyles();
  const router = useRouter();

  // Replace with actual images for production
  const placeholderImages = featuredRecipes.map(
    (recipe) => `/placeholder-${recipe.id}.jpg`
  );

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Decorative animated elements */}
        <motion.div
          className={styles.floatingBubble}
          style={{ top: "10%", left: "10%", width: "300px", height: "300px" }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className={styles.floatingBubble}
          style={{
            bottom: "15%",
            right: "10%",
            width: "200px",
            height: "200px",
          }}
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heading}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Cook with Confidence, Create with Joy
          </motion.h1>

          <motion.p
            className={styles.subHeading}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover, save, and create delicious recipes from around the world.
            Your personal cookbook, reimagined for the digital age.
          </motion.p>

          <motion.div
            className={styles.buttonGroup}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
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
          </motion.div>

          <motion.div
            className={styles.heroImageContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Replace with your hero image */}
            <Image
              src="/hero-image.jpg"
              alt="Delicious food display"
              fill
              style={{ objectFit: "cover", borderRadius: "16px" }}
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className={styles.featuredSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          Featured Recipes
        </motion.h2>

        <motion.div
          className={styles.recipesGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featuredRecipes.map((recipe, index) => (
            <motion.div key={recipe.id} variants={fadeIn}>
              <Card
                className={styles.recipeCard}
                onClick={() => router.push(`/recipes/${recipe.id}`)}
              >
                <CardPreview>
                  <Image
                    src={placeholderImages[index]}
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
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Button
            className={styles.primaryButton}
            style={{ marginTop: "40px" }}
            onClick={() => router.push("/recipes")}
          >
            View All Recipes
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          Why Choose Book Cook
        </motion.h2>

        <motion.div
          className={styles.featuresGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div className={styles.featureItem} variants={fadeIn}>
            <div className={styles.featureIcon}>
              <SparkleRegular />
            </div>
            <h3 className={styles.featureTitle}>Smart Recommendations</h3>
            <p className={styles.featureDesc}>
              Discover new recipes tailored to your taste preferences and
              cooking history.
            </p>
          </motion.div>

          <motion.div className={styles.featureItem} variants={fadeIn}>
            <div className={styles.featureIcon}>
              <CollectionsRegular />
            </div>
            <h3 className={styles.featureTitle}>Organized Collections</h3>
            <p className={styles.featureDesc}>
              Create custom collections to organize your favorite recipes by
              occasion, cuisine, or diet.
            </p>
          </motion.div>

          <motion.div className={styles.featureItem} variants={fadeIn}>
            <div className={styles.featureIcon}>
              <ClockRegular />
            </div>
            <h3 className={styles.featureTitle}>Time-Saving Tools</h3>
            <p className={styles.featureDesc}>
              Meal planning, shopping lists, and cooking timers all in one place
              to streamline your cooking.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        className={styles.ctaSection}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className={styles.ctaTitle}>
          Ready to Start Your Culinary Journey?
        </h2>
        <p className={styles.ctaDesc}>
          Join thousands of food enthusiasts creating and sharing amazing
          recipes every day.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className={styles.ctaButton}
            onClick={() => router.push("/newRecipe")}
          >
            Create Your First Recipe
          </Button>
        </motion.div>
      </motion.section>
    </div>
  );
}
