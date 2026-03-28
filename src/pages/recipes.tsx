import * as React from "react";
import {
  FallbackScreen,
  Unauthorized,
} from "../components";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
  DropdownCaret,
} from "../components/Dropdown";
import { MultiSelectMenu } from "../components/MultiSelectMenu";
import { RecipeCardGallery } from "../components/RecipeCardGallery";
import { PageTitle, BodyText } from "../components/Typography";

import { useQuery } from "@tanstack/react-query";
import { fetchAllRecipes } from "src/clientToServer/fetch/fetchAllRecipes";
import { useSearchBox } from "../context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import styles from "./recipes.module.css";

export default function Recipes() {
  const { searchBoxValue } = useSearchBox();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [sortOption, setSortOption] = React.useState("dateNewest");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [showLoadingIndicator, setShowLoadingIndicator] = React.useState(false);

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes", searchBoxValue, sortOption],
    queryFn: () => fetchAllRecipes(searchBoxValue, sortOption),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const availableTags = Array.from(new Set((recipes ?? []).flatMap((r) => r.tags ?? [])));

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShowLoadingIndicator(true), 300);
    } else {
      setShowLoadingIndicator(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return <Unauthorized />;
  }

  const filteredRecipes = selectedTags.length
    ? (recipes ?? []).filter((r) => selectedTags.every((tag) => r.tags?.includes(tag)))
    : (recipes ?? []);

  const countLabel = `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? "s" : ""}${
    searchBoxValue ? ` matching "${searchBoxValue}"` : " in your collection"
  }${selectedTags.length > 0 ? ` with tags: ${selectedTags.join(", ")}` : ""}`;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <PageTitle as="h1">My Recipes</PageTitle>
          <BodyText>{countLabel}</BodyText>
        </div>
        <div className={styles.controls}>
          <Dropdown value={sortOption} onValueChange={setSortOption}>
            <DropdownTrigger>
              <DropdownValue />
              <DropdownCaret />
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem value="dateNewest">Sort by date (newest)</DropdownItem>
              <DropdownItem value="dateOldest">Sort by date (oldest)</DropdownItem>
              <DropdownItem value="ascTitle">Sort by title (asc)</DropdownItem>
              <DropdownItem value="descTitle">Sort by title (desc)</DropdownItem>
            </DropdownContent>
          </Dropdown>
          <MultiSelectMenu
            options={availableTags}
            value={selectedTags}
            onChange={setSelectedTags}
            label="Filter by tags"
          />
        </div>
      </div>
      <FallbackScreen
        isLoading={showLoadingIndicator}
        isError={Boolean(error)}
        dataLength={filteredRecipes.length}
      >
        <RecipeCardGallery
          recipes={filteredRecipes}
          isLoading={showLoadingIndicator}
          onRecipeClick={(recipe) => router.push(`/recipes/${recipe._id}`)}
        />
      </FallbackScreen>
    </div>
  );
}
