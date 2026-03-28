import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import {
  PaintBrushIcon,
  ForkKnifeIcon,
  UserIcon,
  UsersIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import styles from "./Settings.module.css";
import { useTheme } from "../Theme/ThemeProvider";
import { Avatar } from "../Avatar";

/* ── Helpers ────────────────────────────────────────────── */

function SettingItem({
  label,
  description,
  children,
  fullWidth = false,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`${styles.settingItem} ${fullWidth ? styles.settingItemFullWidth : ""}`}>
      <div className={styles.settingInfo}>
        <div className={styles.settingLabel}>{label}</div>
        <div className={styles.settingDescription}>{description}</div>
      </div>
      <div className={fullWidth ? styles.settingControlFullWidth : styles.settingControl}>
        {children}
      </div>
    </div>
  );
}

function Section({
  value,
  title,
  icon,
  children,
}: {
  value: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Accordion.Item value={value} className={styles.accordionItem}>
      <Accordion.Header>
        <Accordion.Trigger className={styles.accordionTrigger}>
          <span className={styles.triggerIcon}>{icon}</span>
          <span className={styles.triggerLabel}>{title}</span>
          <CaretDownIcon size={14} className={styles.chevron} aria-hidden />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className={styles.accordionContent}>
        <div className={styles.accordionInner}>{children}</div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

/* ── Appearance Section ─────────────────────────────────── */

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <Section value="appearance" title="Appearance" icon={<PaintBrushIcon size={18} />}>
      <SettingItem
        label="Theme"
        description="Choose the application theme."
      >
        <div className={styles.radioGroup}>
          {(["light", "dark"] as const).map((t) => (
            <button
              key={t}
              className={`${styles.radioBtn} ${theme === t ? styles.radioBtnActive : ""}`}
              onClick={() => setTheme?.(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </SettingItem>
    </Section>
  );
}

/* ── Recipe Preferences Section ─────────────────────────── */

function RecipePreferencesSection() {
  const [defaultServings, setDefaultServings] = React.useState(4);
  const [measurementUnit, setMeasurementUnit] = React.useState("us");

  return (
    <Section value="recipe-preferences" title="Recipe Preferences" icon={<ForkKnifeIcon size={18} />}>
      <SettingItem
        label="Default Measurement System"
        description="Choose your preferred measurement system for recipes."
      >
        <select
          className={styles.select}
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
        >
          <option value="us">US Customary (cups, oz)</option>
          <option value="metric">Metric (g, ml)</option>
          <option value="both">Show Both</option>
        </select>
      </SettingItem>
      <SettingItem
        label="Default Servings"
        description="Default number of servings for new recipes."
      >
        <div className={styles.sliderRow}>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={defaultServings}
            onChange={(e) => setDefaultServings(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.sliderValue}>{defaultServings}</span>
        </div>
      </SettingItem>
    </Section>
  );
}

/* ── Sharing Section ────────────────────────────────────── */

function SharingSection() {
  const [shareEmail, setShareEmail] = React.useState("");
  const [sharedUsers] = React.useState<string[]>([]);
  const [isSharing, setIsSharing] = React.useState(false);

  const handleShare = async () => {
    if (!shareEmail) return;
    setIsSharing(true);
    // TODO: wire up sharing API
    await new Promise((r) => setTimeout(r, 500));
    setIsSharing(false);
    setShareEmail("");
  };

  return (
    <Section value="sharing" title="Sharing" icon={<UsersIcon size={18} />}>
      <SettingItem
        label="Share with Another User"
        description="Enter an email address to share your recipe book."
        fullWidth
      >
        <div className={styles.shareRow}>
          <input
            className={styles.shareInput}
            type="email"
            placeholder="user@example.com"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            disabled={isSharing}
          />
          <button
            className={styles.btn}
            onClick={handleShare}
            disabled={!shareEmail || isSharing}
          >
            {isSharing ? "Sharing…" : "Share"}
          </button>
        </div>
        <div className={styles.sharedUsersList}>
          {sharedUsers.length === 0 ? (
            <div className={styles.emptyState}>
              {"You haven't shared your recipes with anyone yet."}
            </div>
          ) : (
            sharedUsers.map((email) => (
              <div key={email} className={styles.sharedUserItem}>
                <div className={styles.sharedUserInfo}>
                  <Avatar name={email.split("@")[0]} size="sm" />
                  {email}
                </div>
                <button className={`${styles.btn} ${styles.btnDanger}`}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </SettingItem>
    </Section>
  );
}

/* ── Account Section ────────────────────────────────────── */

function AccountSection() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isClearing, setIsClearing] = React.useState(false);

  const handleClearRecents = async () => {
    if (!confirm("Clear your recently viewed recipes?")) return;
    setIsClearing(true);
    try {
      await fetch("/api/recentlyViewed", { method: "DELETE" });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Section value="account" title="Account" icon={<UserIcon size={18} />}>
      <SettingItem
        label="Profile"
        description="Your account details."
      >
        {user && (
          <div className={styles.profileRow}>
            <Avatar name={user.name ?? "Account"} imageURL={user.image ?? undefined} size="sm" />
            <div className={styles.profileDetails}>
              <div className={styles.profileName}>{user.name}</div>
              <div className={styles.profileEmail}>{user.email}</div>
            </div>
          </div>
        )}
      </SettingItem>
      <SettingItem
        label="Recently Viewed"
        description="Remove all recipes from your recently viewed list."
      >
        <button
          className={styles.btn}
          onClick={handleClearRecents}
          disabled={isClearing}
        >
          {isClearing ? "Clearing…" : "Clear History"}
        </button>
      </SettingItem>
      <SettingItem
        label="Sign Out"
        description="Log out of your Book Cook account."
      >
        <button
          className={styles.btn}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </button>
      </SettingItem>
      <SettingItem
        label="Danger Zone"
        description=""
      >
        <div className={styles.dangerZone}>
          <p className={styles.dangerTitle}>Delete Account</p>
          <p className={styles.dangerDescription}>
            Permanently delete your account and all data. This cannot be undone.
          </p>
          <button
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={() => alert("Account deletion is not yet available.")}
          >
            Delete Account
          </button>
        </div>
      </SettingItem>
    </Section>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export const SettingsPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Settings</h1>
        <p className={styles.pageSubtitle}>Manage your account and application preferences</p>
      </div>
      <Accordion.Root
        type="multiple"
        defaultValue={["appearance", "recipe-preferences", "sharing", "account"]}
        className={styles.accordion}
      >
        <AppearanceSection />
        <RecipePreferencesSection />
        <SharingSection />
        <AccountSection />
      </Accordion.Root>
    </div>
  );
};
