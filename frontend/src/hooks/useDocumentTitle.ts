import { useEffect } from 'react';

/**
 * Sets the document title when the component mounts and restores
 * the default title on unmount.
 *
 * Useful for accessibility since screen readers announce the document
 * title on page load and tab switch. Also improves browser tab context.
 *
 * @param title - The page-specific title segment (e.g. "Proposals").
 *   The full title will be formatted as "{title} | SprintFund".
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | SprintFund`;

    return () => {
      document.title = previous;
    };
  }, [title]);
}
