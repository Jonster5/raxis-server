export function encodeString(str: string): Buffer {
	return Buffer.from(str, 'utf-8');
}

export function decodeString(buffer: Buffer): string {
	return buffer.toString();
}

export function stitch(...buffers: Buffer[]): Buffer {
	const hlength = Buffer.alloc(2);
	hlength.writeUInt16LE(buffers.length);
	const psizes = Buffer.from(Uint16Array.from(buffers.map((b) => b.byteLength)).buffer);

	const message = Buffer.alloc(
		hlength.byteLength + psizes.byteLength + buffers.reduce((a, b) => a + b.byteLength, 0)
	);

	message.set(hlength, 0);
	message.set(psizes, hlength.byteLength);

	let offset = hlength.byteLength + psizes.byteLength;
	for (let i = 0; i < buffers.length; i++) {
		message.set(buffers[i], offset);
		offset += buffers[i].byteLength;
	}

	return message;
}

export function unstitch(buffer: Buffer): Buffer[] {
	const hlength = buffer.readUInt16LE(0);
	const psizes = buffer.subarray(2, 2 + hlength * 2);

	const data = new Array(hlength);

	let offset = 2 + hlength * 2;
	for (let i = 0; i < hlength; i++) {
		data[i] = buffer.subarray(offset, (offset += psizes.readUInt16LE(i * 2)));
	}

	return data;
}
