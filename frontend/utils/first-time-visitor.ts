const FIRST_TIME_VISITOR_KEY = 'sprintfund_first_visit';

export function isFirstTimeVisitor(): boolean {
  if (typeof window === 'undefined') return false;
  return !localStorage.getItem(FIRST_TIME_VISITOR_KEY);
}

export function markVisitorAsReturning(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FIRST_TIME_VISITOR_KEY, JSON.stringify({ timestamp: Date.now() }));
}

export function resetFirstTimeVisitorFlag(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FIRST_TIME_VISITOR_KEY);
}

export function getFirstVisitTimestamp(): number | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(FIRST_TIME_VISITOR_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data).timestamp;
  } catch {
    return null;
  }
}
