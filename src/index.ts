import * as FS from 'fs';
import {createHash} from 'crypto';
import * as Stream from 'stream';
import {promisify} from 'util';

const {CRC32Stream} = require('crc32-stream'); // No types
const pipeline = promisify(Stream.pipeline);

export const checksumFile = (path: string, algorithm: string) => checksum(FS.createReadStream(path), algorithm);

export async function checksum(
	input: string | Buffer | Uint8Array | Stream.Readable,
	algorithm: string
): Promise<string> {
	const stream = toReadableStream(input);

	// CRC32 is not supported natively
	if (algorithm === 'crc32') {
		const hash = new CRC32Stream();
		const pipe = pipeline(stream, hash);
		hash.resume();
		await pipe;
		hash.end();
		return hash.hex().toLowerCase();
	}

	const hash = createHash(algorithm);
	await pipeline(stream, hash);
	hash.end();
	return hash.digest('hex');
}

/**
 * Helpers.
 */

function isReadableStream(value: any): value is Stream.Readable {
	return (
		value != null &&
		typeof value === 'object' &&
		typeof value.read === 'function' &&
		typeof value.pipe === 'function'
	);
}

const toReadableStream = (input: string | Buffer | Uint8Array | Stream.Readable) =>
	isReadableStream(input)
		? input
		: new Stream.Readable({
				read() {
					this.push(input);
					this.push(null);
				},
		  });
