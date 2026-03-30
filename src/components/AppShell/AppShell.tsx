import { useEffect, useState } from "react";
import { BookOpenIcon, ListIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import styles from "./AppShell.module.css";
import { RecipeSearchFlyout } from "../RecipeSearchFlyout";
import { AppSidebar } from "../Sidebar";

import { fetchRecentlyViewed } from "../../clientToServer/fetch/fetchRecentlyViewed";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const profileEmail = session?.user?.email ?? undefined;

  const { data: recentRecipes = [] } = useQuery({
    queryKey: ["recentlyViewed", profileEmail],
    queryFn: fetchRecentlyViewed,
    enabled: Boolean(session),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleSearch = (): void => {
    setDrawerOpen(false);
    setIsSearchOpen(true);
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
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  if (!session) {
    return children as React.ReactElement;
  }

  return (
    <div className={styles.shell}>
      <RecipeSearchFlyout
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        recentRecipes={recentRecipes}
      />

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
        <button
          className={styles.mobileMenuBtn}
          onClick={handleSearch}
          aria-label="Search recipes"
        >
          <MagnifyingGlassIcon size={20} />
        </button>
      </header>

      {/* Backdrop */}
      <div
        className={styles.backdrop}
        data-open={drawerOpen ? "true" : "false"}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar — normal on desktop, drawer on mobile */}
      <div className={styles.sidebarWrap} data-open={drawerOpen ? "true" : "false"}>
        <AppSidebar forceExpanded={isMobile} isMobile={isMobile} onSearch={handleSearch} />
      </div>

      <main className={styles.main}>{children}</main>
    </div>
  );
};
