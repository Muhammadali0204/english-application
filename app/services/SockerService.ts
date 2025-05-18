// services/SocketService.ts
import { API_BASE_URL } from '@env';
import { WebSocketMessage } from 'types/ws';

class SocketService {
  private socket: WebSocket | null = null;
  private listeners: ((data: any) => void)[] = [];

  connect(token: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('🔁 WebSocket already connected');
      return;
    }

    this.socket = new WebSocket(`wss://${API_BASE_URL}/api/ws/?token=${encodeURIComponent(token)}`);

    this.socket.onopen = () => {
      console.log('✅ WebSocket connected');
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
    };
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket is not open. Message not sent.');
    }
  }

  close() {
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
