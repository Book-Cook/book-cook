import { render, screen, fireEvent } from '@testing-library/react';

import { PaginationControls } from './PaginationControls';

describe('PaginationControls', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination controls', () => {
    render(<PaginationControls {...defaultProps} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights current page with brand styling', () => {
    render(<PaginationControls {...defaultProps} currentPage={2} />);
    
    const currentPageButton = screen.getByRole('button', { name: '2' });
    expect(currentPageButton).toBeInTheDocument();
    // Check for brand color styling
    expect(currentPageButton).toHaveStyle({
      color: 'var(--colorBrandForeground1)',
      fontWeight: 'var(--fontWeightSemibold)'
    });
  });

  it('disables previous button on first page', () => {
    render(<PaginationControls {...defaultProps} currentPage={1} />);
    
    expect(screen.getByTitle('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<PaginationControls {...defaultProps} currentPage={5} totalPages={5} />);
    
    expect(screen.getByTitle('Next page')).toBeDisabled();
  });

  it('calls onPageChange when page button is clicked', () => {
    render(<PaginationControls {...defaultProps} />);
    
    fireEvent.click(screen.getByText('3'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when navigation buttons are clicked', () => {
    render(<PaginationControls {...defaultProps} currentPage={3} />);
    
    fireEvent.click(screen.getByTitle('Previous page'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
    
    fireEvent.click(screen.getByTitle('Next page'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
  });

  it('shows ellipsis for large page ranges', () => {
    render(<PaginationControls {...defaultProps} currentPage={1} totalPages={10} />);
    
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('shows active page indicator element', () => {
    render(<PaginationControls {...defaultProps} currentPage={2} />);
    
    const currentPageButton = screen.getByRole('button', { name: '2' });
    // Check that the underline indicator div exists
    const indicator = currentPageButton.querySelector('div');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({
      position: 'absolute',
      backgroundColor: 'var(--colorBrandBackground)',
      borderRadius: '2px'
    });
  });

  it('does not render when totalPages is 1', () => {
    const { container } = render(<PaginationControls {...defaultProps} totalPages={1} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('does not render when totalPages is 0', () => {
    const { container } = render(<PaginationControls {...defaultProps} totalPages={0} />);
    
    expect(container.firstChild).toBeNull();
  });
});