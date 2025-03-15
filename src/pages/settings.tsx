import * as React from "react";
import { makeStyles, shorthands, mergeClasses } from "@griffel/react";
import {
  tokens,
  Divider,
  Input,
  Dropdown,
  Option,
  Spinner,
  Button,
} from "@fluentui/react-components";
import { useSession, signOut } from "next-auth/react";
import { Unauthorized } from "../components";

const useStyles = makeStyles({
  page: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "24px",
  },
  card: {
    ...shorthands.padding("24px"),
    ...shorthands.borderRadius("12px"),
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
  },
  settingGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  setting: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
  },
  info: {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
  },
  description: {
    fontSize: "12px",
    color: tokens.colorNeutralForeground2,
  },
  control: {
    width: "250px",
    flexShrink: 0,
    alignSelf: "center",
    "@media (max-width: 710px)": {
      width: "100%",
    },
  },
  signOutButton: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
    alignSelf: "flex-end",
    ":hover": {
      backgroundColor: tokens.colorPaletteRedBackground2,
      color: tokens.colorPaletteRedForeground1,
    },
  },
});

export default function Settings() {
  const styles = useStyles();
  const { data: session, status } = useSession();
  const [defaultServings, setDefaultServings] = React.useState("4");
  const [unitSystem, setUnitSystem] = React.useState("imperial");

  if (status === "loading") return <Spinner label="Loading settings..." />;
  if (!session) return <Unauthorized />;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.section}>
          <h2 className={styles.title}>Recipe Preferences</h2>
          <div className={styles.settingGroup}>
            <div className={styles.setting}>
              <div className={styles.info}>
                <div className={styles.label}>Default Unit System</div>
                <div className={styles.description}>
                  Choose which measurement system to use when viewing and
                  creating recipes
                </div>
              </div>

              <Dropdown
                className={styles.control}
                value={unitSystem === "imperial" ? "US Imperial" : "Metric"}
                appearance="filled-darker"
                onOptionSelect={(_, data) => {
                  setUnitSystem(
                    data.optionValue === "imperial" ? "imperial" : "metric"
                  );
                }}
              >
                <Option value="imperial">US Imperial</Option>
                <Option value="metric">Metric</Option>
              </Dropdown>
            </div>
            <Divider />
            <div className={styles.setting}>
              <div className={styles.info}>
                <div className={styles.label}>Default Servings</div>
                <div className={styles.description}>
                  Set how many servings to use as the default when creating new
                  recipes
                </div>
              </div>

              <Input
                className={styles.control}
                value={defaultServings}
                onChange={(e) => setDefaultServings(e.target.value)}
                type="number"
                min="1"
                appearance="filled-darker"
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.title}>Account Settings</h2>
          <div className={styles.setting}>
            <div className={styles.info}>
              <div className={styles.label}>Sign Out</div>
              <div className={styles.description}>
                End your current session and return to the login screen
              </div>
            </div>
            <Button className={styles.signOutButton} onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
