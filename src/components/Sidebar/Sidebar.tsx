import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { BookOpenIcon, SidebarSimpleIcon } from "@phosphor-icons/react";
import { clsx } from "clsx";
import Link from "next/link";

import styles from "./Sidebar.module.css";
import type { SidebarProps } from "./Sidebar.types";
import { SidebarContext } from "./SidebarContext";
import { SidebarItem } from "./SidebarItem";
import { Avatar } from "../Avatar";
import { BodyText } from "../Typography";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import { toCssSize } from "../../utils/toCssSize";

export const Sidebar = ({
  className,
  children,
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  collapseBreakpoint = 900,
  width = 280,
  collapsedWidth = 52,
  profile,
  showToggle = true,
  style,
  ...rest
}: SidebarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const isControlled = typeof collapsedProp === "boolean";
  const isCompact = useMediaQuery(`(max-width: ${collapseBreakpoint}px)`);
  const [collapsedState, setCollapsedState] = useState(() => defaultCollapsed);
  const [sectionOpenState, setSectionOpenState] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isControlled) {
      setCollapsedState((prev) => (prev === isCompact ? prev : isCompact));
    }
  }, [isCompact, isControlled]);

  const collapsed = isControlled ? collapsedProp : collapsedState;
  const resolvedStyle = {
    ...style,
    "--sidebar-width": toCssSize(width),
    "--sidebar-collapsed-width": toCssSize(collapsedWidth),
  } as CSSProperties;

  const getSectionOpen = (id: string) => sectionOpenState[id];

  const setSectionOpen = (id: string, open: boolean) => {
    setSectionOpenState((prev) =>
      prev[id] === open ? prev : { ...prev, [id]: open }
    );
  };

  const contextValue = {
    collapsed,
    getSectionOpen,
    setSectionOpen,
  };

  const handleToggle = () => {
    const next = !collapsed;
    if (!isControlled) {
      setCollapsedState(next);
    }
    onCollapsedChange?.(next);
  };

  const profileFooter = profile ? (
    <SidebarItem
      icon={<Avatar name={profile.name} imageURL={profile.imageURL} size="sm" />}
      label={profile.name}
      labelStacked
      onClick={profile.onClick}
      className={clsx(styles.profileItem, styles.profileFooter)}
    >
      <BodyText as="span" className={styles.profileName}>
        {profile.name}
      </BodyText>
      {profile.meta && (
        <BodyText as="span" className={styles.profileMeta}>
          {profile.meta}
        </BodyText>
      )}
    </SidebarItem>
  ) : null;

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={clsx(styles.sidebar, className)}
        data-sidebar-collapsed={collapsed ? "true" : "false"}
        data-sidebar-hydrated={isHydrated ? "true" : "false"}
        data-sidebar="true"
        style={resolvedStyle}
        {...rest}
      >
        <div className={styles.header}>
          {collapsed ? (
            <button
              className={styles.logoIconBtn}
              onClick={handleToggle}
              aria-label="Expand sidebar"
            >
              <span className={styles.logoIcon}>
                <BookOpenIcon size={16} weight="fill" />
              </span>
            </button>
          ) : (
            <Link href="/" className={styles.logoLink}>
              <span className={styles.logoIcon}>
                <BookOpenIcon size={16} weight="fill" />
              </span>
              <span className={styles.logoText} data-sidebar-collapsible="true">Book Cook</span>
            </Link>
          )}
          {showToggle && !collapsed && (
            <SidebarItem
              icon={<SidebarSimpleIcon size={18} />}
              label="Collapse sidebar"
              iconOnly
              onClick={handleToggle}
              className={styles.toggleButton}
            />
          )}
        </div>
        <div className={styles.content}>{children}</div>
        {profileFooter}
      </div>
    </SidebarContext.Provider>
  );
};
