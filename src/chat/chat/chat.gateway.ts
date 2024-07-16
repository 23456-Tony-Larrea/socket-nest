import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*', }, })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private activeConnections: Map<string, string> = new Map(); // IP to client ID map

  handleConnection(client: Socket, ...args: any[]) {
    const clientIp = this.getClientIp(client);

    if (this.activeConnections.has(clientIp)) {
      console.log(`Duplicate connection attempt from IP: ${clientIp}`);
      client.emit('duplicateConnection', { message: 'Ya se está ejecutando esta acción. ¿Quieres desconectarte?' });
    } else {
      this.activeConnections.set(clientIp, client.id);
      console.log(`Client connected: ${client.id}, IP: ${clientIp}`);
    }
  }

  handleDisconnect(client: Socket) {
    const clientIp = this.getClientIp(client);
    this.activeConnections.delete(clientIp);
    console.log(`Client disconnected: ${client.id}, IP: ${clientIp}`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: any): void {
    this.server.emit('receiveMessage', payload);
  }

  @SubscribeMessage('messageRead')
  handleRead(client: Socket, payload: any): void {
    this.server.emit('messageRead', payload);
  }

  private getClientIp(client: Socket): string {
    const ip = client.handshake.headers['x-real-ip'] || client.handshake.address;
    return Array.isArray(ip) ? ip[0] : ip;
  }
}
