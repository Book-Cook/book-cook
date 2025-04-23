export const fetchAllTags = async (): Promise<string[]> => {
  try {
    const response = await fetch("/api/tags");

    if (!response.ok) {
      throw new Error(`Error fetching tags: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
};
