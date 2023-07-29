import { ECS } from 'raxis';
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
				const decoded = new TextDecoder().decode(body);
				console.log(type, decoded);

				sendData(
					socket,
					'update',
					stitch(encodeString('yup yup yup'), encodeString('give me my rockets back'))
				);
			});
	})
	.run();

export function encodeString(str: string): ArrayBuffer {
	return new TextEncoder().encode(str).buffer;
}

export function decodeString(buffer: ArrayBuffer): string {
	return new TextDecoder().decode(buffer);
}

export function stitch(...buffers: ArrayBuffer[]): ArrayBuffer {
	const message = new Uint8Array(2 + buffers.length * 2 + buffers.reduce((a, b) => a + b.byteLength, 0));

	const hlength = new Uint16Array([buffers.length]).buffer;
	const psizes = new Uint16Array(buffers.map((b) => b.byteLength)).buffer;

	message.set(new Uint8Array(hlength), 0);
	message.set(new Uint8Array(psizes), 2);

	let offset = hlength.byteLength + psizes.byteLength;
	for (let i = 0; i < buffers.length; i++) {
		message.set(new Uint8Array(buffers[i]), offset);
		offset += buffers[i].byteLength;
	}

	return message.buffer;
}

export function unstitch(buffer: ArrayBuffer): ArrayBuffer[] {
	const hlength = new Uint16Array(buffer)[0];
	const psizes = new Uint16Array(buffer.slice(2, 2 + hlength * 2));

	const data = new Array(psizes.length);

	let offset = 2 + hlength * 2;
	for (let i = 0; i < psizes.length; i++) {
		data[i] = buffer.slice(offset, (offset += psizes[i]));
	}

	return data;
}
