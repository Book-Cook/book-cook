export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  /**
   * Image source URL for the avatar.
   */
  imageURL?: string;
  /**
   * Display name used for alt text and initials fallback.
   */
  name?: string;
  /**
   * Accessible label when no name is provided.
   */
  ariaLabel?: string;
  /**
   * Avatar size.
   * @default "md"
   */
  size?: AvatarSize;
  /**
   * Optional click handler for interactive avatars.
   */
  onClick?: () => void;
  /**
   * Optional class names to customize the avatar.
   */
  className?: string;
};
