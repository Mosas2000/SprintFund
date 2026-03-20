import { useState, useEffect, useRef } from 'react';
import { FOCUS_RING_GREEN } from '../lib/focus-styles';

export function KeyboardHints() {
  const [showHints, setShowHints] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);

  useEffect(() => {
    if (!showHints) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowHints(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHints]);

  const shortcuts = [
    {
      keys: isMac ? 'Cmd+K' : 'Ctrl+K',
      description: 'Open command palette',
    },
    {
      keys: isMac ? 'Cmd+D' : 'Ctrl+D',
      description: 'Go to dashboard',
    },
    {
      keys: isMac ? 'Cmd+N' : 'Ctrl+N',
      description: 'Create new proposal',
    },
    {
      keys: 'Arrow Keys',
      description: 'Navigate proposals',
    },
    {
      keys: 'Enter',
      description: 'Open selected proposal',
    },
    {
      keys: 'Esc',
      description: 'Close modals',
    },
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowHints(!showHints)}
        aria-label="Toggle keyboard shortcuts help"
        aria-expanded={showHints}
        className={`rounded-md px-2 py-1.5 text-sm text-muted hover:text-text hover:bg-white/5 transition-colors ${FOCUS_RING_GREEN}`}
        title="Show keyboard shortcuts"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>

      {showHints && (
        <div
          ref={panelRef}
          className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50"
        >
          <h3 className="text-sm font-semibold text-text mb-3">Keyboard Shortcuts</h3>
          <ul className="space-y-2">
            {shortcuts.map((shortcut, idx) => (
              <li key={idx} className="flex justify-between gap-3 text-xs">
                <span className="text-muted">{shortcut.description}</span>
                <kbd className="px-2 py-1 rounded bg-surface text-green font-mono whitespace-nowrap">
                  {shortcut.keys}
                </kbd>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
