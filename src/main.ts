import { ECS, Resource } from 'raxis';
import { HostPlugin, HostSettings, ServerPlugin, SocketMessageEvent, createServerPath, sendData } from 'raxis-server';

new ECS()
	.insertPlugins(HostPlugin, ServerPlugin)
	.insertResource(new HostSettings({ port: 7900, cb: (p) => console.log(`Listening on ${p}`) }))
	.addStartupSystem((ecs) => {
		createServerPath(ecs, 'test');
		console.time('dt');
	})
	.addMainSystem((ecs: ECS) => {
		ecs.getEventReader(SocketMessageEvent)
			.get()
			.forEach(({ type, body, socket }) => {
				sendData(socket, type, body);
			});

		console.timeEnd('dt');
		console.time('dt');
	})
	.run(30);
