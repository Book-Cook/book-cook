import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle } from './Drawer';

describe('Drawer', () => {
  it('renders content when open', () => {
    render(
      <Drawer open ariaLabel="Menu">
        <DrawerBody>Drawer body</DrawerBody>
      </Drawer>
    );

    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
    expect(screen.getByText('Drawer body')).toBeVisible();
  });

  it('calls onOpenChange when the backdrop is clicked', () => {
    const onOpenChange = jest.fn();
    render(
      <Drawer
        open
        ariaLabel="Menu"
        onOpenChange={onOpenChange}
        backdropProps={{ 'data-testid': 'drawer-backdrop' }}
      >
        <DrawerBody>Drawer body</DrawerBody>
      </Drawer>
    );

    fireEvent.click(screen.getByTestId('drawer-backdrop'));
    expect(onOpenChange).toHaveBeenCalledWith(expect.anything(), { open: false });
  });

  it('closes on Escape when enabled', () => {
    const onOpenChange = jest.fn();
    render(
      <Drawer open ariaLabel="Menu" onOpenChange={onOpenChange}>
        <DrawerBody>Drawer body</DrawerBody>
      </Drawer>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(expect.anything(), { open: false });
  });

  it('applies positional styling', () => {
    render(
      <Drawer open ariaLabel="Menu" position="start">
        <DrawerBody>Drawer body</DrawerBody>
      </Drawer>
    );

    const drawer = screen.getByRole('dialog', { name: 'Menu' });
    expect(drawer.className).toContain('positionStart');
  });

  it('renders header title with actions', () => {
    render(
      <Drawer open ariaLabel="Menu">
        <DrawerHeader>
          <DrawerHeaderTitle action={<button type="button">Close</button>}>
            Title text
          </DrawerHeaderTitle>
        </DrawerHeader>
      </Drawer>
    );

    expect(screen.getByText('Title text')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
