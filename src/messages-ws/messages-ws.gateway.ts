import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wws: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    console.log(token);
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log('Client connected: ', client.id);
    this.messagesWsService.registerClient(client);
    this.wws.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wws.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  onHandleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // console.log({ client: client.id, payload });

    // Emits only to one client, the client in the param
    // client.emit('message-from-server', {
    //   fullName: 'Hello world',
    //   message: payload.message || 'no-message!!',
    // });

    // Emits to all clients expect for the client in the param
    client.broadcast.emit('message-from-server', {
      fullName: 'Hello world',
      message: payload.message || 'no-message!!',
    });

    // Emits to all clients
    // this.wws.emit('message-from-server', {
    //   fullName: 'Hello world',
    //   message: payload.message || 'no-message!!',
    // });
  }
}
