import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaginationControls } from '../../components/PaginationControls';

describe('PaginationControls', () => {
  const defaultProps = {
    page: 2,
    pageSize: 10,
    total: 45,
    totalPages: 5,
    hasNextPage: true,
    hasPreviousPage: true,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  it('renders nothing when total is 0', () => {
    const { container } = render(<PaginationControls {...defaultProps} total={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct result counts', () => {
    render(<PaginationControls {...defaultProps} />);
    expect(screen.getByText('Showing 11 to 20 of 45 results')).toBeDefined();
  });

  it('calls onPageSizeChange when size selector changes', () => {
    render(<PaginationControls {...defaultProps} />);
    const select = screen.getByLabelText('Items per page');
    fireEvent.change(select, { target: { value: '25' } });
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('disables previous buttons when on first page', () => {
    render(<PaginationControls {...defaultProps} page={1} hasPreviousPage={false} />);
    expect(screen.getByLabelText('Go to first page')).toBeDisabled();
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
    expect(screen.getByLabelText('Go to next page')).not.toBeDisabled();
  });

  it('disables next buttons when on last page', () => {
    render(<PaginationControls {...defaultProps} page={5} hasNextPage={false} />);
    expect(screen.getByLabelText('Go to first page')).not.toBeDisabled();
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
    expect(screen.getByLabelText('Go to last page')).toBeDisabled();
  });

  it('calls onPageChange with appropriate page numbers', () => {
    render(<PaginationControls {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Go to first page'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    
    fireEvent.click(screen.getByLabelText('Go to previous page'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    
    fireEvent.click(screen.getByLabelText('Go to next page'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
    
    fireEvent.click(screen.getByLabelText('Go to last page'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(5);
  });

  it('renders active page with correct aria-current attribute', () => {
    render(<PaginationControls {...defaultProps} />);
    const activeBtn = screen.getByRole('button', { name: 'Go to page 2' });
    expect(activeBtn.getAttribute('aria-current')).toBe('page');
  });

  it('respects maxVisiblePages prop', () => {
    render(<PaginationControls {...defaultProps} totalPages={10} maxVisiblePages={3} />);
    // Should show 1, 2, 3 (since page is 2)
    expect(screen.queryByRole('button', { name: 'Go to page 1' })).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Go to page 2' })).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Go to page 3' })).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Go to page 4' })).toBeNull();
  });

  it('hides navigation when totalPages is 1', () => {
    render(<PaginationControls {...defaultProps} totalPages={1} page={1} hasNextPage={false} hasPreviousPage={false} />);
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.getByText('Showing 1 to 10 of 45 results')).not.toBeNull();
  });
});
