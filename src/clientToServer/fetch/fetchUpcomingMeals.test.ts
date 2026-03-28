import { fetchJson } from "src/utils";
import { fetchUpcomingMeals } from "./fetchUpcomingMeals";

// Mock the fetchJson utility
jest.mock("src/utils", () => ({
  fetchJson: jest.fn(),
}));

const mockFetchJson = fetchJson as jest.MockedFunction<typeof fetchJson>;

describe("fetchUpcomingMeals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current time to be consistent
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should fetch meal plans and return formatted upcoming meals", async () => {
    const mockMealPlans = {
      mealPlans: [
        {
          _id: "plan1",
          userId: "user1", 
          date: "2024-01-15",
          meals: {
            timeSlots: [
              {
                time: "12:00",
                meals: [
                  {
                    recipeId: "recipe1",
                    servings: 2,
                    time: "12:00",
                    recipe: {
                      title: "Test Recipe",
                      emoji: "🍽️",
                      imageURL: "test.jpg",
                      tags: ["lunch"]
                    }
                  }
                ]
              }
            ]
          },
          createdAt: "2024-01-15T00:00:00.000Z",
          updatedAt: "2024-01-15T00:00:00.000Z"
        }
      ],
      totalCount: 1
    };

    mockFetchJson.mockResolvedValue(mockMealPlans);

    const result = await fetchUpcomingMeals();

    expect(mockFetchJson).toHaveBeenCalledWith(
      expect.stringContaining("/api/meal-plans?startDate=")
    );
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0]).toMatchObject({
      _id: "recipe1",
      title: "Test Recipe",
      emoji: "🍽️",
      imageURL: "test.jpg",
      tags: ["lunch"],
      isPast: false
    });
    expect(result.currentMealIndex).toBe(0);
  });

  it("should handle past meals correctly with 1-hour buffer", async () => {
    const mockMealPlans = {
      mealPlans: [
        {
          _id: "plan1", 
          userId: "user1",
          date: "2024-01-15",
          meals: {
            timeSlots: [
              {
                time: "08:00", // Past time (current is 10:00) - more than 1 hour ago
                meals: [
                  {
                    recipeId: "recipe1",
                    servings: 1,
                    time: "08:00",
                    recipe: {
                      title: "Past Recipe",
                      emoji: "🥞",
                      imageURL: "past.jpg",
                      tags: ["breakfast"]
                    }
                  }
                ]
              },
              {
                time: "09:30", // Recent time (current is 10:00) - within 1 hour buffer
                meals: [
                  {
                    recipeId: "recipe2",
                    servings: 1,
                    time: "09:30",
                    recipe: {
                      title: "Recent Recipe",
                      emoji: "🥖",
                      imageURL: "recent.jpg",
                      tags: ["brunch"]
                    }
                  }
                ]
              }
            ]
          },
          createdAt: "2024-01-15T00:00:00.000Z",
          updatedAt: "2024-01-15T00:00:00.000Z"
        }
      ],
      totalCount: 1
    };

    mockFetchJson.mockResolvedValue(mockMealPlans);

    const result = await fetchUpcomingMeals();

    // 8:00 is 2 hours before 10:00, so with 1-hour buffer it should be past
    expect(result.meals[0].isPast).toBe(true);
    // 9:30 is only 30 minutes before 10:00, so with 1-hour buffer it should NOT be past
    expect(result.meals[1].isPast).toBe(false);
  });

  it("should handle legacy meal types", async () => {
    const mockMealPlans = {
      mealPlans: [
        {
          _id: "plan1",
          userId: "user1",
          date: "2024-01-15", 
          meals: {
            breakfast: {
              recipeId: "recipe1",
              servings: 1,
              time: "08:00",
              recipe: {
                title: "Legacy Breakfast",
                emoji: "🥞",
                imageURL: "breakfast.jpg",
                tags: ["breakfast"]
              }
            }
          },
          createdAt: "2024-01-15T00:00:00.000Z",
          updatedAt: "2024-01-15T00:00:00.000Z"
        }
      ],
      totalCount: 1
    };

    mockFetchJson.mockResolvedValue(mockMealPlans);

    const result = await fetchUpcomingMeals();

    expect(result.meals[0]).toMatchObject({
      _id: "recipe1",
      title: "Legacy Breakfast",
      emoji: "🥞"
    });
  });

  it("should handle duplicate recipes correctly", async () => {
    const mockMealPlans = {
      mealPlans: [
        {
          _id: "plan1",
          userId: "user1",
          date: "2024-01-15",
          meals: {
            timeSlots: [
              {
                time: "12:00",
                meals: [
                  {
                    recipeId: "recipe1",
                    servings: 2,
                    time: "12:00",
                    recipe: { title: "Recipe 1", emoji: "🍽️", imageURL: "", tags: [] }
                  },
                  {
                    recipeId: "recipe1", // Duplicate
                    servings: 1,
                    time: "12:00", 
                    recipe: { title: "Recipe 1", emoji: "🍽️", imageURL: "", tags: [] }
                  }
                ]
              }
            ]
          },
          createdAt: "2024-01-15T00:00:00.000Z",
          updatedAt: "2024-01-15T00:00:00.000Z"
        }
      ],
      totalCount: 1
    };

    mockFetchJson.mockResolvedValue(mockMealPlans);

    const result = await fetchUpcomingMeals();

    expect(result.meals).toHaveLength(1); // Should dedupe
  });

  it("should handle empty meal plans", async () => {
    mockFetchJson.mockResolvedValue({ mealPlans: [], totalCount: 0 });

    const result = await fetchUpcomingMeals();

    expect(result.meals).toHaveLength(0);
    expect(result.currentMealIndex).toBe(0);
  });

  it("should handle API errors", async () => {
    mockFetchJson.mockRejectedValue(new Error("API Error"));

    await expect(fetchUpcomingMeals()).rejects.toThrow("API Error");
  });

  it("should calculate correct date range", async () => {
    mockFetchJson.mockResolvedValue({ mealPlans: [], totalCount: 0 });

    await fetchUpcomingMeals();

    const call = mockFetchJson.mock.calls[0][0] as string;
    expect(call).toMatch(/startDate=2024-01-14/); // Yesterday
    expect(call).toMatch(/endDate=2024-01-22/); // Next week
  });
});