import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BlockHeightDisplay } from './BlockHeightDisplay';

describe('BlockHeightDisplay component', () => {
  describe('full format (default)', () => {
    it('should render block height with relative time', () => {
      render(<BlockHeightDisplay blockHeight={12345} />);
      const element = screen.getByText(/Block #12,345/);
      expect(element).toBeTruthy();
    });

    it('should handle null block height', () => {
      render(<BlockHeightDisplay blockHeight={null} />);
      const element = screen.getByText('Block #0');
      expect(element).toBeTruthy();
    });

    it('should handle undefined block height', () => {
      render(<BlockHeightDisplay blockHeight={undefined} />);
      const element = screen.getByText('Block #0');
      expect(element).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <BlockHeightDisplay blockHeight={100} className="custom-class" />,
      );
      const span = container.querySelector('span');
      expect(span?.className).toContain('custom-class');
    });
  });

  describe('short format', () => {
    it('should render compact block height', () => {
      render(<BlockHeightDisplay blockHeight={12345} format="short" />);
      const element = screen.getByText('Block #12,345');
      expect(element).toBeTruthy();
    });

    it('should show title attribute for short format by default', () => {
      const { container } = render(
        <BlockHeightDisplay blockHeight={12345} format="short" showTitle={true} />,
      );
      const span = container.querySelector('span');
      expect(span?.title).toBeTruthy();
      expect(span?.title).toContain('Block #12,345');
    });

    it('should hide title when showTitle is false', () => {
      const { container } = render(
        <BlockHeightDisplay blockHeight={12345} format="short" showTitle={false} />,
      );
      const span = container.querySelector('span');
      expect(span?.title).toBe('');
    });
  });
});
