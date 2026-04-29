# Stake Lock Accessibility

## ARIA Labels

All interactive elements have appropriate ARIA labels:
- Buttons have descriptive labels
- Status indicators have role="status"
- Warnings have role="alert"

## Color Contrast

All text meets WCAG AA standards:
- Total stake: white text on dark background
- Locked stake: amber text with sufficient contrast
- Available stake: green text with sufficient contrast

## Keyboard Navigation

All components are fully keyboard accessible:
- Tab navigation works correctly
- Enter/Space activate buttons
- Escape closes expandable sections

## Screen Reader Support

Components provide clear information:
- Status changes announced
- Error messages read aloud
- Lock state clearly communicated

## Visual Indicators

Multiple indicators beyond color:
- Lock icon for locked funds
- Text labels for all states
- Numerical values always shown

## Focus Management

- Focus indicators visible
- Logical tab order
- No keyboard traps

## Testing

Tested with:
- NVDA screen reader
- JAWS screen reader
- VoiceOver (macOS)
- Keyboard only navigation
- High contrast mode
