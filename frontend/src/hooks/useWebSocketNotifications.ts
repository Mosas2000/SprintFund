import { useEffect, useRef, useState } from 'react';
import { StacksWsManager } from '../lib/stacks-ws-manager';
import type { WsConnectionState } from '../lib/stacks-ws-manager';
import { parseWsTransaction } from '../lib/ws-transaction-parser';
import { useAddNotifications } from '../store/notification-selectors';
import { useWalletStore } from '../store/wallet';

export function useWebSocketNotifications() {
  const addNotifications = useAddNotifications();
  const address = useWalletStore((s) => s.address);
  const [connectionState, setConnectionState] = useState<WsConnectionState>('closed');
  const managerRef = useRef<StacksWsManager | null>(null);

  useEffect(() => {
    const manager = new StacksWsManager({
      onMessage: (message) => {
        const notification = parseWsTransaction(message, address);
        if (notification) {
          addNotifications([notification]);
        }
      },
      onStateChange: setConnectionState,
    });

    managerRef.current = manager;
    manager.connect();

    return () => {
      manager.disconnect();
      managerRef.current = null;
    };
  }, [addNotifications, address]);

  return { connectionState };
}
