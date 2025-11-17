import dynamic from "next/dynamic";

const RecipePage = dynamic(
  () =>
    import("../../components/RecipePage").then((mod) => ({
      default: mod.RecipePage,
    })),
  {
    loading: () => null,
    ssr: true,
  }
);

export default function Recipes() {
  return <RecipePage />;
}
