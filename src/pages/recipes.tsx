import dynamic from "next/dynamic";
import { Spinner } from "@fluentui/react-components";

const RecipeGallery = dynamic(() => import("src/components/RecipeGallery/RecipeGallery").then(mod => ({ default: mod.RecipeGallery })), {
  loading: () => <Spinner label="Loading recipes..." />,
  ssr: true
});

export default function Recipes() {
  return <RecipeGallery />;
}
