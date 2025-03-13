export type FallbackScreenProps = {
  /**
   * Whether the data is loading or not
   */
  isLoading: boolean;

  /**
   * The length of the data to determine if there is no data
   */
  dataLength: number | undefined;

  /**
   * Whether there was an error fetching the data
   */
  isError: boolean;

  /**
   * Whether the user is unauthorized to view the content
   */
  isUnauthorized?: boolean;

  /**
   * The children components to render when there is no error or loading
   */
  children: React.ReactNode;
};
