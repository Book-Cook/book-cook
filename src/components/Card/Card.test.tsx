import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Card } from './Card';

describe('Card', () => {
  it('renders children with base styling', () => {
    render(<Card>Card content</Card>);

    const card = screen.getByText('Card content');
    expect(card).toHaveClass('card');
  });

  it('adds interactive affordances when clickable', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>Clickable card</Card>);

    const card = screen.getByRole('button');
    expect(card).toHaveClass('card', 'clickable');
    expect(card).toHaveAttribute('tabindex', '0');

    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects provided role and tabIndex', () => {
    render(
      <Card role="article" tabIndex={-1}>
        Custom semantics
      </Card>
    );

    const card = screen.getByText('Custom semantics');
    expect(card).toHaveAttribute('role', 'article');
    expect(card).toHaveAttribute('tabindex', '-1');
  });

  it('fires click on keyboard activation and still runs custom handlers', () => {
    const onClick = jest.fn();
    const onKeyDown = jest.fn();
    render(
      <Card onClick={onClick} onKeyDown={onKeyDown}>
        Keyboard card
      </Card>
    );

    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('forwards refs to the underlying div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>With ref</Card>);

    expect(ref.current?.tagName).toBe('DIV');
  });
});
