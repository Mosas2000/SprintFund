'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { ContractEvent } from '../types/contract-events';
import { fetchContractEventStream } from '../lib/contract-events';

interface UseContractEventsOptions {
  contractPrincipal: string;
  apiUrl?: string;
  pollInterval?: number;
  onNewEvent?: (event: ContractEvent) => void;
}

interface UseContractEventsReturn {
  events: ContractEvent[];
  isLoading: boolean;
  error: Error | null | undefined;
  refetch: () => Promise<void>;
}

export const useContractEvents = ({
  contractPrincipal,
  apiUrl = 'https://api.mainnet.hiro.so',
  pollInterval = 20000,
  onNewEvent,
}: UseContractEventsOptions): UseContractEventsReturn => {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null | undefined>(undefined);
  const previousLengthRef = useRef(0);
  const didInitialLoadRef = useRef(false);

  const refetch = useCallback(async () => {
    setError(null);
    try {
      const fetchedEvents = await fetchContractEventStream(
        contractPrincipal,
        apiUrl
      );
      setEvents(fetchedEvents);

      const previousLength = previousLengthRef.current;

      if (onNewEvent && fetchedEvents.length > previousLength) {
        const newEvents = fetchedEvents.slice(0, fetchedEvents.length - previousLength);
        newEvents.forEach(event => onNewEvent(event));
      }

      previousLengthRef.current = fetchedEvents.length;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [contractPrincipal, apiUrl, onNewEvent]);

  useEffect(() => {
    if (didInitialLoadRef.current) {
      return;
    }

    didInitialLoadRef.current = true;
    setIsLoading(true);
    void refetch();
  }, [refetch]);

  useEffect(() => {
    const interval = setInterval(() => {
      void refetch();
    }, pollInterval);

    return () => clearInterval(interval);
  }, [refetch, pollInterval]);

  return {
    events,
    isLoading,
    error,
    refetch,
  };
};
