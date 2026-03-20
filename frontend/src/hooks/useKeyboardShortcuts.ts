import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = (shortcut.ctrlKey ?? false) === (event.ctrlKey || event.metaKey);
        const shiftMatches = (shortcut.shiftKey ?? false) === event.shiftKey;
        const altMatches = (shortcut.altKey ?? false) === event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useNavigationShortcuts() {
  const navigate = useNavigate();

  return {
    goToDashboard: () => navigate('/dashboard'),
    goToProposals: () => navigate('/proposals'),
    goToProfile: () => navigate('/profile'),
    createProposal: () => navigate('/proposals/create'),
  };
}
