import { DndContext } from "@dnd-kit/core";
import { render, screen } from "@testing-library/react";

import { RecipeDragCard } from "./RecipeDragCard";

// Mock the draggable hook
jest.mock("@dnd-kit/core", () => ({
  ...jest.requireActual("@dnd-kit/core"),
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
  }),
}));

describe("RecipeDragCard", () => {
  const defaultProps = {
    id: "recipe-1",
    title: "Chocolate Chip Cookies",
    emoji: "🍪",
    tags: ["dessert", "cookies", "sweet"],
  };

  it("renders recipe card with title and emoji", () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <RecipeDragCard {...defaultProps} />
      </DndContext>,
    );

    expect(screen.getByText("Chocolate Chip Cookies")).toBeInTheDocument();
    expect(screen.getByText("🍪")).toBeInTheDocument();
  });

  it("renders tags when provided", () => {
    render(
      <DndContext onDragEnd={() => {}}>
        <RecipeDragCard {...defaultProps} />
      </DndContext>,
    );

    expect(screen.getByText("dessert")).toBeInTheDocument();
    expect(screen.getByText("cookies")).toBeInTheDocument();
    expect(screen.getByText("sweet")).toBeInTheDocument();
  });

  it("limits tag display to 3 tags", () => {
    const propsWithManyTags = {
      ...defaultProps,
      tags: ["dessert", "cookies", "sweet", "baked", "chocolate", "homemade"],
    };

    render(
      <DndContext onDragEnd={() => {}}>
        <RecipeDragCard {...propsWithManyTags} />
      </DndContext>,
    );

    expect(screen.getByText("dessert")).toBeInTheDocument();
    expect(screen.getByText("cookies")).toBeInTheDocument();
    expect(screen.getByText("sweet")).toBeInTheDocument();
    expect(screen.queryByText("baked")).not.toBeInTheDocument();
  });

  it("renders without tags when none provided", () => {
    const propsWithoutTags = {
      id: "recipe-1",
      title: "Simple Recipe",
      emoji: "🍽️",
    };

    render(
      <DndContext onDragEnd={() => {}}>
        <RecipeDragCard {...propsWithoutTags} />
      </DndContext>,
    );

    expect(screen.getByText("Simple Recipe")).toBeInTheDocument();
    expect(screen.getByText("🍽️")).toBeInTheDocument();
  });

  it("renders fallback emoji when emoji is empty", () => {
    const propsWithoutEmoji = {
      ...defaultProps,
      emoji: "",
    };

    render(
      <DndContext onDragEnd={() => {}}>
        <RecipeDragCard {...propsWithoutEmoji} />
      </DndContext>,
    );

    expect(screen.getByText("🍽️")).toBeInTheDocument();
  });

  it("applies dragging class when isDragging is true", () => {
    const { container } = render(
      <DndContext onDragEnd={() => {}}>
        <RecipeDragCard {...defaultProps} isDragging />
      </DndContext>,
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement.className).toMatch(/isDragging/);
  });
});
