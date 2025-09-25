

import { io, Socket } from 'socket.io-client';
import type { SocketEvents } from '../types/room';

class RoomSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(token: string, events: Partial<SocketEvents>): Promise<void> {

    return new Promise((resolve, reject) => {
      try {        
        this.socket = io( 'http://localhost:3000', {
          auth: { token },
          transports: ['websocket'],
          autoConnect: false
        });
        
        // Connection events
        this.socket.on('connect', () => {
          console.log('Socket connected');
          this.reconnectAttempts = 0;
          resolve();
        });
        
        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, don't reconnect
            return;
          }
          this.handleReconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        // Register event handlers
        Object.entries(events).forEach(([event, handler]) => {
          if (this.socket && handler) {
            this.socket.on(event, handler);
          }
        });

        // Connect
        this.socket.connect();
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      
      setTimeout(() => {
        if (this.socket) {
          this.socket.connect();
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  // Emit events
  changeProblem(problemNumber: number) {
    this.socket?.emit('change-problem', { problemNumber });
  }

  updateCode(code: string, language: string, problemNumber: number) {
    this.socket?.emit('code-update', { code, language, problemNumber });
  }

  updateWhiteboard(data: any) {
    this.socket?.emit('whiteboard-update', data);
  }

  updatePermissions(targetUserId: string, permissions: any) {
    this.socket?.emit('update-permissions', { targetUserId, permissions });
  }

  kickUser(targetUserId: string, reason?: string) {
    this.socket?.emit('kick-user', { targetUserId, reason });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const roomSocketService = new RoomSocketService();
