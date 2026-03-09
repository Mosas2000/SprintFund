import { PROPOSAL_RULES } from '../lib/validation';

interface CharacterCounterProps {
  /** Current character count of the field value. */
  current: number;
  /** Which proposal field this counter is for. */
  field: 'title' | 'description';
}

/**
 * Visual character counter that changes color based on how close the
 * user is to the minimum or maximum length. Displays "X / max" text
 * and shifts from muted -> yellow -> red as limits are approached.
 */
export function CharacterCounter({ current, field }: CharacterCounterProps) {
  const { minLength, maxLength } = PROPOSAL_RULES[field];
  const remaining = maxLength - current;

  let colorClass = 'text-muted';
  if (current > 0 && current < minLength) {
    colorClass = 'text-yellow-400';
  } else if (remaining <= 10) {
    colorClass = 'text-red';
  } else if (remaining <= 30) {
    colorClass = 'text-yellow-400';
  }

  return (
    <span className={`text-xs tabular-nums transition-colors ${colorClass}`}>
      {current} / {maxLength}
    </span>
  );
}
