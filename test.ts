import test from 'ava';
import * as Stream from 'stream';
import {checksum, checksumFile} from './src/index';

const fooCRC32 = '8c736521';
const fooCRC32Base64 = 'jHNlIQ==';
const fooCRC32Base64Url = 'jHNlIQ';

test('checksum() should checksum strings', async (t) => {
	t.is(await checksum('foo', 'crc32'), fooCRC32);
});

test('checksum() should checksum Buffers', async (t) => {
	t.is(await checksum(Buffer.from('foo'), 'crc32'), fooCRC32);
});

test('checksum() should checksum Readable streams', async (t) => {
	const stream = new Stream.Readable({
		read() {
			this.push('foo');
			this.push(null);
		},
	});
	t.is(await checksum(stream, 'crc32'), fooCRC32);
});

test('checksum() should use available algos', async (t) => {
	t.is(await checksum('foo', 'md5'), 'acbd18db4cc2f85cedef654fccc4a4d8');
	t.is(await checksum('foo', 'sha1'), '0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33');
	t.is(await checksum('foo', 'sha256'), '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae');
	t.is(
		await checksum('foo', 'sha512'),
		'f7fbba6e0636f890e56fbbf3283e524c6fa3204ae298382d624741d0dc6638326e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'
	);
});

test('checksum() should use passed encoding', async (t) => {
	t.is(await checksum('foo', 'crc32', 'base64'), fooCRC32Base64);
	t.is(await checksum('foo', 'crc32', 'base64url'), fooCRC32Base64Url);
});

test('checksumFile() should checksum files', async (t) => {
	t.is(await checksumFile('fixtures/foo.txt', 'crc32'), fooCRC32);
});

test('checksumFile() should use passed encoding', async (t) => {
	t.is(await checksumFile('fixtures/foo.txt', 'crc32', 'base64'), fooCRC32Base64);
});
