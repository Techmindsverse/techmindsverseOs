import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class BuildGateway {
  @WebSocketServer()
  server!: Server;

  emitBuildCreated(payload: any) {
    this.server.emit('build_created', payload);
  }

  emitBuildUpdated(payload: any) {
    this.server.emit('build_updated', payload);
  }

  emitToBuild(buildId: string, event: string, payload: any) {
    this.server.to(buildId).emit(event, payload);
  }
}