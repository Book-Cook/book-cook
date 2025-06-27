import type { Recipe } from "../../../clientToServer/types";

export const caesarSalad: Recipe = {
  _id: "recipe_003",
  title: "Fresh Caesar Salad",
  data: `
## Ingredients
### For the Salad
- 1 large romaine lettuce head, washed and chopped
- ½ cup parmesan cheese, freshly grated
- ¼ cup homemade croutons
- 2 tbsp capers (optional)

### For the Dressing
- 2 anchovy fillets, minced
- 2 garlic cloves, minced
- 1 egg yolk (pasteurized)
- 2 tbsp fresh lemon juice
- 1 tsp Dijon mustard
- ¼ cup extra virgin olive oil
- Salt and freshly ground black pepper to taste

## Instructions
1. **Prepare the dressing:**
   - In a small bowl, mash anchovies and garlic into a paste
   - Whisk in egg yolk, lemon juice, and Dijon mustard
   - Slowly drizzle in olive oil while whisking constantly
   - Season with salt and pepper to taste

2. **Prepare the salad:**
   - Wash and thoroughly dry romaine lettuce
   - Chop into bite-sized pieces
   - Place in a large salad bowl

3. **Assemble:**
   - Drizzle dressing over lettuce
   - Toss gently to coat all leaves
   - Add croutons and most of the parmesan
   - Toss again lightly
   - Top with remaining parmesan and capers
   - Serve immediately

## Notes
- For food safety, use pasteurized eggs or egg substitute
- Make croutons fresh for best results
- Dressing can be made ahead and stored for 2 days
- Add grilled chicken or shrimp for a complete meal
  `,
  tags: ["salad", "vegetarian", "healthy", "quick", "classic"],
  emoji: "🥗",
  imageURL: "",
  owner: "user_456",
  isPublic: true,
  createdAt: "2024-03-10T09:45:00.000Z",
};
