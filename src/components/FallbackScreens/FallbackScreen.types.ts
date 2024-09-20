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
  isError: Error | null;
};
