import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies appearance variants', () => {
    const { rerender } = render(<Button appearance="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('primary');

    rerender(<Button appearance="subtle">Subtle</Button>);
    expect(screen.getByRole('button')).toHaveClass('subtle');

    rerender(<Button appearance="transparent">Transparent</Button>);
    expect(screen.getByRole('button')).toHaveClass('transparent');

    rerender(<Button>Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it('renders icon with text', () => {
    render(
      <Button icon={<span data-testid="icon">=</span>}>
        Search
      </Button>
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards HTML attributes', () => {
    render(
      <Button type="submit" data-testid="submit-btn">
        Submit
      </Button>
    );

    const button = screen.getByTestId('submit-btn');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('defaults type to button', () => {
    render(<Button>Default type</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('forwards refs to the native element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref target</Button>);

    expect(ref.current?.tagName).toBe('BUTTON');
    expect(ref.current).toHaveClass('button');
  });
});
