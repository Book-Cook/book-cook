import { useEffect, useState } from "react";
import { BookOpenIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import styles from "./AppShell.module.css";
import { AppSidebar } from "../Sidebar";

import { useMediaQuery } from "../../hooks/useMediaQuery";

export type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Opens an unsaved draft; the recipe is only created on its first Save.
  const handleNewRecipe = (): void => {
    setDrawerOpen(false);
    void router.push("/recipes/new");
  };

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [router.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (!session) {
    return children as React.ReactElement;
  }

  return (
    <div className={styles.shell}>
      {/* Mobile top header — hidden on desktop via CSS */}
      <header className={styles.mobileHeader}>
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setDrawerOpen((o) => !o)}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
        >
          {drawerOpen ? <XIcon size={20} /> : <ListIcon size={20} />}
        </button>
        <Link href="/recipes" className={styles.mobileLogo}>
          <span className={styles.mobileLogoIcon}>
            <BookOpenIcon size={14} weight="fill" />
          </span>
          <span className={styles.mobileLogoText}>Book Cook</span>
        </Link>
        {/* Mirrors the menu button so the logo stays centred */}
        <span className={styles.mobileHeaderSpacer} aria-hidden="true" />
      </header>

      {/* Backdrop */}
      <div
        className={styles.backdrop}
        data-open={drawerOpen && !profileMenuOpen ? "true" : "false"}
        onClick={() => {
          if (!profileMenuOpen) {
            setDrawerOpen(false);
          }
        }}
        aria-hidden="true"
      />

      {/* Sidebar — normal on desktop, drawer on mobile */}
      <div
        className={styles.sidebarWrap}
        data-open={drawerOpen ? "true" : "false"}
      >
        <AppSidebar
          forceExpanded={isMobile}
          onNewRecipe={handleNewRecipe}
          onMenuOpenChange={setProfileMenuOpen}
        />
      </div>

      <main className={styles.main}>{children}</main>
    </div>
  );
};
