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
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

import { useStyles } from "./LandingPage.styles";

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
            {/* <Image
              src="/hero-image.jpg"
              alt="Delicious food display"
              fill
              style={{ objectFit: "cover", borderRadius: "16px" }}
              priority
            /> */}
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
          {featuredRecipes.map((recipe) => (
            <motion.div key={recipe.id} variants={fadeIn}>
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
      {!session && (
        <>
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
                  Meal planning and shopping lists all in one place to
                  streamline your cooking.
                </p>
              </motion.div>
            </motion.div>
          </section>
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
              Join others in creating and sharing amazing recipes every day.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className={styles.ctaButton}
                onClick={() => signIn("google")}
              >
                Sign up
              </Button>
            </motion.div>
          </motion.section>
        </>
      )}
    </div>
  );
};

export default LandingPage;
