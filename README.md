# Zstandard WASM

A fast and small port of Zstandard to WASM. (Decompress-only for now).

## Features

- **Fast**: Zstandard has been compiled with the `-03` flag, so all optimizations are enabled and it will go pretty fast. Potentially in the future Zstandard could be recompiled with SIMD instructions too.
- **Small**: the whole library weighs ~27kb min+gizpped, with no third-party dependencies other than Zstandard itself, which is bundled-in.
- **Up-to-date**: starting from v1.5.0 of Zstandard this library aims to remain up to date with it, if you need version X of Zstandard install version X of `zstandard-wasm`.
- **Decompress-only**: for now only a way to decompress `zstd` archives is exposed, potentially in the future a way to make `zstd` archives could be exposed too.
- **TypeScript-ready**: the library is written in TypeScript so the exposed interface is clear.
- **Easy to use**: using this module is easy, there's no need for a special bundler plugin and it works both in the browser and in Node.js.

## Install

```sh
npm install --save zstandard-wasm
```

## Usage

```ts
import fs from 'fs';
import zstd from 'zstandard-wasm';

await zstd.loadWASM (); // First of all you need to load the WASM instance and wait for it

const compressed = fs.readFileSync ( 'something.zst' ); // You get a Buffer or Uint8Array to decompress
const decompressed = zstd.decompress ( compressed ); // You get a Uint8Array containing the decompressed data
```

## Limitations

- This library doesn't support streaming decompression (yet?), so in order for it to decompress an archive you have to make sure that either the archive itself contains some metadata about the size of the uncompressed archive or you pass the `decompress` function the appropriate size number manually. This isn't a problem in practice if you just make archives via a simple `zstd -9 file.txt` or something, but if you are doing something fancier than that you might want to check that this library is actually able to decompress your files before shipping them.

## Licenses

- Library: MIT © Fabio Spampinato
- Zstandard: [BSD © Facebook, Inc.](https://raw.githubusercontent.com/facebook/zstd/dev/LICENSE)
