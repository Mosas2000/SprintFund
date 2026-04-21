import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useContractEvents } from './useContractEvents';
import { fetchContractEventStream } from '../lib/contract-events';

vi.mock('../lib/contract-events');

describe('useContractEvents', () => {
  const mockContractPrincipal = 'SP2ZNGJ85ENDY6QTHQ0YCWM1GRFX77YXF1W8F25J9.sprint-fund';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches contract events on mount', async () => {
    const mockEvents = [
      {
        id: 'event-1',
        txId: 'tx-1',
        timestamp: 1000,
        sender: 'SP123',
        category: 'stake' as const,
        status: 'success' as const,
        description: 'Staked',
      },
    ];

    vi.mocked(fetchContractEventStream).mockResolvedValueOnce(mockEvents);

    const { result } = renderHook(() =>
      useContractEvents({
        contractPrincipal: mockContractPrincipal,
        pollInterval: 100000,
      })
    );

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('calls onNewEvent callback for new events', async () => {
    const mockEvents = [
      {
        id: 'event-1',
        txId: 'tx-1',
        timestamp: 1000,
        sender: 'SP123',
        category: 'stake' as const,
        status: 'success' as const,
        description: 'Staked',
      },
    ];

    vi.mocked(fetchContractEventStream).mockResolvedValueOnce(mockEvents);

    const onNewEvent = vi.fn();

    const { result } = renderHook(() =>
      useContractEvents({
        contractPrincipal: mockContractPrincipal,
        pollInterval: 100000,
        onNewEvent,
      })
    );

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    expect(onNewEvent).toHaveBeenCalledWith(mockEvents[0]);
  });

  it('handles fetch errors', async () => {
    const mockError = new Error('API error');
    vi.mocked(fetchContractEventStream).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useContractEvents({
        contractPrincipal: mockContractPrincipal,
        pollInterval: 100000,
      })
    );

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.error?.message).toBe('API error');
  });

  it('refetch updates events', async () => {
    const initialEvents = [
      {
        id: 'event-1',
        txId: 'tx-1',
        timestamp: 1000,
        sender: 'SP123',
        category: 'stake' as const,
        status: 'success' as const,
        description: 'Staked',
      },
    ];

    const updatedEvents = [
      ...initialEvents,
      {
        id: 'event-2',
        txId: 'tx-2',
        timestamp: 2000,
        sender: 'SP456',
        category: 'vote' as const,
        status: 'success' as const,
        description: 'Voted',
      },
    ];

    vi.mocked(fetchContractEventStream)
      .mockResolvedValueOnce(initialEvents)
      .mockResolvedValueOnce(updatedEvents);

    const { result } = renderHook(() =>
      useContractEvents({
        contractPrincipal: mockContractPrincipal,
        pollInterval: 100000,
      })
    );

    await waitFor(() => {
      expect(result.current.events).toHaveLength(1);
    });

    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.events).toHaveLength(2);
    });
  });
});
