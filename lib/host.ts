import { parse } from 'path';
import { Server, createServer } from 'http';
import { ServerHandler, SocketCloseEvent, SocketErrorEvent, SocketMessageEvent, SocketOpenEvent } from './server';
import { Resource, ECS } from 'raxis';

export class HostSettings extends Resource {
	constructor(
		public options: {
			port?: number;
		}
	) {
		super();
	}
}

export class HTTPHost extends Resource {
	constructor(public server: Server, public paths: Map<string, ServerHandler> = new Map()) {
		super();
	}
}

function setupHost(ecs: ECS) {
	const host = new HTTPHost(createServer());
	const hostSettings = ecs.getResource(HostSettings)!;

	host.server.on('upgrade', (req, soc, head) => {
		const { name } = parse(req.url!);

		if (host.paths.has(name)) {
			host.paths.get(name)!.server.handleUpgrade(req, soc, head, (ws) => {
				host.paths.get(name)!.server.emit('connection', ws, req);
			});
		} else {
			soc.destroy();
		}
	});

	host.server.listen(hostSettings.options.port ?? 8080);

	ecs.insertResource(host);
}

export function createServerPath(ecs: ECS, path: string): ServerHandler {
	const handler = new ServerHandler(
		path,
		ecs.getEventWriter(SocketOpenEvent),
		ecs.getEventWriter(SocketMessageEvent),
		ecs.getEventWriter(SocketCloseEvent),
		ecs.getEventWriter(SocketErrorEvent)
	);

	ecs.getResource(HTTPHost)!.paths.set(path, handler);

	return handler;
}

export function getServerPath(ecs: ECS, path: string): ServerHandler | null {
	return ecs.getResource(HTTPHost)!.paths.get(path) ?? null;
}

export function HostPlugin(ecs: ECS) {
	ecs.addStartupSystem(setupHost);
}
