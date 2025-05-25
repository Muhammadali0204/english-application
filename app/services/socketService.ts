import { API_BASE_URL } from '@env';
import { WebSocketMessage } from 'types/ws';

class SocketService {
  private socket: WebSocket | null = null;
  private listeners: ((data: any) => void)[] = [];
  private reconnectInterval = 5000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private token: string | null = null;
  private manuallyClosed = false;

  connect(token: string) {
    this.token = token;
    this.manuallyClosed = false;

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('🔁 WebSocket already connected');
      return;
    }

    this.socket = new WebSocket(`wss://${API_BASE_URL}/api/ws/?token=${encodeURIComponent(token)}`);

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📩 WebSocket message:', data);
      this.listeners.forEach((listener) => listener(data));
    };

    this.socket.onerror = (e) => {
      console.error('❌ WebSocket error', e);
    };

    this.socket.onclose = () => {
      console.log('🛑 WebSocket disconnected');
      this.socket = null;

      if (!this.manuallyClosed) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout || this.manuallyClosed) return;

    console.log(`🔄 Trying to reconnect in ${this.reconnectInterval / 1000}s...`);
    this.reconnectTimeout = setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, this.reconnectInterval);
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Message not sent.');
    }
  }

  close() {
    this.manuallyClosed = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.socket?.close();
    this.socket = null;
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  subscribe(listener: (data: WebSocketMessage) => void) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: (data: WebSocketMessage) => void) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }
}

export const socketService = new SocketService();
