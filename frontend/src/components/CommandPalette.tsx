import { useState, useEffect, useMemo, useRef } from 'react';
import { filterCommands, type SearchCommand } from '../hooks/useCommandPalette';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: SearchCommand[];
}

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => filterCommands(commands, query), [commands, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filtered.length - 1 ? prev + 1 : prev,
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filtered[selectedIndex]) {
            filtered[selectedIndex].action();
            onClose();
          }
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
    return undefined;
  }, [isOpen, onClose, filtered, selectedIndex]);

  useEffect(() => {
    const selected = listRef.current?.children[selectedIndex];
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 z-50">
        <div className="bg-card border border-border rounded-lg shadow-xl overflow-hidden">
          <div className="p-3 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="w-full bg-transparent text-text placeholder-muted outline-none text-sm"
              aria-label="Search commands"
            />
          </div>

          {filtered.length > 0 ? (
            <div
              ref={listRef}
              role="listbox"
              className="max-h-96 overflow-y-auto"
            >
              {filtered.map((command, idx) => (
                <button
                  key={command.id}
                  role="option"
                  aria-selected={selectedIndex === idx}
                  onClick={() => {
                    command.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full px-3 py-3 text-left transition-colors border-0 cursor-pointer flex items-center justify-between ${
                    selectedIndex === idx
                      ? 'bg-green/10 text-green'
                      : 'hover:bg-white/5 text-text'
                  }`}
                >
                  <div>
                    <div className="text-sm font-medium">{command.title}</div>
                    {command.description && (
                      <div className="text-xs text-muted mt-1">
                        {command.description}
                      </div>
                    )}
                  </div>
                  {command.shortcut && (
                    <div className="text-xs text-muted ml-4 shrink-0">
                      {command.shortcut}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted">
              No commands found
            </div>
          )}
        </div>
      </div>
    </>
  );
}
