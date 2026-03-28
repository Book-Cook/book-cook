import type { Recipe } from "../../../clientToServer/types";

export const chocolateChipCookies: Recipe = {
  _id: "recipe_001",
  title: "Classic Chocolate Chip Cookies",
  data: `
## Ingredients
- 2¼ cups all-purpose flour
- 1 tsp baking soda
- 1 tsp salt
- 1 cup butter, softened
- ¾ cup granulated sugar
- ¾ cup packed brown sugar
- 2 large eggs
- 2 tsp vanilla extract
- 2 cups chocolate chips

## Instructions
1. Preheat oven to 375°F (190°C)
2. Mix flour, baking soda and salt in bowl
3. Beat butter and sugars until creamy
4. Add eggs and vanilla; beat well
5. Gradually blend in flour mixture
6. Stir in chocolate chips
7. Drop by rounded tablespoons onto ungreased cookie sheets
8. Bake 9-11 minutes or until golden brown

## Notes
- For chewier cookies, slightly underbake
- Store in airtight container for up to 1 week
- Dough can be frozen for up to 3 months
  `,
  tags: ["dessert", "cookies", "chocolate", "baking"],
  emoji: "🍪",
  imageURL: "",
  owner: "user_123",
  isPublic: true,
  createdAt: "2024-01-15T10:30:00.000Z",
};
