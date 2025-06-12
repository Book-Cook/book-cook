import { http, HttpResponse } from "msw";

export const mockRecipes = [
  {
    _id: "1",
    owner: "user1",
    isPublic: true,
    title: "Mock Pancakes",
    tags: ["breakfast"],
    createdAt: "2023-10-01T12:00:00Z",
    emoji: "🥞",
    imageURL: "",
  },
];

export const handlers = [
  http.get("/api/recipes", ({ params }) => {
    return HttpResponse.json(mockRecipes);
  }),
  http.get("/api/recipes/:id", ({ params }) => {
    return HttpResponse.json(mockRecipes);
  }),
  http.get("/api/recipes/tags", ({ params }) => {
    return HttpResponse.json(mockRecipes.flatMap((r) => r.tags));
  }),
];
