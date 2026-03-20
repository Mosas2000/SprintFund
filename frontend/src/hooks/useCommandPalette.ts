import { useEffect, useCallback } from 'react';

export interface SearchCommand {
  id: string;
  title: string;
  description?: string;
  action: () => void;
  shortcut?: string;
  category?: string;
}

export function useCommandPalette(
  commands: SearchCommand[],
  onOpen: () => void,
  isOpen: boolean,
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const isSearchHotkey = isMac 
        ? event.metaKey && event.key === 'k'
        : event.ctrlKey && event.key === 'k';

      if (isSearchHotkey) {
        event.preventDefault();
        onOpen();
      }

      if (isOpen && event.key === 'Escape') {
        event.preventDefault();
      }
    },
    [isOpen, onOpen],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function filterCommands(commands: SearchCommand[], query: string): SearchCommand[] {
  if (!query.trim()) return commands;

  const lowerQuery = query.toLowerCase();
  return commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(lowerQuery) ||
      cmd.description?.toLowerCase().includes(lowerQuery) ||
      cmd.category?.toLowerCase().includes(lowerQuery),
  );
}
