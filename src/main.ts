import { ECS, Resource } from 'raxis';
import { HostPlugin, HostSettings, ServerPlugin, SocketMessageEvent, createServerPath, sendData } from 'raxis-server';

new ECS()
	.insertPlugins(HostPlugin, ServerPlugin)
	.insertResource(new HostSettings({ port: 7900, cb: (p) => console.log(`Listening on ${p}`) }))
	.addStartupSystem((ecs) => {
		createServerPath(ecs, 'test');
	})
	.addMainSystem((ecs: ECS) => {
		ecs.getEventReader(SocketMessageEvent)
			.get()
			.forEach(({ type, body, socket }) => {
				sendData(socket, type, body);
			});
		if (Math.random() > 0.95) throw new Error('hahahaha');
	})
	.run(30);
