import { useEffect, useState } from "react";
import {
  BookOpenIcon,
  ListIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import styles from "./AppShell.module.css";
import { AppSidebar } from "../Sidebar";

import { fetchRecentlyViewed } from "../../clientToServer/fetch/fetchRecentlyViewed";
import { useCreateRecipe } from "../../clientToServer/post/useCreateRecipe";
import { useMediaQuery } from "../../hooks/useMediaQuery";

// A closed Radix dialog renders nothing, so the search flyout contributed
// @radix-ui/react-dialog and its own subtree to the shared _app chunk on every
// route while being invisible until the user opens search. Deferring it leaves
// the server markup byte-identical; the idle preload below keeps opening
// instant, so the bytes are merely moved off the critical path.
const loadSearchFlyout = () => import("../RecipeSearchFlyout");

const RecipeSearchFlyout = dynamic(
  () => loadSearchFlyout().then((mod) => ({ default: mod.RecipeSearchFlyout })),
  { ssr: false },
);


export type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasOpenedSearch, setHasOpenedSearch] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { mutate: createRecipe } = useCreateRecipe();

  const profileEmail = session?.user?.email ?? undefined;

  const { data: recentRecipes = [] } = useQuery({
    queryKey: ["recentlyViewed", profileEmail],
    queryFn: fetchRecentlyViewed,
    enabled: Boolean(profileEmail),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleSearch = (): void => {
    setDrawerOpen(false);
    setHasOpenedSearch(true);
    setIsSearchOpen(true);
  };

  const handleNewRecipe = (): void => {
    setDrawerOpen(false);
    createRecipe(
      {
        title: "",
        data: "",
        tags: [],
        imageURL: "",
        emoji: "",
        isPublic: false,
      },
      {
        onSuccess: (res) => {
          void router.push(`/recipes/${res.recipeId}`);
        },
      },
    );
  };

  // Warm the deferred search chunk once the page is idle so the first search
  // click opens instantly without those bytes blocking first paint.
  useEffect(() => {
    const preload = (): void => void loadSearchFlyout();
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(preload);
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(preload, 2000);
    return () => clearTimeout(timer);
  }, []);

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
      {hasOpenedSearch && (
        <RecipeSearchFlyout
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          recentRecipes={recentRecipes}
        />
      )}

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
          onSearch={handleSearch}
          onMenuOpenChange={setProfileMenuOpen}
        />
      </div>

      <main className={styles.main}>{children}</main>
    </div>
  );
};
