

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
        this.socket = io('http://localhost:3000', {
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
    console.log("=== FRONTEND updateCode called ===");
    console.log("Socket connected?", this.socket?.connected);
    console.log("Socket exists?", !!this.socket);
    console.log("Data being sent:", {
      codeLength: code.length,
      language,
      problemNumber
    });

    if (!this.socket) {
      console.error("❌ No socket instance");
      return;
    }

    if (!this.socket.connected) {
      console.error("❌ Socket not connected");
      return;
    }

    console.log("✅ Emitting code-update event...");
    this.socket.emit('code-update', { code, language, problemNumber });
    console.log("✅ Event emitted successfully");
  }

  // Add this method to RoomSocketService for testing
  testConnection() {
    console.log("=== CONNECTION TEST ===");
    console.log("Socket exists:", !!this.socket);
    console.log("Socket connected:", this.socket?.connected);
    console.log("Socket ID:", this.socket?.id);

    if (this.socket?.connected) {
      console.log("Sending test event...");
      this.socket.emit('test-event', { message: 'Hello from frontend!' });
    }
  }



  // updateWhiteboard(data: any) {
  //   this.socket?.emit('whiteboard-update', data);
  // }

  // For whiteboard updates - SENDING to server
  updateWhiteboard(data: any) {
    if (this.socket) {
      console.log('Sending whiteboard update:', data);
      this.socket.emit('whiteboard-update', data); // Make sure this matches your backend event name
    }
  }

  // For whiteboard updates - RECEIVING from server (don't override this method)
  onWhiteboardUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('whiteboard-changed', callback); // This should match your backend event name
    }
  }

  // Clean up whiteboard listeners
  offWhiteboardUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('whiteboard-changed', callback);
    }
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
