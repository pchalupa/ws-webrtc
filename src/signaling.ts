import { createServer, type Server as HttpServer } from 'http';
import { Server, OPEN, type RawData, type WebSocket } from 'ws';

const server = createServer();

createSignalingServer(server);

const sendToClient = (client: WebSocket, message: string) => {
	if (isConnected(client)) client.send(message);
};

const sendToAllClients = (clients: Set<WebSocket>, message: string) => {
	clients.forEach((client) => sendToClient(client, message));
};

const isConnected = (client: WebSocket) => client.readyState === OPEN;

function createSignalingServer(server: HttpServer) {
	const webSocket = new Server({ server });

	const handleMessage = (message: RawData) => sendToAllClients(webSocket.clients, message.toString('utf-8'));

	const handleError = () => webSocket.close();

	const handleConnection = (socket: WebSocket) => {
		socket.on('message', handleMessage);
		socket.on('error', handleError);
	};

	webSocket.on('connection', handleConnection);
}

server.listen(8080);
