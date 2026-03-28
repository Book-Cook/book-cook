import styles from "./RecipePropertyRow.module.css";
import type { RecipePropertyRowProps } from "./RecipePropertyRow.types";
import { BodyText, MetaLabel } from "../../../Typography";

export const RecipePropertyRow = ({
  icon,
  label,
  children,
}: RecipePropertyRowProps) => (
  <div className={styles.propertyRow}>
    <MetaLabel as="span" className={styles.propertyLabel}>
      <span className={styles.propertyIcon}>{icon}</span>
      {label}
    </MetaLabel>
    <BodyText as="span" className={styles.propertyValue}>
      {children}
    </BodyText>
  </div>
);
