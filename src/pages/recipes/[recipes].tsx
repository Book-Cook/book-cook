import dynamic from "next/dynamic";

const RecipePage = dynamic(() => import("../../components/RecipePage").then((mod) => ({ default: mod.RecipePage })), {
  loading: () => <div style={{ padding: "32px", textAlign: "center" }}>Loading recipe...</div>,
  ssr: false,
});

export default function Recipes() {
  return <RecipePage />;
}
