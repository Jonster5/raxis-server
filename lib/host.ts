import { WebSocketServer } from 'ws';
import { parse } from 'path';
import { Server, createServer } from 'http';
import { ServerHandler, SocketCloseEvent, SocketErrorEvent, SocketMessageEvent, SocketOpenEvent } from './server';
import { Resource, Component, ECS, Entity } from 'raxis';

export class HostSettings extends Resource {
	constructor(
		public options: {
			port?: number;
		}
	) {
		super();
	}
}

export class HTTPHost extends Component {
	constructor(public server: Server, public paths: Map<string, WebSocketServer> = new Map()) {
		super();
	}
}

function setupHost(ecs: ECS) {
	const host = new HTTPHost(createServer());
	const hostSettings = ecs.getResource(HostSettings)!;

	host.server.on('upgrade', (req, soc, head) => {
		const { name } = parse(req.url!);

		if (host.paths.has(name)) {
			host.paths.get(name)!.handleUpgrade(req, soc, head, (ws) => {
				host.paths.get(name)!.emit('connection', ws, req);
			});
		} else {
			soc.destroy();
		}
	});

	host.server.listen(hostSettings.options.port ?? 8080);

	ecs.spawn(host);
}

export function createServerPath(ecs: ECS, host: Entity, path: string): ServerHandler {
	const handler = new ServerHandler(
		path,
		ecs.getEventWriter(SocketOpenEvent),
		ecs.getEventWriter(SocketMessageEvent),
		ecs.getEventWriter(SocketCloseEvent),
		ecs.getEventWriter(SocketErrorEvent)
	);

	host.get(HTTPHost)!.paths.set(path, handler.server);

	return handler;
}

export function HostPlugin(ecs: ECS) {
	ecs.addComponentType(HTTPHost).addStartupSystem(setupHost);
}
