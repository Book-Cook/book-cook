// Optimized food emoji dataset to reduce bundle size
// This replaces the larger unicode-emoji-json dependency for food-specific use cases

export const FOOD_EMOJIS = {
  // Main dishes
  "🍕": { name: "pizza", category: "food" },
  "🍔": { name: "hamburger", category: "food" },
  "🍟": { name: "french fries", category: "food" },
  "🌭": { name: "hot dog", category: "food" },
  "🥪": { name: "sandwich", category: "food" },
  "🌮": { name: "taco", category: "food" },
  "🌯": { name: "burrito", category: "food" },
  "🥗": { name: "salad", category: "food" },
  "🍝": { name: "pasta", category: "food" },
  "🍜": { name: "noodles", category: "food" },
  "🍲": { name: "soup", category: "food" },
  "🍛": { name: "curry", category: "food" },
  "🍱": { name: "bento", category: "food" },
  "🍚": { name: "rice", category: "food" },
  "🥘": { name: "paella", category: "food" },
  "🍳": { name: "egg", category: "food" },
  
  // Proteins
  "🍗": { name: "chicken", category: "protein" },
  "🍖": { name: "meat", category: "protein" },
  "🥩": { name: "steak", category: "protein" },
  "🐟": { name: "fish", category: "protein" },
  "🍤": { name: "shrimp", category: "protein" },
  "🦀": { name: "crab", category: "protein" },
  "🦞": { name: "lobster", category: "protein" },
  
  // Desserts
  "🍰": { name: "cake", category: "dessert" },
  "🧁": { name: "cupcake", category: "dessert" },
  "🎂": { name: "birthday cake", category: "dessert" },
  "🍪": { name: "cookie", category: "dessert" },
  "🍩": { name: "donut", category: "dessert" },
  "🍫": { name: "chocolate", category: "dessert" },
  "🍬": { name: "candy", category: "dessert" },
  "🍮": { name: "pudding", category: "dessert" },
  "🍨": { name: "ice cream", category: "dessert" },
  "🍦": { name: "soft ice cream", category: "dessert" },
  
  // Beverages
  "☕": { name: "coffee", category: "drink" },
  "🍵": { name: "tea", category: "drink" },
  "🧃": { name: "juice", category: "drink" },
  "🥤": { name: "soda", category: "drink" },
  "🍷": { name: "wine", category: "drink" },
  "🍸": { name: "cocktail", category: "drink" },
  "🍹": { name: "tropical drink", category: "drink" },
  "🍺": { name: "beer", category: "drink" },
  "🥛": { name: "milk", category: "drink" },
  
  // Fruits
  "🍎": { name: "apple", category: "fruit" },
  "🍌": { name: "banana", category: "fruit" },
  "🍊": { name: "orange", category: "fruit" },
  "🍓": { name: "strawberry", category: "fruit" },
  "🫐": { name: "blueberry", category: "fruit" },
  "🍇": { name: "grape", category: "fruit" },
  "🥝": { name: "kiwi", category: "fruit" },
  "🍑": { name: "cherry", category: "fruit" },
  "🥭": { name: "mango", category: "fruit" },
  "🍍": { name: "pineapple", category: "fruit" },
  
  // Vegetables
  "🥕": { name: "carrot", category: "vegetable" },
  "🥬": { name: "lettuce", category: "vegetable" },
  "🥒": { name: "cucumber", category: "vegetable" },
  "🍅": { name: "tomato", category: "vegetable" },
  "🫒": { name: "olive", category: "vegetable" },
  "🌽": { name: "corn", category: "vegetable" },
  "🥔": { name: "potato", category: "vegetable" },
  "🧄": { name: "garlic", category: "vegetable" },
  "🧅": { name: "onion", category: "vegetable" },
  
  // Generic food
  "🍽️": { name: "plate", category: "generic" },
  "🥄": { name: "spoon", category: "generic" },
  "🍴": { name: "fork and knife", category: "generic" },
  "🔥": { name: "fire", category: "cooking" },
} as const;

export const searchFoodEmojis = (keyword: string): string[] => {
  const results: string[] = [];
  const lowerKeyword = keyword.toLowerCase();
  
  for (const [emoji, info] of Object.entries(FOOD_EMOJIS)) {
    if (info.name.includes(lowerKeyword) || info.category.includes(lowerKeyword)) {
      results.push(emoji);
    }
  }
  
  return results;
};

export const getFoodEmojisByCategory = (category: string): string[] => {
  return Object.entries(FOOD_EMOJIS)
    .filter(([, info]) => info.category === category)
    .map(([emoji]) => emoji);
};

export const getDefaultFoodEmojis = (): string[] => {
  return [
    "🍕", "🍔", "🍗", "🍖", "🍛", "🍜", "🍝", "🍲", "🍳", "🥗",
    "🥘", "🌮", "🌯", "🍱", "🍚", "🥟", "🍤", "🍙", "🧁", "🍰",
    "🎂", "🍮", "🍩", "🍪", "🍫", "🍬", "🍷", "🍸", "🍹", "☕",
    "🍵", "🥛", "🍽️"
  ];
};