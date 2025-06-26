import React from 'react';
import type { StoryFn, StoryContext } from '@storybook/react';
import { http, HttpResponse } from 'msw';

// Types for MSW parameters
export interface MSWParameters {
  msw?: {
    handlers?: Array<ReturnType<typeof http.get      >>;
  };
}

/**
 * MSW Decorator for Storybook stories
 * 
 * Note: The actual MSW integration is handled by msw-storybook-addon.
 * This decorator exists for backward compatibility and may be removed in the future.
 * 
 * Usage in stories:
 * ```
 * export const MyStory = {
 *   parameters: {
 *     msw: {
 *       handlers: [
 *         http.get('/api/user/collections', () => {
 *           return HttpResponse.json([])
 *         })
 *       ]
 *     }
 *   }
 * }
 * ```
 */
export const withMSW = (Story: StoryFn, context: StoryContext) => {
  // MSW integration is now handled by msw-storybook-addon in preview.ts
  // This decorator is kept for compatibility but does nothing
  return <Story />;
};

// Helper functions for common mock scenarios
export const createMockHandlers = {
  // Mock successful empty collections
  emptyCollections: () => [
    http.get('/api/user/collections', () => HttpResponse.json([])),
    http.get('/api/user/recentlyViewed', () => HttpResponse.json([])),
    http.get('/api/recipes', () => HttpResponse.json([])),
  ],

  // Mock loading states (delayed responses)
  loadingState: (delay = 1000) => [
    http.get('/api/user/collections', async () => {
      await new Promise(resolve => setTimeout(resolve, delay));
      return HttpResponse.json([]);
    }),
    http.get('/api/user/recentlyViewed', async () => {
      await new Promise(resolve => setTimeout(resolve, delay));
      return HttpResponse.json([]);
    }),
    http.get('/api/recipes', async () => {
      await new Promise(resolve => setTimeout(resolve, delay));
      return HttpResponse.json([]);
    }),
  ],

  // Mock API errors
  apiErrors: () => [
    http.get('/api/user/collections', () => 
      HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    ),
    http.get('/api/user/recentlyViewed', () => 
      HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    ),
    http.get('/api/recipes', () => 
      HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
    ),
  ],

  // Mock with custom data
  withData: (collections: any[] = [], recentlyViewed: any[] = [], recipes: any[] = []) => [
    http.get('/api/user/collections', () => HttpResponse.json(collections)),
    http.get('/api/user/recentlyViewed', () => HttpResponse.json(recentlyViewed)),
    http.get('/api/recipes', () => HttpResponse.json(recipes)),
  ],
};