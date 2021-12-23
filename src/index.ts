import * as FS from 'fs';
import {createHash} from 'crypto';
import * as Stream from 'stream';
import {promisify} from 'util';

const {CRC32Stream} = require('crc32-stream'); // No types
const pipeline = promisify(Stream.pipeline);

type Encoding = 'base64' | 'base64url' | 'hex';

export const checksumFile = (path: string, algorithm: string, encoding?: Encoding) =>
	checksum(FS.createReadStream(path), algorithm, encoding);

export async function checksum(
	input: string | Buffer | Uint8Array | Stream.Readable,
	algorithm: string,
	encoding: Encoding = 'hex'
): Promise<string> {
	const stream = toReadableStream(input);

	// CRC32 is not supported natively
	if (algorithm === 'crc32') {
		const hash = new CRC32Stream();
		const pipe = pipeline(stream, hash);
		hash.resume();
		await pipe;
		hash.end();
		return Buffer.from(hash.digest()).toString(encoding);
	}

	const hash = createHash(algorithm);
	await pipeline(stream, hash);
	hash.end();
	return hash.digest(encoding);
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
