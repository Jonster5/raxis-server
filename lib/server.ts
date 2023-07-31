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
	constructor(public handler: ServerHandler, public type: string, public body: Buffer, public socket: WebSocket) {
		super();
	}

	clone() {
		return new SocketMessageEvent(this.handler, this.type, this.body.subarray(), this.socket);
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
		this.server = new WebSocketServer({ noServer: true, skipUTF8Validation: true });

		this.server.on('connection', (ws) => {
			this.soe.send(new SocketOpenEvent(this, ws));

			ws.on('message', (data: Buffer) => {
				const length = data.readUint8(0);
				const type = data.toString('utf8', 1, 1 + length);
				const body = data.subarray(1 + length);

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

export function sendData(socket: WebSocket, type: string, data: Buffer) {
	if (socket.readyState !== 1) return;
	if (type.length > 255) throw new Error('length of type cannot be more than 255 characters');

	const length = Buffer.from(new Uint8Array([type.length]).buffer);
	const text = Buffer.from(type, 'utf-8');
	const message = Buffer.alloc(length.byteLength + text.byteLength + data.byteLength);

	message.set(length, 0);
	message.set(text, length.byteLength);
	message.set(data, length.byteLength + text.byteLength);

	socket.send(message.buffer);
}

export function ServerPlugin(ecs: ECS) {
	ecs.addEventTypes(SocketOpenEvent, SocketMessageEvent, SocketCloseEvent, SocketErrorEvent);
}
