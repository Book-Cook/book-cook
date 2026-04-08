import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const RecipePage = dynamic(
  () =>
    import("../../components/RecipePage").then((mod) => ({
      default: mod.RecipePage,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

export default function Recipes() {
  return <RecipePage />;
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
