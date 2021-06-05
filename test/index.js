
/* IMPORT */

const fs = require ( 'fs' );
const {default: ZSTD} = require ( '../dist' );

/* MAIN */

const test = async () => {

  await ZSTD.loadWASM ();

  const original = fs.readFileSync ( './zstd/zstd.wasm' );
  const compressed = fs.readFileSync ( './zstd/zstd.wasm.zst' );
  const decompressed = ZSTD.decompress ( compressed );

  console.log ( original.equals ( decompressed ), 'Decompression works' );

};

test ();
