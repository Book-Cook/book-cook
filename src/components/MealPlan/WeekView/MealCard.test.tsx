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

  it('displays formatted time range when card is tall enough', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} duration={60} />
      </DndContext>
    );

    expect(screen.getByText('12:30 PM - 1:30 PM')).toBeInTheDocument();
  });

  it('handles different duration correctly', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} duration={90} />
      </DndContext>
    );

    expect(screen.getByText('12:30 PM - 2:00 PM')).toBeInTheDocument();
  });

  it('does not show time when card is too short', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} duration={30} />
      </DndContext>
    );

    expect(screen.queryByText('12:30 PM - 1:00 PM')).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} onRemove={onRemove} />
      </DndContext>
    );

    const removeButton = screen.getByRole('button');
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

  it('handles morning time correctly', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} time="08:00" />
      </DndContext>
    );

    expect(screen.getByText('8:00 AM - 9:00 AM')).toBeInTheDocument();
  });

  it('handles evening time correctly', () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <MealCard {...defaultProps} time="19:30" />
      </DndContext>
    );

    expect(screen.getByText('7:30 PM - 8:30 PM')).toBeInTheDocument();
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