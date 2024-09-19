// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("dev");

// Create a new document in the collection.
db.getCollection("recipes").insertOne({
  title: "Chocolate Chip Cookies",
  data: `
  # Chocolate Chip Cookies
  ## Ingredients
  - 2 1/4 cups **all-purpose flour**
  - 1/2 teaspoon **baking soda**
  - 1 cup **unsalted butter**, room temp
  - 1/2 cup **sugar**
  - 1 cup packed **brown sugar**
  - 1 teaspoon **salt**
  - 2 teaspoons **pure vanilla extract**
  - 2 **large eggs**
  - 2 cups **semisweet and/or milk chocolate chips**
  ## Instructions
  1. Preheat oven to 350°F (175°C).
  2. In a small bowl, whisk together flour and baking soda; set aside.
  3. In a large bowl, combine the butter with both sugars; beat on medium speed until light and fluffy.
  4. Reduce speed to low; add the salt, vanilla, and eggs. Beat until well mixed, about 1 minute.
  5. Add flour mixture; mix until just combined.
  6. Stir in the chocolate chips.
  7. Drop heaping tablespoons of dough onto baking sheets.
  8. Bake until cookies are golden around the edges, but still soft in the center, about 8 to 10 minutes.
  9. Let cool on baking sheets for 2 minutes; transfer to a wire rack to cool completely.
  Enjoy your delicious homemade cookies!
  `,
  createdAt: new Date(),
});
