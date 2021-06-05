
/* TYPES */

type Instance = {
  memory: Uint8Array,
  ZSTD_decompress: ( decompressedPointer: number, decompressedSize: number, compressedPointer: number, compressedSize: number ) => number,
  ZSTD_findDecompressedSize: ( compressedPointer: number, compressedSize: number ) => BigInt,
  free: ( pointer: number ) => void,
  malloc: ( pointer: number ) => number
};

/* EXPORT */

export {Instance};
