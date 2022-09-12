import { createServer } from 'http';
import { Server, OPEN, type RawData, type WebSocket } from 'ws';

const server = createServer();
const webSocket = new Server({ server });

server.listen(8080);
webSocket.on('connection', handleConnection);

function handleConnection(socket: WebSocket) {
	socket.on('message', handleMessage);
	socket.on('error', handleError);
}

function handleMessage(message: RawData) {
	sendToAllClients(webSocket.clients, message.toString('utf-8'));
}

function handleError() {
	webSocket.close();
}

function sendToAllClients(clients: Set<WebSocket>, message: string) {
	clients.forEach((client) => sendToClient(client, message));
}

function sendToClient(client: WebSocket, message: string) {
	if (isConnected(client)) client.send(message);
}

function isConnected(client: WebSocket) {
	return client.readyState === OPEN;
}
