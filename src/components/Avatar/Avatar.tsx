import { clsx } from "clsx";
import Image from "next/image";

import styles from "./Avatar.module.css";
import type { AvatarProps } from "./Avatar.types";
import { getAvatarColors } from "./utils/getAvatarColors";
import { getInitials } from "./utils/getInitials";

const sizeStyles = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const sizePixels = {
  sm: 28,
  md: 36,
  lg: 48,
} as const;

/**
 * Avatar component for displaying user profile images or initials.
 */
export const Avatar = ({
  imageURL,
  name,
  ariaLabel,
  size = "md",
  onClick,
  className,
}: AvatarProps) => {
  const label = ariaLabel ?? name ?? "User avatar";
  const initials = getInitials(name);
  const dimension = sizePixels[size];
  const fallbackColors = imageURL ? undefined : getAvatarColors(label);
  const fallbackStyle = fallbackColors
    ? {
        backgroundColor: fallbackColors.background,
        color: fallbackColors.foreground,
      }
    : undefined;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={clsx(
          styles.avatar,
          sizeStyles[size],
          styles.interactive,
          className,
        )}
        style={fallbackStyle}
      >
        {imageURL ? (
          <Image
            className={styles.image}
            src={imageURL}
            alt={label}
            width={dimension}
            height={dimension}
            sizes={`${dimension}px`}
          />
        ) : (
          <span className={styles.fallback} aria-hidden="true">
            {initials}
          </span>
        )}
      </button>
    );
  }

  return (
    <span
      className={clsx(styles.avatar, sizeStyles[size], className)}
      role={imageURL ? undefined : "img"}
      aria-label={!imageURL ? label : undefined}
      style={fallbackStyle}
    >
      {imageURL ? (
        <Image
          className={styles.image}
          src={imageURL}
          alt={label}
          width={dimension}
          height={dimension}
          sizes={`${dimension}px`}
        />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {initials}
        </span>
      )}
    </span>
  );
};
