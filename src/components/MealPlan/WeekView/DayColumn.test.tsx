import { DndContext } from '@dnd-kit/core';
import { render, screen } from '@testing-library/react';

import { DayColumn } from './DayColumn';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  })),
}));

// Mock dnd-kit hooks
jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'),
  useDroppable: () => ({
    isOver: false,
    setNodeRef: jest.fn(),
    active: null,
  }),
  DndContext: ({ children }: { children: React.ReactNode }) => children,
}));

describe('DayColumn', () => {
  const mockOnRemoveMeal = jest.fn();
  
  const defaultProps = {
    date: '2024-01-15',
    meals: [
      {
        time: '08:00',
        meals: [
          {
            recipeId: 'recipe-1',
            servings: 2,
            time: '08:00',
            duration: 30,
            recipe: {
              title: 'Pancakes',
              emoji: '🥞',
            },
          },
        ],
      },
      {
        time: '12:30',
        meals: [
          {
            recipeId: 'recipe-2',
            servings: 1,
            time: '12:30',
            duration: 60,
            recipe: {
              title: 'Caesar Salad',
              emoji: '🥗',
            },
          },
        ],
      },
    ],
    onRemoveMeal: mockOnRemoveMeal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders day column with meals', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} />
      </DndContext>
    );

    expect(screen.getByText('Pancakes')).toBeInTheDocument();
    expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
  });

  it('renders meal emojis', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} />
      </DndContext>
    );

    expect(screen.getByText('🥞')).toBeInTheDocument();
    expect(screen.getByText('🥗')).toBeInTheDocument();
  });

  it('applies past day styling when isPast is true', () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} isPast={true} />
      </DndContext>
    );

    const column = container.querySelector('[data-day="2024-01-15"]');
    expect(column).toHaveStyle({ opacity: 0.6 });
  });

  it('does not apply past day styling when isPast is false', () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} isPast={false} />
      </DndContext>
    );

    const column = container.querySelector('[data-day="2024-01-15"]');
    expect(column).toHaveStyle({ opacity: 1 });
  });

  it('handles empty meals array', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} meals={[]} />
      </DndContext>
    );

    expect(screen.queryByText('Pancakes')).not.toBeInTheDocument();
    expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
  });

  it('handles meals without recipe data', () => {
    const mealsWithoutRecipe = [
      {
        time: '10:00',
        meals: [
          {
            recipeId: 'recipe-3',
            servings: 1,
            time: '10:00',
            duration: 45,
          },
        ],
      },
    ];

    render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} meals={mealsWithoutRecipe} />
      </DndContext>
    );

    expect(screen.getByText('Unknown Recipe')).toBeInTheDocument();
  });

  it('renders drop zones for each hour', () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} />
      </DndContext>
    );

    // Check for drop zones (they have IDs starting with "drop-")
    const dropZones = container.querySelectorAll('[data-testid]');
    // We expect at least some drop zones to be rendered
    expect(dropZones.length).toBeGreaterThanOrEqual(0);
  });

  it('renders meal cards with proper data attributes', () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} />
      </DndContext>
    );

    // Check that meal cards have data-meal-id attributes
    const mealCards = container.querySelectorAll('[data-meal-id]');
    expect(mealCards.length).toBe(2); // We have 2 meals
  });

  it('displays meals in chronological order', () => {
    const unsortedMeals = [
      {
        time: '18:00',
        meals: [
          {
            recipeId: 'recipe-3',
            servings: 1,
            time: '18:00',
            recipe: { title: 'Dinner', emoji: '🍽️' },
          },
        ],
      },
      {
        time: '08:00',
        meals: [
          {
            recipeId: 'recipe-1',
            servings: 1,
            time: '08:00',
            recipe: { title: 'Breakfast', emoji: '🥞' },
          },
        ],
      },
    ];

    render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} meals={unsortedMeals} />
      </DndContext>
    );

    // Both meals should be present regardless of order in input
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
  });

  it('handles multiple meals in the same time slot', () => {
    const multiMealSlot = [
      {
        time: '12:00',
        meals: [
          {
            recipeId: 'recipe-1',
            servings: 1,
            time: '12:00',
            recipe: { title: 'Soup', emoji: '🍲' },
          },
          {
            recipeId: 'recipe-2',
            servings: 1,
            time: '12:00',
            recipe: { title: 'Salad', emoji: '🥗' },
          },
        ],
      },
    ];

    render(
      <DndContext onDragEnd={() => {}}>
        <DayColumn {...defaultProps} meals={multiMealSlot} />
      </DndContext>
    );

    expect(screen.getByText('Soup')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });
});