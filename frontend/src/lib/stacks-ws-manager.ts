import type { WsMessage } from '../types/notification';

const STACKS_WS_URL = 'wss://api.mainnet.hiro.so';

export type WsConnectionState = 'connecting' | 'open' | 'closed' | 'error';
export type WsMessageHandler = (message: WsMessage) => void;
export type WsStateHandler = (state: WsConnectionState) => void;

interface WsManagerOptions {
  url?: string;
  onMessage: WsMessageHandler;
  onStateChange?: WsStateHandler;
  reconnectDelay?: number;
  maxReconnects?: number;
}

export class StacksWsManager {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: WsMessageHandler;
  private onStateChange: WsStateHandler;
  private reconnectDelay: number;
  private maxReconnects: number;
  private reconnectCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  constructor(options: WsManagerOptions) {
    this.url = options.url ?? STACKS_WS_URL;
    this.onMessage = options.onMessage;
    this.onStateChange = options.onStateChange ?? (() => {});
    this.reconnectDelay = options.reconnectDelay ?? 3000;
    this.maxReconnects = options.maxReconnects ?? 10;
  }

  connect(): void {
    if (this.disposed) return;
    this.cleanup();
    this.onStateChange('connecting');

    try {
      this.ws = new WebSocket(this.url);
    } catch {
      this.onStateChange('error');
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this.reconnectCount = 0;
      this.onStateChange('open');
      this.subscribe();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WsMessage;
        this.onMessage(data);
      } catch {
        // Ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.onStateChange('closed');
      if (!this.disposed) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      this.onStateChange('error');
    };
  }

  disconnect(): void {
    this.disposed = true;
    this.cleanup();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private subscribe(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      jsonrpc: '2.0',
      method: 'subscribe',
      params: {
        event: 'transaction',
      },
      id: 1,
    }));
  }

  private cleanup(): void {
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.disposed || this.reconnectCount >= this.maxReconnects) return;
    this.reconnectCount++;
    const delay = this.reconnectDelay * Math.min(this.reconnectCount, 5);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
}
