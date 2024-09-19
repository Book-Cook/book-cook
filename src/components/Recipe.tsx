import { useQuery } from '@tanstack/react-query';

interface Recipe {
  title: string;
  createdAt: string;
  data: string;
}

// Specify the type for `recipeId` parameter, assuming it's a string
function RecipeComponent({ recipeId }: { recipeId: string }) {
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: async () => {
      // console.log("recipe id " + recipeId)
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <h1>{recipe?.title}</h1>
      <p>{recipe?.createdAt}</p>
      <p>{recipe?.data}</p> {/* Safely access `data` using optional chaining */}
    </div>
  );
}

export default RecipeComponent;
