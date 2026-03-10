/**
 * Accessible live region that announces dynamic content updates to screen readers.
 *
 * Uses aria-live to notify assistive technology when the children change.
 * The "polite" politeness level waits for the user to finish interacting
 * before announcing, while "assertive" interrupts immediately.
 */

interface LiveRegionProps {
  /** Content to announce when it changes. */
  children: React.ReactNode;
  /** How urgently the update should be announced. Defaults to "polite". */
  politeness?: 'polite' | 'assertive';
  /** Whether to announce only additions (true) or all changes (false). Defaults to false. */
  additionsOnly?: boolean;
  /** Optional CSS class name. */
  className?: string;
}

export function LiveRegion({
  children,
  politeness = 'polite',
  additionsOnly = false,
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={!additionsOnly}
      aria-relevant={additionsOnly ? 'additions' : 'additions text'}
      className={className}
    >
      {children}
    </div>
  );
}
