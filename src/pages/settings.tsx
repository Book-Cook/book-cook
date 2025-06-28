import dynamic from "next/dynamic";

const SettingsPage = dynamic(() => import("../components/Settings").then((mod) => ({ default: mod.SettingsPage })), {
  loading: () => <div style={{ padding: "32px", textAlign: "center" }}>Loading settings...</div>,
  ssr: false,
});

export default function Settings() {
  return <SettingsPage />;
}
