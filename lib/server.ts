import { ECS, ECSEvent, EventWriter } from 'raxis';
import { WebSocketServer, WebSocket } from 'ws';

export type SocketData = { type: string; body: ArrayBufferLike };

export class SocketOpenEvent extends ECSEvent {
	constructor(public handler: ServerHandler, public socket: WebSocket) {
		super();
	}

	clone() {
		return new SocketOpenEvent(this.handler, this.socket);
	}
}

export class SocketMessageEvent extends ECSEvent {
	constructor(
		public handler: ServerHandler,
		public type: string,
		public body: ArrayBufferLike,
		public socket: WebSocket
	) {
		super();
	}

	clone() {
		return new SocketMessageEvent(this.handler, this.type, structuredClone(this.body), this.socket);
	}
}

export class SocketCloseEvent extends ECSEvent {
	constructor(public handler: ServerHandler, public reason: string, public code: number, public socket: WebSocket) {
		super();
	}

	clone() {
		return new SocketCloseEvent(this.handler, this.reason, this.code, this.socket);
	}
}

export class SocketErrorEvent extends ECSEvent {
	constructor(public handler: ServerHandler, public err: Error, public socket: WebSocket) {
		super();
	}

	clone() {
		return new SocketErrorEvent(this.handler, this.err, this.socket);
	}
}

export class ServerHandler {
	server: WebSocketServer;

	constructor(
		readonly path: string,
		private soe: EventWriter<SocketOpenEvent>,
		private sme: EventWriter<SocketMessageEvent>,
		private sce: EventWriter<SocketCloseEvent>,
		private see: EventWriter<SocketErrorEvent>
	) {
		this.server = new WebSocketServer({ noServer: true });

		this.server.on('connection', (ws) => {
			this.soe.send(new SocketOpenEvent(this, ws));
			WebSocket;
			ws.on('message', (data: ArrayBuffer) => {
				const length = new Uint8Array(data)[0];
				const type = String.fromCodePoint(...new Uint16Array(data.slice(1, 1 + length * 2)));
				const body = data.slice(1 + length * 2);

				this.sme.send(new SocketMessageEvent(this, type, body, ws));
			});

			ws.on('close', (code, reason) => {
				this.sce.send(new SocketCloseEvent(this, reason.toString(), code, ws));
			});

			ws.on('error', (err) => {
				this.see.send(new SocketErrorEvent(this, err, ws));
			});
		});
	}

	onDestroy(): void {
		this.server.close();
	}
}

export function sendData(socket: WebSocket, type: string, data: ArrayBuffer) {
	if (socket.readyState !== 1) return;

	const length = new Uint8Array([type.length]).buffer;
	const text = new Uint16Array(type.split('').map((s) => s.codePointAt(0)!)).buffer;
	const message = new Uint8Array(length.byteLength + text.byteLength + data.byteLength);

	message.set(new Uint8Array(length), 0);
	message.set(new Uint8Array(text), length.byteLength);
	message.set(new Uint8Array(data), length.byteLength + text.byteLength);

	socket.send(message.buffer);
}

export function ServerPlugin(ecs: ECS) {
	ecs.addEventTypes(SocketOpenEvent, SocketMessageEvent, SocketCloseEvent, SocketErrorEvent);
}
