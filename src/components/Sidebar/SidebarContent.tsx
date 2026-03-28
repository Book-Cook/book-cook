import * as React from "react";
import { useRouter } from "next/router";
import {
  BookOpenIcon,
  GridFourIcon,
  CompassIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";

import { SidebarItem } from "./SidebarItem";

type SidebarContentProps = {
  currentPath: string;
  onNewRecipe: () => void;
  onSearch: () => void;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactElement;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/recipes", label: "Recipes", icon: <BookOpenIcon size={18} /> },
  { href: "/collections", label: "Collections", icon: <GridFourIcon size={18} />, disabled: true },
  { href: "/explore", label: "Explore", icon: <CompassIcon size={18} />, disabled: true },
];

export const SidebarContent = ({ currentPath, onNewRecipe, onSearch }: SidebarContentProps) => {
  const router = useRouter();

  return (
    <nav aria-label="Main navigation">
      <SidebarItem
        icon={<PlusIcon size={18} />}
        label="New Recipe"
        onClick={onNewRecipe}
      />
      <SidebarItem
        icon={<MagnifyingGlassIcon size={18} />}
        label="Search recipes..."
        onClick={onSearch}
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
