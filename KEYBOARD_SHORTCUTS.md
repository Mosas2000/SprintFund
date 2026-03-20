# Keyboard Shortcuts Implementation

This document describes the keyboard shortcuts feature added to SprintFund.

## Overview

Power users can now navigate the application and perform common actions using keyboard shortcuts. The implementation includes:

- Global navigation shortcuts
- Proposal list navigation with arrow keys
- Command palette with search functionality
- Help panel to discover shortcuts

## Available Shortcuts

### Global Navigation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd/Ctrl+K` | Open Command Palette | Search and execute commands |
| `Cmd/Ctrl+D` | Go to Dashboard | Navigate to dashboard page |
| `Cmd/Ctrl+N` | Create Proposal | Navigate to proposal creation page |
| `Esc` | Close Modal | Close any open modal or drawer |

### Proposal List Navigation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `↓` (Arrow Down) | Select Next | Move selection down in proposal list |
| `↑` (Arrow Up) | Select Previous | Move selection up in proposal list |
| `Enter` | Open Selected | Navigate to selected proposal detail |

### Command Palette

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd/Ctrl+K` | Open | Open command palette |
| `↓` / `↑` | Navigate | Navigate through command list |
| `Enter` | Execute | Execute selected command |
| `Esc` | Close | Close command palette |
| Type text | Search | Filter commands by search query |

## Architecture

### Hooks

#### `useKeyboardShortcuts`

Generic keyboard shortcut handler that registers event listeners for specified key combinations.

```typescript
const shortcuts = [
  { key: 'd', ctrlKey: true, action: goToDashboard },
  { key: 'n', ctrlKey: true, action: createProposal },
];
useKeyboardShortcuts(shortcuts);
```

#### `useArrowKeys`

Specialized hook for arrow key navigation with up/down/left/right callbacks.

```typescript
useArrowKeys({
  onUp: handleSelectPrevious,
  onDown: handleSelectNext,
}, isEnabled);
```

#### `useEnterKey`

Hook for handling Enter key press with optional enable condition.

```typescript
useEnterKey(handleOpenSelected, isEnabled);
```

#### `useCommandPalette`

Manages command palette state and keyboard shortcuts for opening/closing.

```typescript
useCommandPalette(commands, onOpen, isOpen);
```

### Components

#### `CommandPalette`

Modal component displaying searchable list of commands with keyboard navigation.

**Props:**
- `isOpen: boolean` - Controls palette visibility
- `onClose: () => void` - Called when palette should close
- `commands: SearchCommand[]` - List of available commands

**Features:**
- Auto-focus search input on open
- Real-time command filtering
- Keyboard navigation with arrow keys
- Command execution on Enter or click
- Close on Escape or backdrop click

#### `KeyboardHints`

Help panel displaying all available keyboard shortcuts with platform-aware key labels.

**Features:**
- Toggle visibility on button click
- Detects Mac vs Windows/Linux for Cmd vs Ctrl display
- Shows all shortcuts with descriptions
- Accessible with ARIA attributes

### Integration Points

#### App.tsx

- Registers global keyboard shortcuts
- Manages command palette state
- Provides command list for palette

#### Proposals.tsx

- Arrow key navigation for proposal list
- Visual selection highlighting
- Enter key to open selected proposal

#### Header.tsx

- KeyboardHints button in navigation bar
- Accessible help for users

## Platform Compatibility

The implementation detects the user's platform and adapts:

- **Mac**: Uses `Cmd` key (metaKey)
- **Windows/Linux**: Uses `Ctrl` key (ctrlKey)

Platform detection:
```typescript
const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
```

## Accessibility

All keyboard shortcuts are implemented with accessibility in mind:

- ARIA attributes on interactive elements
- Keyboard focus management
- Screen reader announcements
- Visual indicators for selected items
- Focus rings on focusable elements

## Testing

Comprehensive test coverage includes:

- Hook behavior and cleanup
- Component rendering and interaction
- Keyboard event handling
- Platform-specific behavior
- Accessibility attributes

Test files:
- `useKeyboardShortcuts.test.ts`
- `useArrowKeys.test.ts`
- `useEnterKey.test.ts`
- `useCommandPalette.test.ts`
- `CommandPalette.test.ts`
- `KeyboardHints.test.ts`
- `proposals-keyboard-navigation.test.ts`
- `app-command-palette.test.ts`

## Future Enhancements

Potential improvements:

1. **More Shortcuts**: Add shortcuts for voting, profile, etc.
2. **Customization**: Allow users to customize shortcuts
3. **Global Help**: Keyboard shortcut overlay (e.g., press `?`)
4. **Command History**: Recent commands in palette
5. **Context-Aware**: Different shortcuts based on current page
6. **Visual Hints**: On-screen indicators for available shortcuts

## Browser Compatibility

Tested and working in:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Performance

- Event listeners cleaned up on component unmount
- Minimal re-renders with proper memoization
- Efficient keyboard event handling
- Debounced search in command palette

## Usage Examples

### Adding a New Shortcut

1. Define the action function:
```typescript
const myAction = () => navigate('/my-page');
```

2. Add to shortcuts array:
```typescript
const shortcuts = [
  { key: 'm', ctrlKey: true, action: myAction },
];
```

3. Register with hook:
```typescript
useKeyboardShortcuts(shortcuts);
```

### Adding a New Command

Add to command list in App.tsx:
```typescript
{
  id: 'my-command',
  title: 'My Command',
  description: 'Description of command',
  shortcut: 'Cmd+M',
  action: myAction,
}
```

## Troubleshooting

**Shortcut not working:**
- Check if another element has focus
- Verify key combination is correct
- Check browser console for errors

**Command palette not opening:**
- Verify `Cmd/Ctrl+K` is not captured by browser
- Check that useCommandPalette hook is registered

**Arrow keys scrolling page:**
- Ensure preventDefault() is called in handler
- Check enabled condition is true

## Credits

Implementation follows accessibility best practices from:
- WAI-ARIA Authoring Practices
- Web Content Accessibility Guidelines (WCAG)
- React best practices for keyboard handling
