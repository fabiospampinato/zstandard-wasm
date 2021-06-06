
/* IMPORT */

import decode from 'decode-base64';
import * as ZSTD_BASE64 from '../zstd/zstd';
import {Instance} from './types';

/* HELPERS */

let heap: Uint8Array | undefined;
let instance: Instance | undefined;

/* MAIN */

const ZSTD = {

  /* LIFECYCLE API */

  loadWASM: async (): Promise<void> => {

    if ( instance || heap ) return;

    const initHeap = () => heap = new Uint8Array ( instance!.memory.buffer );

    const ZSTD_BUFFER = decode ( ZSTD_BASE64 );

    const IMPORTS = { env: { emscripten_notify_memory_growth: initHeap } };

    const wasm = await WebAssembly.instantiate ( ZSTD_BUFFER, IMPORTS );

    instance = wasm.instance.exports as any; //TSC

    initHeap ();

  },

  /* API */

  decompress: ( data: Buffer | Uint8Array, size?: number ): Uint8Array => {

    if ( !instance || !heap ) throw new Error( `[zstd] You need to call and await "zstd.loadWASM" first` );

    /* MALLOC-ING COMPRESSED BUFFER */

    const compressedSize = data.byteLength;
    const compressedPointer = instance.malloc ( compressedSize );

    heap.set ( data, compressedPointer );

    /* MALLOC-ING DECOMPRESSED BUFFER */

    const decompressedSize = size || Number ( instance.ZSTD_findDecompressedSize ( compressedPointer, compressedSize ) );
    const decompressedPointer = instance.malloc ( decompressedSize );

    /* DECOMPRESSING */

    const decompressedDataSize = instance.ZSTD_decompress ( decompressedPointer, decompressedSize, compressedPointer, compressedSize );
    const decompressedData = heap.slice ( decompressedPointer, decompressedPointer + decompressedDataSize );

    /* FREE-ING BUFFERS */

    instance.free ( compressedPointer );
    instance.free ( decompressedPointer );

    /* RETURNING */

    return decompressedData;

  }

};

/* EXPORT */

export default ZSTD;
