# @tomasklaen/checksum

A utility to checksum a string, buffer, readable stream, or a file at provided path.

Supports `crc32` and all algorithms supported by `crypto.createHash(algorithmName)` of the current Node.js process.

Run this to find out exactly what algorithms are available in your environment:

```
node -e "console.log(crypto.getHashes())"
```

These _should_ be available everywhere: `md5`, `sha1`, `sha256`, `sha512`

## Install

```
npm install @tomasklaen/checksum
```

## Usage

CommonJS:

```js
const {checksum, checksumFile} = require('@tomasklaen/checksum');
```

ES modules:

```ts
import {checksum, checksumFile} from '@tomasklaen/checksum';

await checksum('foo', 'crc32'); // '8c736521'
await checksumFile('/path/to/foo.txt', 'crc32'); // '8c736521'
```

## API

Everything exported by the module:

### checksum

```ts
function checksum(input: string | Buffer | Uint8Array | Stream.Readable, algorithm: string): Promise<string>;
```

Accepts `input`, and creates a checksum out of it using requested `algorithm`.

#### `input`

Type: `string | Buffer | Uint8Array | Stream.Readable`

#### `algorithm`

Type: `string`

Can be `crc32` or any algorithm supported by `crypto.createHash(algorithmName)` of the current Node.js process.

Run this to find out exactly what algorithms are available in your environment:

```
node -e "console.log(crypto.getHashes())"
```

#### Returns

Promise that resolves with checksum hash.

### checksumFile

```ts
function checksumFile(path: string, algorithm: string): Promise<string>;
```

Accepts file `path`, and creates a checksum of it using requested `algorithm`.

#### `path`

Type: `string`

Path to a file.

#### `algorithm`

Type: `string`

Can be `crc32` or any algorithm supported by `crypto.createHash(algorithmName)` of the current Node.js process.

Run this to find out exactly what algorithms are available in your environment:

```
node -e "console.log(crypto.getHashes())"
```

#### Returns

Promise that resolves with checksum hash.
