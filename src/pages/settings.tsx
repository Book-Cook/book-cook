import dynamic from "next/dynamic";

import { LoadingScreen } from "../components/FallbackScreens";

const SettingsPage = dynamic(
  () =>
    import("../components/Settings").then((mod) => ({
      default: mod.SettingsPage,
    })),
  { loading: () => <LoadingScreen />, ssr: false },
);

export const getServerSideProps = () => ({ props: {} });

export default function Settings() {
  return <SettingsPage />;
}
