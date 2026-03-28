import styles from "./RecipeStats.module.css";
import type { RecipeStatsProps } from "./RecipeStats.types";
import { BodyText } from "../../../Typography";

export const RecipeStats = ({ viewCount, savedCount }: RecipeStatsProps) => (
  <div className={styles.statsRow}>
    {(viewCount ?? 0) > 0 && (
      <BodyText as="span">{viewCount?.toLocaleString()} views</BodyText>
    )}
    {(savedCount ?? 0) > 0 && (
      <BodyText as="span">{savedCount?.toLocaleString()} saves</BodyText>
    )}
  </div>
);
