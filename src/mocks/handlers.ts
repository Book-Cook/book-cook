import { http } from 'msw';

// Example mock data for recipes
export const mockRecipes = [
  {
    _id: '1',
    owner: 'user1',
    isPublic: true,
    title: 'Mock Pancakes',
    tags: ['breakfast'],
    createdAt: new Date().toISOString(),
    emoji: '🥞',
    imageURL: '',
  },
];

export const handlers = [
  http.get('/api/recipes', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockRecipes));
  }),
  http.get('/api/recipes/tags', (_req, res, ctx) => {
    const tags = Array.from(new Set(mockRecipes.flatMap((r) => r.tags)));
    return res(ctx.status(200), ctx.json(tags));
  }),
];
