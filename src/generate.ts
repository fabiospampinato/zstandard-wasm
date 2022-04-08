
/* IMPORT */

import decode from 'decode-base64';
import once from 'once';
import type {Instance} from './types';

/* MAIN */

const generate = ( ZSTD_BASE64: string ) => {

  const ZSTD = {

    /* LIFECYCLE API */

    loadWASM: once ( async (): Promise<void> => {

      let heap: Uint8Array;

      const initHeap = () => heap = new Uint8Array ( instance!.memory.buffer );

      const ZSTD_BUFFER = decode ( ZSTD_BASE64 );

      const IMPORTS = { env: { emscripten_notify_memory_growth: initHeap } };

      const wasm = await WebAssembly.instantiate ( ZSTD_BUFFER, IMPORTS );

      const instance: Instance = wasm.instance.exports as any; //TSC

      initHeap ();

      ZSTD.decompress = ( data: Uint8Array, size?: number ): Uint8Array => {

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

      };

    }),

    /* API */

    decompress: ( data: Uint8Array, size?: number ): Uint8Array => {

      throw new Error ( `[zstd] You need to call and await "zstd.loadWASM" first` );

    }

  };

  return ZSTD;

};

/* EXPORT */

export default generate;
