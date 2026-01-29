export function formatLocalizedTime(timestamp: number | Date) {
    const date = new Date(timestamp);

    return {
        relative: getRelativeTime(date),
        full: date.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        iso: date.toISOString(),
    };
}

function getRelativeTime(date: Date) {
    const now = new Date();
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (Math.abs(diffInSeconds) < 60) return 'Just now';
    if (Math.abs(diffInSeconds) < 3600) return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
    if (Math.abs(diffInSeconds) < 86400) return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');

    return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
}

export function isDeadlineApproaching(deadline: Date, hoursThreshold = 24) {
    const now = new Date();
    const diffInHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours > 0 && diffInHours <= hoursThreshold;
}
