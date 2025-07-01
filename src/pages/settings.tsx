import { Spinner } from "@fluentui/react-components";
import dynamic from "next/dynamic";

const SettingsPage = dynamic(() => import("../components/Settings").then(mod => ({ default: mod.SettingsPage })), {
  loading: () => <Spinner label="Loading settings..." />,
  ssr: false
});

export default function Settings() {
  return <SettingsPage />;
}
