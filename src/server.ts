import { Component, ECS } from 'raxis-ecs';
import { WebSocketServer, WebSocket } from 'ws';

export type SocketData<T = any> = { type: string; body: T };

export class ServerHandler extends Component {
	server: WebSocketServer;

	constructor(
		public onOpen?: (socket: WebSocket, server: WebSocketServer) => void,
		public onMessage?: (data: SocketData, socket: WebSocket, server: WebSocketServer) => void,
		public onClose?: (code: number, reason: Buffer, socket: WebSocket, server: WebSocketServer) => void,
		public onError?: (error: Error, socket: WebSocket, server: WebSocketServer) => void
	) {
		super();

		this.server = new WebSocketServer({ noServer: true });

		this.onOpen = this.onOpen ?? (() => null);
		this.onMessage = this.onMessage ?? (() => null);
		this.onClose = this.onClose ?? (() => null);
		this.onError = this.onError ?? (() => null);

		this.server.on('connection', (ws) => {
			if (this.onOpen) this.onOpen(ws, this.server);

			ws.on('message', (rawData) => {
				const data = JSON.parse(rawData.toString()) as SocketData;

				if (this.onMessage) this.onMessage(data, ws, this.server);
			});

			ws.on('close', (code, reason) => {
				if (this.onClose) this.onClose(code, reason, ws, this.server);
			});

			ws.on('error', (err) => {
				if (this.onError) this.onError(err, ws, this.server);
			});
		});
	}

	onDestroy(): void {
		this.server.close();
	}
}

export function sendData(socket: WebSocket, type: string, body: any) {
	socket.send(JSON.stringify({ type, body }));
}

export function ServerPlugin(ecs: ECS) {
	ecs.addComponentType(ServerHandler);
}
