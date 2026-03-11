import { useEffect, useCallback } from 'react';

/**
 * Hook that scrolls a comment into view when the URL hash matches its ID.
 * Usage: useCommentPermalink(commentId)
 *
 * When the page loads with a hash like #comment-123456, the matching
 * comment element will scroll into view with a highlight animation.
 */
export function useCommentPermalink(commentId: string): {
  anchorId: string;
  permalinkUrl: string;
  copyPermalink: () => void;
} {
  const anchorId = `comment-${commentId}`;
  const permalinkUrl = `${window.location.pathname}${window.location.search}#${anchorId}`;

  useEffect(() => {
    if (window.location.hash === `#${anchorId}`) {
      const element = document.getElementById(anchorId);
      if (element) {
        // Small delay to ensure DOM is rendered
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-green/50');
          // Remove the highlight after animation
          const cleanup = setTimeout(() => {
            element.classList.remove('ring-2', 'ring-green/50');
          }, 3000);
          return () => clearTimeout(cleanup);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [anchorId]);

  const copyPermalink = useCallback(() => {
    const fullUrl = `${window.location.origin}${permalinkUrl}`;
    navigator.clipboard.writeText(fullUrl).catch(() => {
      // Clipboard API not available - fail silently
    });
  }, [permalinkUrl]);

  return { anchorId, permalinkUrl, copyPermalink };
}
