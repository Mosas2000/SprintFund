/* ── Comment time formatting ───────────────────── */

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

/**
 * Format a timestamp into a human-readable relative time string.
 * Examples: "Just now", "5m ago", "2h ago", "3d ago", "2w ago", "Jan 15, 2025"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 0) return 'Just now';
  if (diff < MINUTE_MS) return 'Just now';
  if (diff < HOUR_MS) {
    const minutes = Math.floor(diff / MINUTE_MS);
    return `${minutes}m ago`;
  }
  if (diff < DAY_MS) {
    const hours = Math.floor(diff / HOUR_MS);
    return `${hours}h ago`;
  }
  if (diff < WEEK_MS) {
    const days = Math.floor(diff / DAY_MS);
    return `${days}d ago`;
  }
  if (diff < MONTH_MS) {
    const weeks = Math.floor(diff / WEEK_MS);
    return `${weeks}w ago`;
  }
  if (diff < YEAR_MS) {
    const months = Math.floor(diff / MONTH_MS);
    return `${months}mo ago`;
  }

  // For very old comments, show the full date
  return formatAbsoluteDate(timestamp);
}

/**
 * Format a timestamp into an absolute date string.
 * Example: "Jan 15, 2025"
 */
export function formatAbsoluteDate(timestamp: number): string {
  const date = new Date(timestamp);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Format a timestamp into a full date and time string.
 * Example: "Jan 15, 2025 at 2:30 PM"
 */
export function formatFullDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  const dateStr = formatAbsoluteDate(timestamp);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const minuteStr = minutes < 10 ? `0${minutes}` : String(minutes);
  return `${dateStr} at ${hours}:${minuteStr} ${ampm}`;
}

/**
 * Truncate a Stacks address for display.
 * Example: "SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE" -> "SP3FBR...5SVTE"
 */
export function shortenAddress(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-5)}`;
}

/**
 * Get the initials from a Stacks address for avatar display.
 * Returns the first two characters of the address.
 */
export function getAddressInitials(address: string): string {
  if (!address || address.length < 2) return '??';
  return address.slice(0, 2).toUpperCase();
}
