import internal from 'stream';

export function streamToString (stream: internal.Stream) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const chunks: any[] = [];
	return new Promise((resolve, reject) => {
		stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
		stream.on('error', (err) => reject(err));
		stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
	})
}