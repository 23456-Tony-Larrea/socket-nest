import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private activeAlerts: Map<number, string> = new Map(); // alertId to client ID map

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    client.emit('alertConnected');
  }

  handleDisconnect(client: Socket) {
    const alertId = Array.from(this.activeAlerts.keys()).find(key => this.activeAlerts.get(key) === client.id);
    if (alertId) {
      this.activeAlerts.delete(alertId);
      this.server.emit('alertReleased', { alertId });
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('manageAlert')
  handleManageAlert(@MessageBody() data: { alertId: number }, @ConnectedSocket() client: Socket) {
    const { alertId } = data;
    if (this.activeAlerts.has(alertId)) {
      client.emit('alertInUse', { alertId });
    } else {
      this.activeAlerts.set(alertId, client.id);
      client.emit('alertManaged', { alertId });
    }
  }

  @SubscribeMessage('releaseAlert')
  handleReleaseAlert(@MessageBody() data: { alertId: number }, @ConnectedSocket() client: Socket) {
    const { alertId } = data;
    if (this.activeAlerts.get(alertId) === client.id) {
      this.activeAlerts.delete(alertId);
      this.server.emit('alertReleased', { alertId });
    }
  }
}
