import { Spinner } from "@fluentui/react-components";
import dynamic from "next/dynamic";

const UnifiedRecipeGallery = dynamic(() => import("src/components/UnifiedRecipeGallery/UnifiedRecipeGallery").then(mod => ({ default: mod.UnifiedRecipeGallery })), {
  loading: () => <Spinner label="Loading recipes..." />,
  ssr: true
});

export default function Recipes() {
  return <UnifiedRecipeGallery />;
}
