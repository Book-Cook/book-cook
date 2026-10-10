import * as React from "react";
import {
  CookingPotIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/router";

import { SidebarItem } from "./SidebarItem";

type SidebarContentProps = {
  currentPath: string;
  onNewRecipe: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactElement;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/recipes", label: "Recipes", icon: <CookingPotIcon size={18} /> },
  // {
  //   href: "/collections",
  //   label: "Collections",
  //   icon: <GridFourIcon size={18} />,
  //   disabled: true,
  // },
  // {
  //   href: "/explore",
  //   label: "Explore",
  //   icon: <CompassIcon size={18} />,
  //   disabled: true,
  // },
];

export const SidebarContent = ({
  currentPath,
  onNewRecipe,
}: SidebarContentProps) => {
  const router = useRouter();

  return (
    <nav aria-label="Main navigation">
      <SidebarItem
        icon={<PlusIcon size={18} />}
        label="New recipe"
        onClick={onNewRecipe}
      />
      {NAV_ITEMS.map((item) => (
        <SidebarItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          active={currentPath === item.href}
          disabled={item.disabled}
          onClick={item.disabled ? undefined : () => router.push(item.href)}
        />
      ))}
    </nav>
  );
};
