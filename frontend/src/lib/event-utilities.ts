import { ContractEvent } from '../types/contract-events';

export const groupEventsByCategory = (
  events: ContractEvent[]
): Map<string, ContractEvent[]> => {
  const grouped = new Map<string, ContractEvent[]>();

  for (const event of events) {
    if (!grouped.has(event.category)) {
      grouped.set(event.category, []);
    }
    grouped.get(event.category)!.push(event);
  }

  return grouped;
};

export const filterEventsByStatus = (
  events: ContractEvent[],
  status: 'success' | 'failed'
): ContractEvent[] => {
  return events.filter(e => e.status === status);
};

export const getEventStats = (events: ContractEvent[]) => {
  return {
    total: events.length,
    succeeded: events.filter(e => e.status === 'success').length,
    failed: events.filter(e => e.status === 'failed').length,
    byCategory: events.reduce(
      (acc, event) => {
        acc[event.category] = (acc[event.category] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
};

export const getRecentEvents = (events: ContractEvent[], count: number = 10) => {
  return events.slice(0, Math.min(count, events.length));
};

export const getEventAmount = (event: ContractEvent): number => {
  if (event.amount) {
    return Number(event.amount);
  }
  if (event.weight) {
    return event.weight;
  }
  return 0;
};

export const getTotalAmount = (events: ContractEvent[]): number => {
  return events.reduce((sum, event) => sum + getEventAmount(event), 0);
};

export const getAverageAmount = (events: ContractEvent[]): number => {
  if (events.length === 0) return 0;
  return getTotalAmount(events) / events.length;
};
