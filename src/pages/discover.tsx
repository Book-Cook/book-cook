import { Spinner } from "@fluentui/react-components";
import dynamic from "next/dynamic";

const PublicRecipeGallery = dynamic(() => import("src/components/PublicRecipeGallery/PublicRecipeGallery").then(mod => ({ default: mod.PublicRecipeGallery })), {
  loading: () => <Spinner label="Loading recipes..." />,
  ssr: true
});

export default function DiscoverPage() {
  return <PublicRecipeGallery />;
}