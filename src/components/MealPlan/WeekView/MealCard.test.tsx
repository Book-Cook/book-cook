import { DndContext } from '@dnd-kit/core';
import { render, screen, fireEvent } from '@testing-library/react';

import { MealCard } from './MealCard';

describe('MealCard', () => {
  const defaultProps = {
    id: 'meal-1',
    title: 'Spaghetti Carbonara',
    emoji: '🍝',
    time: '12:30',
    duration: 60,
    position: 390,
    onRemove: jest.fn(),
    date: '2024-01-15',
    mealIndex: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders meal card with title and emoji', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} />
      </DndContext>
    );

    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    expect(screen.getByText('🍝')).toBeInTheDocument();
  });

  it('renders card with proper height based on duration', () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} duration={60} />
      </DndContext>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ height: '52px' }); // (60/60) * 60 - 8
  });

  it('handles different duration correctly', () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} duration={90} />
      </DndContext>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ height: '82px' }); // (90/60) * 60 - 8
  });

  it('has minimum height for short durations', () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} duration={15} />
      </DndContext>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ height: '30px' }); // minimum height
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} onRemove={onRemove} />
      </DndContext>
    );

    const removeButton = screen.getByLabelText('Remove meal');
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('uses default emoji when not provided', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} emoji={undefined} />
      </DndContext>
    );

    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });

  it('applies correct positioning styles', () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} position={120} duration={45} />
      </DndContext>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({
      top: '120px',
      height: '37px', // (45/60) * 60 - 8
    });
  });

  it('handles different times correctly', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} time="08:00" />
      </DndContext>
    );

    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
  });

  it('handles props correctly for drag and drop data', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} date="2024-01-15" mealIndex={0} />
      </DndContext>
    );

    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
  });

  it('has correct aria label for remove button', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} />
      </DndContext>
    );

    const removeButton = screen.getByLabelText('Remove meal');
    expect(removeButton).toBeInTheDocument();
  });

  it('shows title in title attribute for accessibility', () => {
    const longTitle = 'This is a very long recipe title that should be truncated when displayed in the card';
    
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} title={longTitle} />
      </DndContext>
    );

    const titleElement = screen.getByText(longTitle);
    expect(titleElement).toHaveAttribute('title', longTitle);
  });
});