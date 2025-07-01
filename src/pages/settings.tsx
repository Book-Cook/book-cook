import dynamic from "next/dynamic";
import { Spinner } from "@fluentui/react-components";

const SettingsPage = dynamic(() => import("../components/Settings").then(mod => ({ default: mod.SettingsPage })), {
  loading: () => <Spinner label="Loading settings..." />,
  ssr: false
});

export default function Settings() {
  return <SettingsPage />;
}
