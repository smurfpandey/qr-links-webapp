import openSocket from 'socket.io-client';
import { SOCKET_SERVER } from './config';

let Socket;
let initSocket = () => {
  Socket = openSocket(SOCKET_SERVER)
}

export { Socket, initSocket };